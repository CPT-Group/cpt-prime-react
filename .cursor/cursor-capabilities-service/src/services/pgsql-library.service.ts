import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

/**
 * PostgreSQL Query Library Service
 *
 * Manages a reusable library of validated PostgreSQL query patterns.
 * Prevents duplication, enforces parameterization, and ensures only
 * successful queries are stored.
 *
 * Features:
 * - Search queries by keyword, category, or tag
 * - Get query templates with parameter substitution
 * - Add validated queries with metadata
 * - Detect duplicate patterns
 * - Track query usage statistics
 * - PostgreSQL-specific features (JSON, arrays, CTEs, etc.)
 */

interface PgSqlQuery {
  id: string;
  category: string;
  purpose: string;
  description: string;
  sql: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required: boolean;
    example: string;
  }[];
  exampleUsage: string;
  successCriteria: string;
  testedOn: {
    servers: string[];
    databases: string[];
    lastTested: string;
  };
  tags: string[];
  postgresqlFeatures?: string[]; // e.g., ["jsonb", "cte", "window-functions"]
  timesUsed: number;
  addedDate: string;
  lastModified: string;
}

interface PgSqlLibraryConfig {
  queries: PgSqlQuery[];
  categories: string[];
  postgresqlFeatures?: {
    version: string;
    supportedFeatures: string[];
  };
  metadata: {
    created: string;
    lastUpdated: string;
    totalQueries: number;
    version: string;
  };
}

export class PgSqlLibraryService {
  private configPath: string;
  private library: PgSqlLibraryConfig;

  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.configPath = path.join(__dirname, "../../pgsql-query-library.json");

    if (!fs.existsSync(this.configPath)) {
      console.warn(
        "⚠️ PostgreSQL Query Library config not found:",
        this.configPath
      );
      throw new Error("PostgreSQL Query Library file not found");
    }

    this.library = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
    console.log(
      `✅ PostgreSQL Query Library Service initialized with ${this.library.queries.length} queries`
    );
  }

  /**
   * Search queries by keyword, category, or tag
   */
  searchQueries(
    searchTerm?: string,
    category?: string,
    tags?: string[]
  ): PgSqlQuery[] {
    let results = this.library.queries;

    // Filter by category
    if (category) {
      results = results.filter(
        (q) => q.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (q) =>
          q.purpose.toLowerCase().includes(term) ||
          q.description.toLowerCase().includes(term) ||
          q.tags.some((t) => t.toLowerCase().includes(term)) ||
          q.sql.toLowerCase().includes(term)
      );
    }

    // Filter by tags
    if (tags && tags.length > 0) {
      results = results.filter((q) =>
        tags.some((tag) =>
          q.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        )
      );
    }

    // Sort by usage (most used first)
    return results.sort((a, b) => b.timesUsed - a.timesUsed);
  }

  /**
   * Get a specific query by ID
   */
  getQuery(queryId: string): PgSqlQuery | null {
    const query = this.library.queries.find((q) => q.id === queryId);
    if (query) {
      query.timesUsed++;
      this.saveLibrary();
    }
    return query || null;
  }

  /**
   * Get query with parameters replaced
   */
  replaceParameters(
    queryId: string,
    paramValues: { [key: string]: any }
  ): { sql: string; query: PgSqlQuery } | null {
    const query = this.getQuery(queryId);
    if (!query) return null;

    let sql = query.sql;

    // Replace $1, $2, etc. with actual values for preview (NOT for execution!)
    // In real execution, you should use parameterized queries
    for (const [key, value] of Object.entries(paramValues)) {
      const regex = new RegExp(`\\$\\{${key}\\}`, "g");
      sql = sql.replace(regex, String(value));
    }

    return { sql, query };
  }

  /**
   * Add a new query to the library
   */
  addQuery(
    query: Omit<PgSqlQuery, "id" | "timesUsed" | "addedDate" | "lastModified">
  ): {
    success: boolean;
    message: string;
    queryId?: string;
  } {
    // Validate required fields
    if (!query.category || !query.purpose || !query.sql) {
      return {
        success: false,
        message: "Missing required fields: category, purpose, or sql",
      };
    }

    // Check for duplicates
    const similar = this.findSimilarQueries(query.sql);
    if (similar.length > 0) {
      return {
        success: false,
        message: `Similar query already exists: ${similar[0].id} - "${similar[0].purpose}"`,
      };
    }

    // Validate parameterization (PostgreSQL uses $1, $2, etc.)
    if (this.hasHardcodedValues(query.sql)) {
      return {
        success: false,
        message:
          "Query contains hardcoded values. Use parameterized queries with $1, $2, etc. or ${paramName} placeholders.",
      };
    }

    // Generate ID
    const queryId =
      query.category.toLowerCase() +
      "-" +
      query.purpose.toLowerCase().replace(/\s+/g, "-") +
      "-" +
      Date.now();

    const newQuery: PgSqlQuery = {
      ...query,
      id: queryId,
      timesUsed: 0,
      addedDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    this.library.queries.push(newQuery);
    this.library.metadata.totalQueries = this.library.queries.length;
    this.saveLibrary();

    return {
      success: true,
      message: `Query added successfully: ${queryId}`,
      queryId,
    };
  }

  /**
   * Find similar queries (to prevent duplicates)
   */
  findSimilarQueries(sql: string): PgSqlQuery[] {
    const normalized = this.normalizeSql(sql);

    return this.library.queries.filter((q) => {
      const qNormalized = this.normalizeSql(q.sql);
      return this.calculateSimilarity(normalized, qNormalized) > 0.8;
    });
  }

  /**
   * List all categories
   */
  listCategories(): {
    categories: string[];
    queryCounts: { [key: string]: number };
  } {
    const counts: { [key: string]: number } = {};
    this.library.categories.forEach((cat) => {
      counts[cat] = this.library.queries.filter(
        (q) => q.category === cat
      ).length;
    });

    return {
      categories: this.library.categories,
      queryCounts: counts,
    };
  }

  /**
   * Get library statistics
   */
  getStatistics(): any {
    const totalUsage = this.library.queries.reduce(
      (sum, q) => sum + q.timesUsed,
      0
    );
    const mostUsed = [...this.library.queries]
      .sort((a, b) => b.timesUsed - a.timesUsed)
      .slice(0, 5);

    return {
      totalQueries: this.library.queries.length,
      totalUsage,
      categories: this.listCategories(),
      mostUsedQueries: mostUsed.map((q) => ({
        id: q.id,
        purpose: q.purpose,
        timesUsed: q.timesUsed,
        category: q.category,
      })),
      lastUpdated: this.library.metadata.lastUpdated,
    };
  }

  /**
   * Get service status
   */
  getStatus(): any {
    return {
      status: "operational",
      mode: "pgsql-library",
      totalQueries: this.library.queries.length,
      lastUpdated: this.library.metadata.lastUpdated,
      configuredCategories: this.library.categories,
      postgresqlVersion: this.library.postgresqlFeatures?.version,
    };
  }

  // Private helper methods

  private normalizeSql(sql: string): string {
    return sql
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/\$\d+/g, "$PARAM") // Replace $1, $2, etc.
      .replace(/\$\{[^}]+\}/g, "$PARAM") // Replace ${paramName}
      .toLowerCase()
      .trim();
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private hasHardcodedValues(sql: string): boolean {
    // Simple heuristic: check for quoted strings or numbers that aren't parameters
    // This is NOT perfect but catches obvious cases
    const hasQuotedStrings = /'[^']*'/.test(sql);
    const hasUnparameterizedNumbers = /\b\d{4,}\b/.test(sql); // 4+ digit numbers (IDs, years, etc.)

    // Allow common SQL keywords and small numbers
    return hasQuotedStrings || hasUnparameterizedNumbers;
  }

  private saveLibrary() {
    this.library.metadata.lastUpdated = new Date().toISOString();
    if (!this.library.metadata.created) {
      this.library.metadata.created = new Date().toISOString();
    }
    fs.writeFileSync(
      this.configPath,
      JSON.stringify(this.library, null, 2),
      "utf-8"
    );
  }
}
