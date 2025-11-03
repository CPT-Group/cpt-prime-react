import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

/**
 * T-SQL Query Library Service
 *
 * Manages a library of reusable, tested T-SQL queries.
 * Prevents query duplication and provides parameterized templates.
 *
 * Features:
 * - Search existing queries by keyword, category, or tag
 * - Add new successful queries to library
 * - Get query templates with parameter substitution
 * - Track query usage statistics
 * - Enforce quality: Only successful queries are stored
 */

interface QueryParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  example: string;
}

interface QueryTemplate {
  id: string;
  category: string;
  purpose: string;
  description: string;
  tsql: string;
  parameters: QueryParameter[];
  exampleUsage: string;
  successCriteria: string;
  testedOn: {
    servers: string[];
    databases: string[];
    lastTested: string;
  };
  timesUsed: number;
  addedDate: string;
  tags: string[];
}

interface QueryLibrary {
  version: string;
  description: string;
  lastUpdated: string;
  totalQueries: number;
  categories: string[];
  queries: { [key: string]: QueryTemplate };
  usage?: any;
  bestPractices?: string[];
}

export class TsqlLibraryService {
  private library: QueryLibrary;
  private libraryPath: string;

  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.libraryPath = path.join(__dirname, "../../tsql-query-library.json");

    if (!fs.existsSync(this.libraryPath)) {
      console.warn("⚠️  T-SQL query library not found:", this.libraryPath);
      throw new Error("T-SQL query library file not found");
    }

    this.library = JSON.parse(fs.readFileSync(this.libraryPath, "utf-8"));
    console.log(
      `✅ T-SQL Query Library initialized with ${
        this.library.totalQueries
      } quer${this.library.totalQueries === 1 ? "y" : "ies"}`
    );
  }

  /**
   * Search for queries by keyword, category, or tag
   */
  searchQueries(searchTerm: string, category?: string): QueryTemplate[] {
    const results: QueryTemplate[] = [];
    const lowerSearch = searchTerm.toLowerCase();

    for (const [id, query] of Object.entries(this.library.queries)) {
      // Skip if category filter doesn't match
      if (category && query.category !== category) {
        continue;
      }

      // Search in purpose, description, tags
      const matches =
        query.purpose.toLowerCase().includes(lowerSearch) ||
        query.description.toLowerCase().includes(lowerSearch) ||
        query.tags.some((tag) => tag.toLowerCase().includes(lowerSearch)) ||
        id.toLowerCase().includes(lowerSearch);

      if (matches) {
        results.push(query);
      }
    }

    return results;
  }

  /**
   * Get a query by ID
   */
  getQuery(queryId: string): QueryTemplate | null {
    return this.library.queries[queryId] || null;
  }

  /**
   * Get all queries in a category
   */
  getQueriesByCategory(category: string): QueryTemplate[] {
    return Object.values(this.library.queries).filter(
      (q) => q.category === category
    );
  }

  /**
   * List all query categories with counts
   */
  listCategories(): any {
    const categoryCounts: { [key: string]: number } = {};

    for (const category of this.library.categories) {
      categoryCounts[category] = 0;
    }

    for (const query of Object.values(this.library.queries)) {
      if (categoryCounts[query.category] !== undefined) {
        categoryCounts[query.category]++;
      }
    }

    return {
      categories: this.library.categories,
      counts: categoryCounts,
      total: this.library.totalQueries,
    };
  }

  /**
   * Add a new query to the library
   */
  addQuery(
    id: string,
    category: string,
    purpose: string,
    description: string,
    tsql: string,
    parameters: QueryParameter[],
    exampleUsage: string,
    successCriteria: string,
    testedOn: { servers: string[]; databases: string[] },
    tags: string[]
  ): any {
    // Check if query ID already exists
    if (this.library.queries[id]) {
      return {
        success: false,
        error: `Query ID '${id}' already exists. Use a unique ID.`,
        suggestion: `Try: ${id}-v2 or ${id}-${Date.now()}`,
      };
    }

    // Validate category
    if (!this.library.categories.includes(category)) {
      return {
        success: false,
        error: `Invalid category '${category}'`,
        validCategories: this.library.categories,
      };
    }

    // Create query template
    const query: QueryTemplate = {
      id,
      category,
      purpose,
      description,
      tsql,
      parameters,
      exampleUsage,
      successCriteria,
      testedOn: {
        ...testedOn,
        lastTested: new Date().toISOString().split("T")[0],
      },
      timesUsed: 0,
      addedDate: new Date().toISOString(),
      tags,
    };

    // Add to library
    this.library.queries[id] = query;
    this.library.totalQueries++;
    this.library.lastUpdated = new Date().toISOString();

    // Save to file
    this.saveLibrary();

    return {
      success: true,
      message: `Query '${id}' added to library`,
      queryId: id,
      category,
      totalQueries: this.library.totalQueries,
    };
  }

  /**
   * Replace parameters in a query template
   */
  replaceParameters(queryId: string, paramValues: { [key: string]: any }): any {
    const query = this.getQuery(queryId);
    if (!query) {
      return {
        success: false,
        error: `Query '${queryId}' not found`,
      };
    }

    // Check all required parameters are provided
    const missingParams: string[] = [];
    for (const param of query.parameters) {
      if (param.required && !(param.name in paramValues)) {
        missingParams.push(param.name);
      }
    }

    if (missingParams.length > 0) {
      return {
        success: false,
        error: "Missing required parameters",
        missingParameters: missingParams,
        requiredParameters: query.parameters.filter((p) => p.required),
      };
    }

    // Replace parameters in T-SQL
    let tsql = query.tsql;
    for (const [name, value] of Object.entries(paramValues)) {
      // For SQL Server, parameters use @paramName
      const placeholder = `@${name}`;
      // This is just for display - actual execution will use parameterized queries
      tsql = tsql.replace(
        new RegExp(placeholder, "g"),
        this.formatValue(value)
      );
    }

    // Increment usage counter
    query.timesUsed++;
    this.library.lastUpdated = new Date().toISOString();
    this.saveLibrary();

    return {
      success: true,
      queryId,
      purpose: query.purpose,
      tsql,
      originalTemplate: query.tsql,
      parameters: paramValues,
      timesUsed: query.timesUsed,
    };
  }

  /**
   * Format a value for SQL display (not for execution - use parameterized queries for that)
   */
  private formatValue(value: any): string {
    if (typeof value === "string") {
      return `'${value.replace(/'/g, "''")}'`;
    }
    if (value === null) {
      return "NULL";
    }
    return String(value);
  }

  /**
   * Get query statistics
   */
  getStatistics(): any {
    const queries = Object.values(this.library.queries);

    return {
      totalQueries: this.library.totalQueries,
      categories: this.listCategories(),
      mostUsed: queries
        .sort((a, b) => b.timesUsed - a.timesUsed)
        .slice(0, 10)
        .map((q) => ({
          id: q.id,
          purpose: q.purpose,
          category: q.category,
          timesUsed: q.timesUsed,
        })),
      recentlyAdded: queries
        .sort(
          (a, b) =>
            new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
        )
        .slice(0, 10)
        .map((q) => ({
          id: q.id,
          purpose: q.purpose,
          category: q.category,
          addedDate: q.addedDate,
        })),
      byCategory: this.library.categories.map((cat) => ({
        category: cat,
        count: queries.filter((q) => q.category === cat).length,
      })),
    };
  }

  /**
   * Check if similar query exists
   */
  findSimilarQueries(tsql: string, purpose: string): QueryTemplate[] {
    const results: QueryTemplate[] = [];
    const normalizedTsql = tsql.toLowerCase().replace(/\s+/g, " ").trim();
    const purposeWords = purpose
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3);

    for (const query of Object.values(this.library.queries)) {
      const queryNormalized = query.tsql
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

      // Check SQL similarity (using simple string matching)
      const sqlSimilarity = this.calculateSimilarity(
        normalizedTsql,
        queryNormalized
      );

      // Check purpose similarity
      const purposeSimilarity = purposeWords.filter((word) =>
        query.purpose.toLowerCase().includes(word)
      ).length;

      if (sqlSimilarity > 0.7 || purposeSimilarity >= 2) {
        results.push(query);
      }
    }

    return results;
  }

  /**
   * Simple string similarity calculation
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Levenshtein distance for string similarity
   */
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

  /**
   * Save library to file
   */
  private saveLibrary(): void {
    fs.writeFileSync(
      this.libraryPath,
      JSON.stringify(this.library, null, 2),
      "utf-8"
    );
  }

  /**
   * Get service status
   */
  getStatus(): any {
    return {
      status: "operational",
      libraryPath: this.libraryPath,
      totalQueries: this.library.totalQueries,
      categories: this.library.categories.length,
      lastUpdated: this.library.lastUpdated,
    };
  }
}
