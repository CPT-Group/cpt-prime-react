import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Query Router Service
 *
 * Analyzes user queries and determines which experts and rules to load.
 * Enables intelligent, context-aware expert system orchestration.
 */

interface ExpertTrigger {
  id: string;
  keywords: string[];
  phrases: string[];
  priority?: string;
}

interface RoutingDecision {
  experts_to_load: string[];
  rules_to_load: string[];
  confidence: number;
  reasoning: string;
  context_detected: string[];
}

export class QueryRouterService {
  private expertRegistry: any = null;

  constructor() {
    this.loadExpertRegistry();
  }

  /**
   * Resolve path to .cursor directory (project root)
   */
  private resolveCursorPath(relativePath: string): string {
    // From dist/services/query-router.service.js to .cursor/
    // dist/services -> dist -> cursor-capabilities-service -> .cursor
    const distToCursor = path.join(__dirname, "../../../");
    const fullPath = path.join(distToCursor, relativePath);
    return path.resolve(fullPath);
  }

  /**
   * Load expert registry from file system
   */
  private async loadExpertRegistry(): Promise<void> {
    try {
      const registryPath = this.resolveCursorPath("experts/expert-registry.json");
      const data = await fs.readFile(registryPath, "utf-8");
      this.expertRegistry = JSON.parse(data);
      // Verify structure
      if (!this.expertRegistry.activeExperts || !Array.isArray(this.expertRegistry.activeExperts)) {
        this.expertRegistry = null;
      }
    } catch (error: any) {
      // Registry failed to load - will retry on first query
      this.expertRegistry = null;
    }
  }

  /**
   * Main routing function - analyzes query and returns what to load
   */
  async routeQuery(query: string, context: any = {}): Promise<RoutingDecision> {
    // Always try to load if missing
    if (!this.expertRegistry) {
      await this.loadExpertRegistry();
    }
    
    // If still no registry, return empty but indicate failure
    if (!this.expertRegistry) {
      return {
        experts_to_load: [],
        rules_to_load: ["expert-consultation-checkpoint"],
        confidence: 0.1,
        reasoning: "Expert registry failed to load - using fallback keyword matching",
        context_detected: []
      };
    }

    // Step 1: Extract keywords and detect context
    const keywords = this.extractKeywords(query);
    const contextType = this.detectContext(query, context);

    // Step 2: Match experts based on triggers
    const expertMatches = await this.matchExperts(query, keywords);

    // Step 3: Determine which rules apply
    const rules = this.determineRules(contextType, expertMatches);

    // Step 4: Build routing decision
    const decision: RoutingDecision = {
      experts_to_load: expertMatches.slice(0, 5).map((m) => m.id), // Top 5
      rules_to_load: rules,
      confidence: this.calculateConfidence(expertMatches),
      reasoning: this.buildReasoning(contextType, expertMatches, keywords),
      context_detected: contextType,
    };

    // Routing decision complete - no console.log to avoid breaking MCP JSON

    return decision;
  }

  /**
   * Extract keywords from query (lowercase, filter common words)
   */
  private extractKeywords(query: string): string[] {
    const commonWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "from",
      "by",
      "this",
      "that",
      "these",
      "those",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "should",
      "could",
      "can",
      "may",
      "might",
      "must",
      "how",
      "what",
      "when",
      "where",
      "why",
      "who",
      "which",
    ]);

    const words = query
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !commonWords.has(w));

    return [...new Set(words)]; // Unique
  }

  /**
   * Detect context type from query and environment
   */
  private detectContext(query: string, context: any): string[] {
    const contexts: string[] = [];
    const lowerQuery = query.toLowerCase();

    // Code-related
    if (
      /\b(code|function|class|method|api|endpoint|implement|create|generate|write)\b/.test(
        lowerQuery
      )
    ) {
      contexts.push("code");
    }

    // Architecture/Design
    if (
      /\b(architecture|design|system|integration|flow|structure|diagram)\b/.test(
        lowerQuery
      )
    ) {
      contexts.push("architecture");
    }

    // Database
    if (
      /\b(database|sql|query|table|schema|postgresql|server)\b/.test(lowerQuery)
    ) {
      contexts.push("database");
    }

    // Documentation
    if (/\b(document|pdf|markdown|diagram|report|export)\b/.test(lowerQuery)) {
      contexts.push("documentation");
    }

    // Expert system itself
    if (/\b(expert|rule|mdc|cursor|orchestrat)\b/.test(lowerQuery)) {
      contexts.push("meta-expert");
    }

    // React/Frontend
    if (
      /\b(react|component|hook|state|props|jsx|tsx|frontend|ui)\b/.test(
        lowerQuery
      )
    ) {
      contexts.push("react");
    }

    // Backend/API
    if (
      /\b(backend|server|api|endpoint|service|controller)\b/.test(lowerQuery)
    ) {
      contexts.push("backend");
    }

    // Check open files from context
    if (context.open_files) {
      const files = Array.isArray(context.open_files)
        ? context.open_files
        : [context.open_files];
      files.forEach((file: string) => {
        if (/\.tsx?$/.test(file)) contexts.push("typescript");
        if (/\.sql$/.test(file)) contexts.push("database");
        if (/\.md$/.test(file)) contexts.push("documentation");
        if (/expert.*\.json$/.test(file)) contexts.push("meta-expert");
      });
    }

    return [...new Set(contexts)];
  }

  /**
   * Match experts based on query keywords and phrases
   */
  private async matchExperts(
    query: string,
    keywords: string[]
  ): Promise<
    Array<{
      id: string;
      score: number;
      matches: string[];
    }>
  > {
    if (!this.expertRegistry?.activeExperts) return [];

    const lowerQuery = query.toLowerCase();
    const matches: Array<{ id: string; score: number; matches: string[] }> = [];

    // Load each expert's behavior file to check triggers
    for (const expertEntry of this.expertRegistry.activeExperts) {
      const expertId = expertEntry.id;
      try {
        const behaviorPath = this.resolveCursorPath(`experts/${expertId}/expert.behavior.json`);
        const data = await fs.readFile(behaviorPath, "utf-8");
        const behavior = JSON.parse(data);

        const triggers = behavior.triggers || {};
        const triggerKeywords = triggers.keywords || [];
        const triggerPhrases = triggers.phrases || [];

        let score = 0;
        const matched: string[] = [];

        // Check keyword matches
        triggerKeywords.forEach((keyword: string) => {
          if (keywords.includes(keyword.toLowerCase())) {
            score += 10;
            matched.push(keyword);
          }
        });

        // Check phrase matches (higher weight)
        triggerPhrases.forEach((phrase: string) => {
          if (lowerQuery.includes(phrase.toLowerCase())) {
            score += 20;
            matched.push(phrase);
          }
        });

        // Check if expert name is mentioned
        if (lowerQuery.includes(expertId.replace(/-/g, " "))) {
          score += 30;
          matched.push(`expert-name:${expertId}`);
        }

        if (score > 0) {
          matches.push({ id: expertId, score, matches: matched });
        }
      } catch (error: any) {
        // Expert behavior file not found or invalid - skip this expert
        // Store failure count for debugging (not logged to avoid breaking MCP JSON)
        continue;
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return matches;
  }

  /**
   * Determine which rules to load based on context
   */
  private determineRules(
    contextTypes: string[],
    expertMatches: any[]
  ): string[] {
    const rules: Set<string> = new Set();

    // Always load core rules
    rules.add("expert-consultation-checkpoint");

    // Context-specific rules
    contextTypes.forEach((ctx) => {
      switch (ctx) {
        case "code":
          rules.add("code-writing-rules");
          rules.add("analyze-before-creating");
          break;
        case "architecture":
          rules.add("architecture-design-mandatory");
          rules.add("requirements-analysis");
          rules.add("architecture-validation");
          break;
        case "database":
          rules.add("mandatory-sql-server-mcp-service");
          rules.add("mandatory-tsql-query-library");
          rules.add("mandatory-postgresql-mcp-service");
          rules.add("mandatory-pgsql-query-library");
          break;
        case "documentation":
          rules.add("no-ascii-art-diagrams");
          rules.add("pdf-horizontal-lines-mandatory");
          break;
        case "meta-expert":
          rules.add("expert-creation-mandatory");
          rules.add("expert-system-activation");
          break;
        case "react":
          rules.add("code-writing-rules");
          break;
      }
    });

    // File-specific rules
    rules.add("mandatory-file-location-enforcement");
    rules.add("mandatory-verify-before-create");

    return Array.from(rules);
  }

  /**
   * Calculate overall confidence score
   */
  private calculateConfidence(matches: any[]): number {
    if (matches.length === 0) return 0.3; // Low confidence if no matches

    // Base confidence on top match score
    const topScore = matches[0]?.score || 0;

    if (topScore >= 30) return 0.95; // Expert explicitly mentioned
    if (topScore >= 20) return 0.85; // Strong phrase match
    if (topScore >= 10) return 0.7; // Keyword matches
    return 0.5; // Weak matches
  }

  /**
   * Build human-readable reasoning
   */
  private buildReasoning(
    contexts: string[],
    matches: any[],
    keywords: string[]
  ): string {
    const parts: string[] = [];

    if (contexts.length > 0) {
      parts.push(`Detected context: ${contexts.join(", ")}`);
    }

    if (matches.length > 0) {
      const topExperts = matches
        .slice(0, 3)
        .map((m) => `${m.id} (score: ${m.score})`)
        .join(", ");
      parts.push(`Top expert matches: ${topExperts}`);
    }

    if (keywords.length > 0) {
      parts.push(`Key terms: ${keywords.slice(0, 5).join(", ")}`);
    }

    return parts.join(". ");
  }

  /**
   * Get status of router service
   */
  getStatus(): any {
    return {
      status: "operational",
      experts_loaded: this.expertRegistry?.activeExperts?.length || 0,
      registry_path: "experts/expert-registry.json",
      features: [
        "keyword extraction",
        "context detection",
        "expert matching",
        "rule determination",
        "confidence scoring",
      ],
    };
  }
}
