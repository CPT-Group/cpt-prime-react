/**
 * JIRA API Service for MCP Integration
 *
 * Built according to jira-integration-expert specifications (confidence 1.0)
 * Supports: Jira Cloud Platform API v3, Jira Software Cloud API (Agile)
 * Authentication: API Token (Basic Auth format)
 *
 * @expert jira-integration-expert
 * @expert typescript-expert
 * @expert code-writing-rules-expert
 */

import * as fs from "fs";
import http from "http";
import https from "https";
import * as os from "os";
import * as path from "path";
import { URL } from "url";

/**
 * JIRA Configuration Interface
 */
export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  apiVersion?: string;
  timeout?: number;
  maxRetries?: number;
}

/**
 * JIRA Issue Fields Interface (Cloud API v3)
 */
export interface JiraIssueFields {
  project: { key: string } | { id: string };
  summary: string;
  issuetype: { name: string } | { id: string };
  description?: any; // ADF format in v3
  assignee?: { accountId: string };
  priority?: { name: string } | { id: string };
  labels?: string[];
  components?: Array<{ name: string } | { id: string }>;
  [key: string]: any; // Allow custom fields
}

/**
 * JIRA Search Options Interface
 */
export interface JiraSearchOptions {
  jql: string;
  startAt?: number;
  maxResults?: number;
  fields?: string[];
  expand?: string[];
}

/**
 * JIRA Issue Transition Interface
 */
export interface JiraTransition {
  id: string;
  name: string;
  to: {
    id: string;
    name: string;
  };
}

/**
 * JIRA Comment Interface (Cloud API v3 - ADF format)
 */
export interface JiraComment {
  body: any; // ADF format
  visibility?: {
    type: "group" | "role";
    value: string;
  };
}

/**
 * JIRA API Response Interface
 */
export interface JiraApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    statusCode: number;
    message: string;
    details?: any;
  };
}

/**
 * JIRA User Mapping Interface
 */
export interface JiraUserMapping {
  email: string;
  accountId?: string;
  displayName?: string;
  notes?: string;
}

/**
 * JIRA User Resolution Result
 */
export interface JiraUserResolution {
  accountId: string | null;
  email: string;
  displayName?: string;
  source: "mapping" | "env_var" | "api_lookup" | "manual" | "unknown";
  windowsUser?: string;
}

/**
 * JIRA Service Class
 * Provides comprehensive JIRA API integration following expert specifications
 */
export class JiraService {
  private config: Required<JiraConfig>;
  private authHeader: string;
  private userMappings: Map<string, JiraUserMapping>;
  private accountIdCache: Map<string, string>; // email -> accountId cache

  constructor(config: JiraConfig) {
    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ""), // Remove trailing slash
      email: config.email,
      apiToken: config.apiToken,
      apiVersion: config.apiVersion || "3",
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
    };

    // Create Basic Auth header: Authorization: Basic base64(email:apiToken)
    // Per jira-integration-expert: Jira Cloud uses email + token in Basic Auth format
    const credentials = Buffer.from(
      `${this.config.email}:${this.config.apiToken}`
    ).toString("base64");
    this.authHeader = `Basic ${credentials}`;

    // Initialize user mappings and cache
    this.userMappings = new Map();
    this.accountIdCache = new Map();
    this.loadUserMappings();
  }

  /**
   * Load user mappings from jira-user-mapping.json
   */
  private loadUserMappings(): void {
    try {
      const mappingPath = path.join(__dirname, "../../jira-user-mapping.json");
      if (fs.existsSync(mappingPath)) {
        const mappingFile = JSON.parse(fs.readFileSync(mappingPath, "utf-8"));
        if (mappingFile.mappings) {
          Object.entries(mappingFile.mappings).forEach(
            ([windowsUser, mapping]: [string, any]) => {
              this.userMappings.set(windowsUser.toLowerCase(), mapping);
            }
          );
        }
      }
    } catch (error) {
      console.warn("⚠️ Could not load user mappings:", error);
    }
  }

  /**
   * Initialize JIRA service from config file
   * Loads credentials from environment variables or config file
   */
  static async fromConfigFile(configPath?: string): Promise<JiraService> {
    const configFilePath =
      configPath || path.join(__dirname, "../../jira.config.json");

    if (!fs.existsSync(configFilePath)) {
      throw new Error(`JIRA config file not found: ${configFilePath}`);
    }

    const configFile = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    const jiraSettings = configFile.jiraSettings;

    // Load credentials from environment variables (preferred) or config
    const email = process.env.JIRA_EMAIL || jiraSettings.authentication.email;
    const apiToken =
      process.env.JIRA_API_TOKEN || jiraSettings.authentication.apiToken;

    if (
      !email ||
      !apiToken ||
      email.startsWith("${") ||
      apiToken.startsWith("${")
    ) {
      throw new Error(
        "JIRA credentials not configured. Set JIRA_EMAIL and JIRA_API_TOKEN environment variables."
      );
    }

    return new JiraService({
      baseUrl: jiraSettings.baseUrl,
      email,
      apiToken,
      apiVersion: jiraSettings.apiVersion,
    });
  }

  /**
   * Make HTTP request to JIRA API with retry logic and error handling
   */
  private async makeRequest<T>(
    method: string,
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<JiraApiResponse<T>> {
    const url = new URL(endpoint, this.config.baseUrl);

    const defaultHeaders: Record<string, string> = {
      Authorization: this.authHeader,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const requestOptions: https.RequestOptions = {
      method,
      headers: { ...defaultHeaders, ...headers },
      timeout: this.config.timeout,
    };

    let lastError: any;

    // Retry logic with exponential backoff (per jira-integration-expert best practices)
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        const result = await this.executeRequest<T>(url, requestOptions, body);

        // Success - return result
        if (result.success) {
          return result;
        }

        // Check if error is retryable
        if (result.error && this.isRetryableError(result.error.statusCode)) {
          lastError = result.error;
          const delay = this.calculateBackoffDelay(
            attempt,
            result.error.statusCode
          );
          await this.sleep(delay);
          continue;
        }

        // Non-retryable error - return immediately
        return result;
      } catch (error: any) {
        lastError = error;
        // Network errors are retryable
        const delay = this.calculateBackoffDelay(attempt, 0);
        await this.sleep(delay);
      }
    }

    // All retries exhausted
    return {
      success: false,
      error: {
        statusCode: lastError.statusCode || 0,
        message: lastError.message || "Request failed after all retries",
        details: lastError,
      },
    };
  }

  /**
   * Execute single HTTP request
   */
  private executeRequest<T>(
    url: URL,
    options: https.RequestOptions,
    body?: any
  ): Promise<JiraApiResponse<T>> {
    return new Promise((resolve) => {
      const protocol = url.protocol === "https:" ? https : http;

      const req = protocol.request(url, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const statusCode = res.statusCode || 0;

          // Success responses (200-299)
          if (statusCode >= 200 && statusCode < 300) {
            try {
              const parsedData = data ? JSON.parse(data) : null;
              resolve({
                success: true,
                data: parsedData as T,
              });
            } catch (error) {
              resolve({
                success: false,
                error: {
                  statusCode,
                  message: "Failed to parse response JSON",
                  details: data,
                },
              });
            }
            return;
          }

          // Error responses
          let errorMessage = `HTTP ${statusCode}`;
          let errorDetails: any = null;

          try {
            errorDetails = JSON.parse(data);
            // JIRA error format: { errorMessages: [...], errors: {...} }
            if (
              errorDetails.errorMessages &&
              errorDetails.errorMessages.length > 0
            ) {
              errorMessage = errorDetails.errorMessages.join(", ");
            } else if (errorDetails.message) {
              errorMessage = errorDetails.message;
            }
          } catch {
            errorMessage = data || errorMessage;
          }

          resolve({
            success: false,
            error: {
              statusCode,
              message: errorMessage,
              details: errorDetails,
            },
          });
        });
      });

      req.on("error", (error) => {
        resolve({
          success: false,
          error: {
            statusCode: 0,
            message: error.message,
            details: error,
          },
        });
      });

      req.on("timeout", () => {
        req.destroy();
        resolve({
          success: false,
          error: {
            statusCode: 0,
            message: "Request timeout",
            details: null,
          },
        });
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  /**
   * Check if HTTP status code is retryable (per jira-integration-expert)
   */
  private isRetryableError(statusCode: number): boolean {
    // Per jira-integration-expert: 429 (rate limit), 500, 503 are retryable
    return [429, 500, 503].includes(statusCode);
  }

  /**
   * Calculate exponential backoff delay (per jira-integration-expert best practices)
   */
  private calculateBackoffDelay(attempt: number, statusCode: number): number {
    // Rate limit (429): longer initial delay
    if (statusCode === 429) {
      return Math.min(5000 * Math.pow(2, attempt), 60000); // 5s, 10s, 20s, max 60s
    }
    // Other errors: standard backoff
    return Math.min(1000 * Math.pow(2, attempt), 10000); // 1s, 2s, 4s, max 10s
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Convert plain text to ADF (Atlassian Document Format) for v3 API
   * Per jira-integration-expert: v3 uses ADF for description/comments
   */
  private textToAdf(text: string): any {
    return {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: text,
            },
          ],
        },
      ],
    };
  }

  // ============================================================================
  // USER RESOLUTION METHODS
  // ============================================================================

  /**
   * Get current Windows username
   */
  getCurrentWindowsUser(): string {
    const userInfo = os.userInfo();
    return userInfo.username;
  }

  /**
   * Resolve JIRA user from Windows username or manual input
   *
   * @param manualEmail Optional manual email override
   * @param manualAccountId Optional manual accountId override
   * @returns Resolved JIRA user information
   */
  async resolveJiraUser(
    manualEmail?: string,
    manualAccountId?: string
  ): Promise<JiraUserResolution> {
    // 1. Manual override has highest priority
    if (manualEmail || manualAccountId) {
      const accountId =
        manualAccountId || (await this.lookupAccountId(manualEmail!));
      return {
        accountId,
        email: manualEmail || "",
        source: "manual",
      };
    }

    // 2. Try to resolve from Windows username mapping
    const windowsUser = this.getCurrentWindowsUser().toLowerCase();
    const mapping = this.userMappings.get(windowsUser);

    if (mapping) {
      // If mapping has accountId, use it
      if (mapping.accountId) {
        return {
          accountId: mapping.accountId,
          email: mapping.email,
          displayName: mapping.displayName,
          source: "mapping",
          windowsUser,
        };
      }

      // Otherwise, lookup accountId from email
      const accountId = await this.lookupAccountId(mapping.email);
      if (accountId) {
        return {
          accountId,
          email: mapping.email,
          displayName: mapping.displayName,
          source: "mapping",
          windowsUser,
        };
      }
    }

    // 3. Fall back to configured email (from env var or config)
    const accountId = await this.lookupAccountId(this.config.email);
    return {
      accountId,
      email: this.config.email,
      source: "env_var",
      windowsUser,
    };
  }

  /**
   * Lookup JIRA accountId from email address
   * Uses cache to avoid repeated API calls
   *
   * @param email User email address
   * @returns accountId or null if not found
   */
  async lookupAccountId(email: string): Promise<string | null> {
    if (!email) return null;

    // Check cache first
    if (this.accountIdCache.has(email)) {
      return this.accountIdCache.get(email)!;
    }

    // Search for user by email
    try {
      const result = await this.searchUsers(email, 1);
      if (result.success && result.data && result.data.length > 0) {
        const user = result.data[0];
        const accountId = user.accountId;

        // Cache the result
        if (accountId) {
          this.accountIdCache.set(email, accountId);
        }

        return accountId;
      }
    } catch (error) {
      console.warn(`Could not lookup accountId for ${email}:`, error);
    }

    return null;
  }

  /**
   * Get user mapping information for debugging
   */
  getUserMappingInfo(): {
    windowsUser: string;
    hasMappingConfigured: boolean;
    mapping?: JiraUserMapping;
    totalMappings: number;
  } {
    const windowsUser = this.getCurrentWindowsUser();
    const mapping = this.userMappings.get(windowsUser.toLowerCase());

    return {
      windowsUser,
      hasMappingConfigured: !!mapping,
      mapping,
      totalMappings: this.userMappings.size,
    };
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  /**
   * Search issues using JQL (Jira Query Language)
   * Endpoint: POST /rest/api/3/search
   *
   * @param options Search options with JQL query
   * @returns Search results with issues array
   */
  async searchIssues(options: JiraSearchOptions): Promise<JiraApiResponse> {
    const body = {
      jql: options.jql,
      startAt: options.startAt || 0,
      maxResults: options.maxResults || 50,
      fields: options.fields || [
        "key",
        "summary",
        "status",
        "assignee",
        "priority",
      ],
      expand: options.expand || [],
    };

    return this.makeRequest(
      "POST",
      `/rest/api/${this.config.apiVersion}/search`,
      body
    );
  }

  /**
   * Get issue by key or ID
   * Endpoint: GET /rest/api/3/issue/{issueKey}
   *
   * @param issueKey Issue key (e.g., "PROJ-123") or ID
   * @param fields Optional fields to return
   * @param expand Optional fields to expand
   * @returns Issue details
   */
  async getIssue(
    issueKey: string,
    fields?: string[],
    expand?: string[]
  ): Promise<JiraApiResponse> {
    let endpoint = `/rest/api/${this.config.apiVersion}/issue/${issueKey}`;
    const params = new URLSearchParams();

    if (fields && fields.length > 0) {
      params.append("fields", fields.join(","));
    }
    if (expand && expand.length > 0) {
      params.append("expand", expand.join(","));
    }

    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    return this.makeRequest("GET", endpoint);
  }

  /**
   * Create new issue
   * Endpoint: POST /rest/api/3/issue
   *
   * @param fields Issue fields (project, summary, issuetype are required)
   * @returns Created issue with key and ID
   */
  async createIssue(fields: JiraIssueFields): Promise<JiraApiResponse> {
    // Convert description to ADF if it's plain text
    if (fields.description && typeof fields.description === "string") {
      fields.description = this.textToAdf(fields.description);
    }

    const body = { fields };
    return this.makeRequest(
      "POST",
      `/rest/api/${this.config.apiVersion}/issue`,
      body
    );
  }

  /**
   * Update issue
   * Endpoint: PUT /rest/api/3/issue/{issueKey}
   *
   * @param issueKey Issue key or ID
   * @param fields Fields to update
   * @returns Success/failure
   */
  async updateIssue(
    issueKey: string,
    fields: Partial<JiraIssueFields>
  ): Promise<JiraApiResponse> {
    // Convert description to ADF if it's plain text
    if (fields.description && typeof fields.description === "string") {
      fields.description = this.textToAdf(fields.description);
    }

    const body = { fields };
    return this.makeRequest(
      "PUT",
      `/rest/api/${this.config.apiVersion}/issue/${issueKey}`,
      body
    );
  }

  /**
   * Delete issue
   * Endpoint: DELETE /rest/api/3/issue/{issueKey}
   *
   * @param issueKey Issue key or ID
   * @param deleteSubtasks Whether to delete subtasks
   * @returns Success/failure
   */
  async deleteIssue(
    issueKey: string,
    deleteSubtasks: boolean = false
  ): Promise<JiraApiResponse> {
    const endpoint = `/rest/api/${this.config.apiVersion}/issue/${issueKey}?deleteSubtasks=${deleteSubtasks}`;
    return this.makeRequest("DELETE", endpoint);
  }

  /**
   * Get available transitions for issue
   * Endpoint: GET /rest/api/3/issue/{issueKey}/transitions
   *
   * @param issueKey Issue key or ID
   * @returns Available transitions array
   */
  async getTransitions(
    issueKey: string
  ): Promise<JiraApiResponse<{ transitions: JiraTransition[] }>> {
    const endpoint = `/rest/api/${this.config.apiVersion}/issue/${issueKey}/transitions`;
    return this.makeRequest("GET", endpoint);
  }

  /**
   * Transition issue to new status
   * Endpoint: POST /rest/api/3/issue/{issueKey}/transitions
   *
   * @param issueKey Issue key or ID
   * @param transitionId Transition ID (get from getTransitions)
   * @param fields Optional fields to update during transition
   * @returns Success/failure (204 No Content on success)
   */
  async transitionIssue(
    issueKey: string,
    transitionId: string,
    fields?: Partial<JiraIssueFields>
  ): Promise<JiraApiResponse> {
    const body: any = {
      transition: { id: transitionId },
    };

    if (fields) {
      body.fields = fields;
    }

    return this.makeRequest(
      "POST",
      `/rest/api/${this.config.apiVersion}/issue/${issueKey}/transitions`,
      body
    );
  }

  /**
   * Add comment to issue
   * Endpoint: POST /rest/api/3/issue/{issueKey}/comment
   *
   * @param issueKey Issue key or ID
   * @param comment Comment text or ADF object
   * @param visibility Optional visibility restriction
   * @returns Created comment
   */
  async addComment(
    issueKey: string,
    comment: string | any,
    visibility?: { type: "group" | "role"; value: string }
  ): Promise<JiraApiResponse> {
    const body: any = {
      body: typeof comment === "string" ? this.textToAdf(comment) : comment,
    };

    if (visibility) {
      body.visibility = visibility;
    }

    return this.makeRequest(
      "POST",
      `/rest/api/${this.config.apiVersion}/issue/${issueKey}/comment`,
      body
    );
  }

  /**
   * Get comments for issue
   * Endpoint: GET /rest/api/3/issue/{issueKey}/comment
   *
   * @param issueKey Issue key or ID
   * @param startAt Pagination start index
   * @param maxResults Max results per page
   * @returns Comments array
   */
  async getComments(
    issueKey: string,
    startAt: number = 0,
    maxResults: number = 50
  ): Promise<JiraApiResponse> {
    const endpoint = `/rest/api/${this.config.apiVersion}/issue/${issueKey}/comment?startAt=${startAt}&maxResults=${maxResults}`;
    return this.makeRequest("GET", endpoint);
  }

  /**
   * Assign issue to user
   * Endpoint: PUT /rest/api/3/issue/{issueKey}/assignee
   *
   * @param issueKey Issue key or ID
   * @param accountId User account ID (GDPR-compliant identifier)
   * @returns Success/failure
   */
  async assignIssue(
    issueKey: string,
    accountId: string | null
  ): Promise<JiraApiResponse> {
    const body = { accountId };
    return this.makeRequest(
      "PUT",
      `/rest/api/${this.config.apiVersion}/issue/${issueKey}/assignee`,
      body
    );
  }

  /**
   * Get all projects
   * Endpoint: GET /rest/api/3/project
   *
   * @returns Projects array
   */
  async getProjects(): Promise<JiraApiResponse> {
    return this.makeRequest(
      "GET",
      `/rest/api/${this.config.apiVersion}/project`
    );
  }

  /**
   * Get project by key or ID
   * Endpoint: GET /rest/api/3/project/{projectKey}
   *
   * @param projectKey Project key or ID
   * @returns Project details
   */
  async getProject(projectKey: string): Promise<JiraApiResponse> {
    return this.makeRequest(
      "GET",
      `/rest/api/${this.config.apiVersion}/project/${projectKey}`
    );
  }

  /**
   * Get current user
   * Endpoint: GET /rest/api/3/myself
   *
   * @returns Current user details
   */
  async getCurrentUser(): Promise<JiraApiResponse> {
    return this.makeRequest(
      "GET",
      `/rest/api/${this.config.apiVersion}/myself`
    );
  }

  /**
   * Search users
   * Endpoint: GET /rest/api/3/user/search
   *
   * @param query Search query
   * @param maxResults Max results
   * @returns Users array
   */
  async searchUsers(
    query: string,
    maxResults: number = 50
  ): Promise<JiraApiResponse> {
    const endpoint = `/rest/api/${
      this.config.apiVersion
    }/user/search?query=${encodeURIComponent(query)}&maxResults=${maxResults}`;
    return this.makeRequest("GET", endpoint);
  }

  /**
   * Health check - verify JIRA connectivity and authentication
   *
   * @returns Success if authenticated, failure otherwise
   */
  async healthCheck(): Promise<JiraApiResponse> {
    try {
      const result = await this.getCurrentUser();
      if (result.success) {
        return {
          success: true,
          data: {
            status: "healthy",
            message: "JIRA API connection successful",
            user: result.data,
          },
        };
      }
      return result;
    } catch (error: any) {
      return {
        success: false,
        error: {
          statusCode: 0,
          message: "JIRA API health check failed",
          details: error.message,
        },
      };
    }
  }
}

export default JiraService;
