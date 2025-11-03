import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { CursorMonitoringService } from "./services/cursor-monitoring.service.js";
import { DatabaseService } from "./services/database.service.js";
import { FlutterManagementService } from "./services/flutter-management.service.js";
import { FlutterUIMockupService } from "./services/flutter-ui-mockup.service.js";
import { JiraService } from "./services/jira.service.js";
import { LiveMemoryService } from "./services/live-memory.service.js";
import { MermaidValidatorService } from "./services/mermaid-validator.service.js";
import { NeuralNetworkService } from "./services/neural-network.service.js";
import { PDFGenerationService } from "./services/pdf-generation.service.js";
import { PgSqlLibraryService } from "./services/pgsql-library.service.js";
import { PostgreSQLService } from "./services/postgresql.service.js";
import { QueryRouterService } from "./services/query-router.service.js";
import { SecurityCheckpointService } from "./services/security-checkpoint.service.js";
import { SqlServerService } from "./services/sql-server.service.js";
import { SystemManagementService } from "./services/system-management.service.js";
import { TsqlLibraryService } from "./services/tsql-library.service.js";
import { VoiceFeedbackService } from "./services/voice-feedback.service.js";
import { YouTubeAPIService } from "./services/youtube-api.service.js";
import { YouTubeTranscriptService } from "./services/youtube-transcript.service.js";

/**
 * Cursor Capabilities Service
 *
 * Provides extended capabilities for Cursor AI via Model Context Protocol (MCP):
 * - Neural networks for persona adjustment and code quality prediction
 * - PDF generation on-demand
 * - Live memory management (Redis-like)
 * - Database queries during conversation (PostgreSQL stub)
 * - SQL Server integration for multiple instances (CPT2K16, CPTWEB2018)
 * - T-SQL Query Library for reusable query patterns
 * - PostgreSQL integration for multiple instances (localhost, Azure PostgreSQL)
 * - PgSQL Query Library for reusable PostgreSQL query patterns
 * - JIRA API integration for issue management
 */
class CursorCapabilitiesService {
  private server: Server;
  private neuralService: NeuralNetworkService;
  private pdfService: PDFGenerationService;
  private memoryService: LiveMemoryService;
  private dbService: DatabaseService;
  private monitoringService: CursorMonitoringService;
  private mermaidService: MermaidValidatorService;
  private jiraService: JiraService | null;
  private sqlServerService: SqlServerService | null;
  private tsqlLibraryService: TsqlLibraryService | null;
  private postgreSQLService: PostgreSQLService | null;
  private pgsqlLibraryService: PgSqlLibraryService | null;
  private flutterUIService: FlutterUIMockupService;
  private flutterService: FlutterManagementService;
  private securityService: SecurityCheckpointService;
  private systemService: SystemManagementService;
  private youtubeService: YouTubeTranscriptService;
  private youtubeAPIService: YouTubeAPIService;
  private queryRouterService: QueryRouterService;
  private voiceFeedbackService: VoiceFeedbackService;

  constructor() {
    this.server = new Server(
      {
        name: "cursor-capabilities-service",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize services
    this.neuralService = new NeuralNetworkService();
    this.pdfService = new PDFGenerationService();
    this.memoryService = new LiveMemoryService();
    this.dbService = new DatabaseService();
    this.monitoringService = new CursorMonitoringService();
    this.mermaidService = new MermaidValidatorService();
    this.flutterUIService = new FlutterUIMockupService();
    this.flutterService = new FlutterManagementService();
    this.securityService = new SecurityCheckpointService();
    this.systemService = new SystemManagementService();
    this.youtubeService = new YouTubeTranscriptService();
    this.youtubeAPIService = new YouTubeAPIService();
    this.queryRouterService = new QueryRouterService();
    this.voiceFeedbackService = new VoiceFeedbackService();

    // Initialize JIRA service (optional - will be null if credentials not configured)
    this.jiraService = null;
    this.initializeJiraService();

    // Initialize SQL Server service (optional - will be null if config not found)
    this.sqlServerService = null;
    this.initializeSqlServerService();

    // Initialize T-SQL Query Library service (optional - will be null if library not found)
    this.tsqlLibraryService = null;
    this.initializeTsqlLibraryService();

    // Initialize PostgreSQL service (optional - will be null if config not found)
    this.postgreSQLService = null;
    this.initializePostgreSQLService();

    // Initialize PgSQL Query Library service (optional - will be null if library not found)
    this.pgsqlLibraryService = null;
    this.initializePgSqlLibraryService();

    // Register tool handlers
    this.registerToolHandlers();

    console.log("✅ Cursor Capabilities Service initialized");
  }

  private async initializeJiraService() {
    try {
      this.jiraService = await JiraService.fromConfigFile();
      console.log("✅ JIRA Service initialized");
    } catch (error: any) {
      console.warn("⚠️ JIRA Service not initialized:", error.message);
      console.warn(
        "   Set JIRA_EMAIL and JIRA_API_TOKEN environment variables to enable JIRA integration"
      );
    }
  }

  private initializeSqlServerService() {
    try {
      this.sqlServerService = new SqlServerService();
      console.log("✅ SQL Server Service initialized");
    } catch (error: any) {
      console.warn("⚠️ SQL Server Service not initialized:", error.message);
      console.warn(
        "   SQL Server config not found. Service will not be available."
      );
    }
  }

  private initializeTsqlLibraryService() {
    try {
      this.tsqlLibraryService = new TsqlLibraryService();
      console.log("✅ T-SQL Query Library Service initialized");
    } catch (error: any) {
      console.warn(
        "⚠️ T-SQL Query Library Service not initialized:",
        error.message
      );
      console.warn(
        "   Query library not found. Service will not be available."
      );
    }
  }

  private initializePostgreSQLService() {
    try {
      this.postgreSQLService = new PostgreSQLService();
      console.log("✅ PostgreSQL Service initialized");
    } catch (error: any) {
      console.warn("⚠️ PostgreSQL Service not initialized:", error.message);
      console.warn(
        "   PostgreSQL config not found. Service will not be available."
      );
    }
  }

  private initializePgSqlLibraryService() {
    try {
      this.pgsqlLibraryService = new PgSqlLibraryService();
      console.log("✅ PgSQL Query Library Service initialized");
    } catch (error: any) {
      console.warn(
        "⚠️ PgSQL Query Library Service not initialized:",
        error.message
      );
      console.warn(
        "   PgSQL query library not found. Service will not be available."
      );
    }
  }

  private registerToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Health check
          {
            name: "health_check",
            description: "Check service health and status of all components",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          // Neural network tools
          {
            name: "get_neural_recommendation",
            description:
              "Get neural network recommendations for expert behavior",
            inputSchema: {
              type: "object",
              properties: {
                expertId: {
                  type: "string",
                  description: "ID of the expert (e.g., 'designer-expert')",
                },
                context: {
                  type: "object",
                  description: "Conversation context for the recommendation",
                },
              },
              required: ["expertId", "context"],
            },
          },
          {
            name: "log_expert_outcome",
            description: "Log interaction outcome for training data collection",
            inputSchema: {
              type: "object",
              properties: {
                expertId: {
                  type: "string",
                  description: "ID of the expert",
                },
                interaction: {
                  type: "object",
                  description: "Details of the interaction",
                },
                outcome: {
                  type: "object",
                  description: "Outcome and effectiveness metrics",
                },
              },
              required: ["expertId", "interaction", "outcome"],
            },
          },
          {
            name: "validate_fact_suggestion",
            description: "Validate fact suggestion using neural model. Auto-approves high-confidence facts (>=90%) to reduce human review.",
            inputSchema: {
              type: "object",
              properties: {
                factStatement: {
                  type: "string",
                  description: "The fact statement to validate",
                },
                context: {
                  type: "object",
                  description: "Context including challengeId, pattern, metrics, expertId",
                  properties: {
                    challengeId: { type: "string" },
                    pattern: { type: "string" },
                    metrics: { type: "object" },
                    expertId: { type: "string" },
                  },
                },
                evidence: {
                  type: "array",
                  items: { type: "string" },
                  description: "Array of evidence strings supporting the fact",
                },
              },
              required: ["factStatement", "context", "evidence"],
            },
          },
          {
            name: "check_pattern_generalization",
            description: "Check if a code pattern is generalizable vs challenge-specific. Filters out overfitted patterns.",
            inputSchema: {
              type: "object",
              properties: {
                patternCode: {
                  type: "string",
                  description: "The pattern code to check",
                },
                challengeContext: {
                  type: "object",
                  description: "Challenge context including challengeId, description, constraints, testCases",
                  properties: {
                    challengeId: { type: "string" },
                    description: { type: "string" },
                    constraints: { type: "object" },
                    testCases: { type: "array" },
                  },
                },
                crossChallengeFeatures: {
                  type: "object",
                  description: "Cross-challenge features including challengeCount, avgPerformance, performanceConsistency",
                  properties: {
                    challengeCount: { type: "number" },
                    avgPerformance: { type: "number" },
                    performanceConsistency: { type: "number" },
                  },
                },
              },
              required: ["patternCode", "challengeContext", "crossChallengeFeatures"],
            },
          },
          // Query routing tool
          {
            name: "route_query_to_experts",
            description:
              "Analyze query and return which experts and rules to load for intelligent orchestration",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "User's query text",
                },
                context: {
                  type: "object",
                  description:
                    "Current conversation context (open files, history, etc.)",
                },
              },
              required: ["query"],
            },
          },
          // PDF generation tools
          {
            name: "generate_pdf",
            description: "Generate a PDF document from structured data",
            inputSchema: {
              type: "object",
              properties: {
                template: {
                  type: "string",
                  description:
                    "Template name (e.g., 'technical-documentation')",
                },
                data: {
                  type: "object",
                  description: "Data to populate the PDF",
                },
                outputPath: {
                  type: "string",
                  description: "Path where PDF should be saved",
                },
              },
              required: ["template", "data", "outputPath"],
            },
          },
          // Memory tools
          {
            name: "store_live_memory",
            description: "Store data in live memory with optional TTL",
            inputSchema: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                  description: "Memory key",
                },
                value: {
                  type: "object",
                  description: "Data to store",
                },
                ttl: {
                  type: "number",
                  description: "Time-to-live in seconds (optional)",
                },
              },
              required: ["key", "value"],
            },
          },
          {
            name: "get_live_memory",
            description: "Retrieve data from live memory",
            inputSchema: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                  description: "Memory key to retrieve",
                },
              },
              required: ["key"],
            },
          },
          // Database tools
          {
            name: "query_database",
            description: "Execute a database query",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "SQL query to execute",
                },
                params: {
                  type: "array",
                  description: "Query parameters",
                },
              },
              required: ["query"],
            },
          },
          // Mermaid validator tools
          {
            name: "validate_mermaid_diagram",
            description:
              "Validate Mermaid diagram syntax before inserting into documents. Checks for common errors, Unicode issues, bracket matching, and provides sanitized version.",
            inputSchema: {
              type: "object",
              properties: {
                diagram: {
                  type: "string",
                  description: "The Mermaid diagram code to validate",
                },
                type: {
                  type: "string",
                  description:
                    "Optional diagram type hint (graph, flowchart, sequence, etc.)",
                },
              },
              required: ["diagram"],
            },
          },
          {
            name: "generate_mermaid_test_html",
            description:
              "Generate an HTML file to visually test a Mermaid diagram rendering",
            inputSchema: {
              type: "object",
              properties: {
                diagram: {
                  type: "string",
                  description: "The Mermaid diagram code to test",
                },
                outputPath: {
                  type: "string",
                  description: "Path where test HTML should be saved",
                },
              },
              required: ["diagram", "outputPath"],
            },
          },
          {
            name: "get_mermaid_examples",
            description: "Get example Mermaid diagrams for common use cases",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          // YouTube Transcript Extraction tools
          {
            name: "extract_youtube_transcript",
            description:
              "Extract transcript from YouTube video using scraping method. Works with auto-generated captions. Saves transcript in markdown format with metadata.",
            inputSchema: {
              type: "object",
              properties: {
                videoUrl: {
                  type: "string",
                  description:
                    "YouTube video URL (e.g., https://youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)",
                },
                outputPath: {
                  type: "string",
                  description:
                    "Path where transcript should be saved (markdown format recommended)",
                },
                includeTimestamps: {
                  type: "boolean",
                  description:
                    "Include timestamps for each segment (default: false)",
                },
                includeMetadata: {
                  type: "boolean",
                  description:
                    "Include video metadata (duration, word count, etc.) (default: true)",
                },
                title: {
                  type: "string",
                  description:
                    "Custom title for the transcript document (default: 'YouTube Video Transcript')",
                },
              },
              required: ["videoUrl", "outputPath"],
            },
          },
          {
            name: "youtube_list_captions",
            description:
              "List available captions for a YouTube video using official YouTube Data API v3. Returns metadata about caption tracks (manual vs auto-generated). Costs 50 quota units. Requires YOUTUBE_API_KEY.",
            inputSchema: {
              type: "object",
              properties: {
                videoId: {
                  type: "string",
                  description:
                    "YouTube video ID (11 characters, e.g., 'gCPMpZn7jBY')",
                },
              },
              required: ["videoId"],
            },
          },
          {
            name: "youtube_download_caption",
            description:
              "Download caption file using official YouTube Data API v3. REQUIRES OAuth 2.0 (not just API key). CANNOT download auto-generated captions. Costs 200 quota units. Only works for manually uploaded captions.",
            inputSchema: {
              type: "object",
              properties: {
                captionId: {
                  type: "string",
                  description: "Caption track ID from youtube_list_captions",
                },
                format: {
                  type: "string",
                  description:
                    "Output format: srt, vtt, ttml, or sbv (default: srt)",
                  enum: ["srt", "vtt", "ttml", "sbv"],
                },
                outputPath: {
                  type: "string",
                  description: "Optional: Path to save caption file",
                },
              },
              required: ["captionId"],
            },
          },
          {
            name: "youtube_get_quota_info",
            description:
              "Get information about YouTube API quota limits and recommendations",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "check_youtube_service_status",
            description:
              "Check if YouTube transcript extraction services are available and properly configured (both API and scraping)",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          // Flutter UI Mockup tools
          {
            name: "generate_flutter_mockup",
            description:
              "Generate Flutter UI mockup code from description. Creates complete widget code (Material/Cupertino) for screens, forms, lists, etc.",
            inputSchema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Widget class name (e.g., 'LoginScreen', 'ProfilePage', must end with Screen/Page/Widget)",
                },
                description: {
                  type: "string",
                  description:
                    "Description of UI to generate (e.g., 'Login screen with email/password fields and submit button')",
                },
                designSystem: {
                  type: "string",
                  description:
                    "Design system: 'material' (Android), 'cupertino' (iOS), or 'adaptive'",
                  enum: ["material", "cupertino", "adaptive"],
                },
                layout: {
                  type: "string",
                  description:
                    "Layout type: 'column', 'row', 'stack', 'list', 'grid', or 'form'",
                  enum: ["column", "row", "stack", "list", "grid", "form"],
                },
                includeState: {
                  type: "boolean",
                  description:
                    "Generate StatefulWidget with state management (true) or StatelessWidget (false)",
                },
                includeComments: {
                  type: "boolean",
                  description: "Include explanatory comments in generated code",
                },
              },
              required: ["name", "description"],
            },
          },
          {
            name: "generate_flutter_pattern",
            description:
              "Generate common Flutter UI pattern. Predefined patterns: login, signup, profile, list, detail, settings.",
            inputSchema: {
              type: "object",
              properties: {
                pattern: {
                  type: "string",
                  description:
                    "Pattern name: 'login', 'signup', 'profile', 'list', 'detail', or 'settings'",
                  enum: [
                    "login",
                    "signup",
                    "profile",
                    "list",
                    "detail",
                    "settings",
                  ],
                },
                name: {
                  type: "string",
                  description:
                    "Optional: Custom widget name (overrides default pattern name)",
                },
                designSystem: {
                  type: "string",
                  description:
                    "Optional: Design system override ('material', 'cupertino', 'adaptive')",
                },
              },
              required: ["pattern"],
            },
          },
          {
            name: "list_flutter_patterns",
            description:
              "List available Flutter UI patterns that can be generated",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "generate_flutter_app_structure",
            description:
              "Generate complete Flutter app structure with navigation, routes, and multiple screens",
            inputSchema: {
              type: "object",
              properties: {
                appName: {
                  type: "string",
                  description:
                    "App name (e.g., 'MyApp', will be converted to 'MyAppApp' class)",
                },
                screens: {
                  type: "array",
                  items: { type: "string" },
                  description:
                    "List of screen patterns to include (e.g., ['login', 'home', 'profile'])",
                },
              },
              required: ["appName", "screens"],
            },
          },
          // Monitoring tools
          {
            name: "get_cursor_performance_metrics",
            description:
              "Get current Cursor IDE performance metrics and recommendations",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "track_conversation_event",
            description:
              "Track conversation events for memory-aware recommendations",
            inputSchema: {
              type: "object",
              properties: {
                conversationId: {
                  type: "string",
                  description: "Unique conversation identifier",
                },
                action: {
                  type: "string",
                  enum: [
                    "exchange",
                    "file_read",
                    "code_generated",
                    "checkpoint",
                  ],
                  description: "Type of event to track",
                },
                data: {
                  type: "object",
                  description: "Additional event data (optional)",
                },
              },
              required: ["conversationId", "action"],
            },
          },
          {
            name: "get_conversation_recommendations",
            description:
              "Get memory-aware recommendations for current conversation",
            inputSchema: {
              type: "object",
              properties: {
                conversationId: {
                  type: "string",
                  description: "Conversation identifier",
                },
              },
              required: ["conversationId"],
            },
          },
          // JIRA API tools
          {
            name: "jira_search_issues",
            description:
              "Search JIRA issues using JQL (Jira Query Language). Examples: 'project = PROJ AND status != Done', 'assignee = currentUser()', 'created >= -7d'",
            inputSchema: {
              type: "object",
              properties: {
                jql: {
                  type: "string",
                  description:
                    "JQL query string (e.g., 'project = PROJ AND status = Open')",
                },
                maxResults: {
                  type: "number",
                  description:
                    "Maximum results to return (default 50, max 100)",
                },
                fields: {
                  type: "array",
                  items: { type: "string" },
                  description:
                    "Fields to return (default: key, summary, status, assignee, priority)",
                },
              },
              required: ["jql"],
            },
          },
          {
            name: "jira_get_issue",
            description:
              "Get detailed information about a specific JIRA issue by key (e.g., 'PROJ-123')",
            inputSchema: {
              type: "object",
              properties: {
                issueKey: {
                  type: "string",
                  description: "Issue key (e.g., 'PROJ-123')",
                },
                fields: {
                  type: "array",
                  items: { type: "string" },
                  description: "Optional: specific fields to return",
                },
              },
              required: ["issueKey"],
            },
          },
          {
            name: "jira_create_issue",
            description:
              "Create a new JIRA issue. Required: project key, summary, issue type. Description will be converted to ADF format automatically.",
            inputSchema: {
              type: "object",
              properties: {
                projectKey: {
                  type: "string",
                  description: "Project key (e.g., 'PROJ')",
                },
                summary: {
                  type: "string",
                  description: "Issue summary/title",
                },
                issueType: {
                  type: "string",
                  description: "Issue type (e.g., 'Task', 'Bug', 'Story')",
                },
                description: {
                  type: "string",
                  description:
                    "Issue description (plain text, will be converted to ADF)",
                },
                assigneeAccountId: {
                  type: "string",
                  description: "Optional: assignee account ID",
                },
                priority: {
                  type: "string",
                  description:
                    "Optional: priority (e.g., 'High', 'Medium', 'Low')",
                },
                labels: {
                  type: "array",
                  items: { type: "string" },
                  description: "Optional: labels array",
                },
              },
              required: ["projectKey", "summary", "issueType"],
            },
          },
          {
            name: "jira_update_issue",
            description:
              "Update an existing JIRA issue. Can update summary, description, assignee, priority, labels, etc.",
            inputSchema: {
              type: "object",
              properties: {
                issueKey: {
                  type: "string",
                  description: "Issue key (e.g., 'PROJ-123')",
                },
                fields: {
                  type: "object",
                  description:
                    "Fields to update (e.g., { summary: 'New summary', description: 'New description' })",
                },
              },
              required: ["issueKey", "fields"],
            },
          },
          {
            name: "jira_transition_issue",
            description:
              "Transition a JIRA issue to a new status (e.g., move from 'To Do' to 'In Progress'). Use jira_get_transitions first to get available transition IDs.",
            inputSchema: {
              type: "object",
              properties: {
                issueKey: {
                  type: "string",
                  description: "Issue key (e.g., 'PROJ-123')",
                },
                transitionId: {
                  type: "string",
                  description: "Transition ID (get from jira_get_transitions)",
                },
              },
              required: ["issueKey", "transitionId"],
            },
          },
          {
            name: "jira_get_transitions",
            description:
              "Get available transitions (status changes) for a JIRA issue",
            inputSchema: {
              type: "object",
              properties: {
                issueKey: {
                  type: "string",
                  description: "Issue key (e.g., 'PROJ-123')",
                },
              },
              required: ["issueKey"],
            },
          },
          {
            name: "jira_add_comment",
            description:
              "Add a comment to a JIRA issue. Comment will be converted to ADF format automatically.",
            inputSchema: {
              type: "object",
              properties: {
                issueKey: {
                  type: "string",
                  description: "Issue key (e.g., 'PROJ-123')",
                },
                comment: {
                  type: "string",
                  description:
                    "Comment text (plain text, will be converted to ADF)",
                },
              },
              required: ["issueKey", "comment"],
            },
          },
          {
            name: "jira_get_projects",
            description: "Get all JIRA projects accessible to the current user",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "jira_health_check",
            description:
              "Check JIRA API connectivity and authentication status",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "jira_resolve_current_user",
            description:
              "Resolve current Windows user to JIRA account. Shows mapping status and suggests manual override if needed.",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "jira_set_conversation_user",
            description:
              "Set the JIRA user to use for current conversation. Overrides automatic user resolution. Stores in conversation memory.",
            inputSchema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  description: "JIRA user email address",
                },
                accountId: {
                  type: "string",
                  description:
                    "Optional: JIRA accountId (will be looked up if not provided)",
                },
                conversationId: {
                  type: "string",
                  description: "Conversation identifier for memory storage",
                },
              },
              required: ["email", "conversationId"],
            },
          },
          {
            name: "jira_get_conversation_user",
            description:
              "Get the JIRA user configured for current conversation (from conversation memory)",
            inputSchema: {
              type: "object",
              properties: {
                conversationId: {
                  type: "string",
                  description: "Conversation identifier",
                },
              },
              required: ["conversationId"],
            },
          },
          // SQL Server tools
          {
            name: "sql_server_list_servers",
            description:
              "Get list of available SQL Server instances (CPT2K16, CPTWEB2018, etc.) configured in the service",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "sql_server_connect",
            description:
              "Connect to a SQL Server instance. Must be called before executing queries.",
            inputSchema: {
              type: "object",
              properties: {
                serverName: {
                  type: "string",
                  description: "Server name (e.g., 'CPT2K16', 'CPTWEB2018')",
                },
              },
              required: ["serverName"],
            },
          },
          {
            name: "sql_server_list_databases",
            description:
              "Get list of databases on a connected SQL Server instance",
            inputSchema: {
              type: "object",
              properties: {
                serverName: {
                  type: "string",
                  description: "Server name to list databases from",
                },
              },
              required: ["serverName"],
            },
          },
          {
            name: "sql_server_select_database",
            description:
              "Select a database to use for subsequent queries on a server",
            inputSchema: {
              type: "object",
              properties: {
                serverName: {
                  type: "string",
                  description: "Server name",
                },
                databaseName: {
                  type: "string",
                  description: "Database name to select",
                },
              },
              required: ["serverName", "databaseName"],
            },
          },
          {
            name: "sql_server_get_connection_string",
            description:
              "Get the connection string for a SQL Server and database. Useful for configuring other applications.",
            inputSchema: {
              type: "object",
              properties: {
                serverName: {
                  type: "string",
                  description: "Server name",
                },
                databaseName: {
                  type: "string",
                  description:
                    "Optional: Database name to include in connection string",
                },
              },
              required: ["serverName"],
            },
          },
          {
            name: "sql_server_execute_query",
            description:
              "Execute a T-SQL query on a connected SQL Server database. Server must be connected and database selected first.",
            inputSchema: {
              type: "object",
              properties: {
                serverName: {
                  type: "string",
                  description: "Server name",
                },
                query: {
                  type: "string",
                  description:
                    "T-SQL query to execute (SELECT, INSERT, UPDATE, DELETE, etc.)",
                },
                params: {
                  type: "object",
                  description:
                    "Optional: Query parameters for parameterized queries (e.g., { 'id': 123 })",
                },
              },
              required: ["serverName", "query"],
            },
          },
          {
            name: "sql_server_execute_procedure",
            description:
              "Execute a stored procedure on a connected SQL Server database",
            inputSchema: {
              type: "object",
              properties: {
                serverName: {
                  type: "string",
                  description: "Server name",
                },
                procedureName: {
                  type: "string",
                  description: "Stored procedure name",
                },
                params: {
                  type: "object",
                  description:
                    "Optional: Procedure parameters (e.g., { 'id': 123 })",
                },
              },
              required: ["serverName", "procedureName"],
            },
          },
          {
            name: "sql_server_get_status",
            description:
              "Get current SQL Server connection status and configured servers",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          // T-SQL Query Library tools
          {
            name: "tsql_library_search",
            description:
              "Search T-SQL query library for existing query patterns. ALWAYS search before writing new queries to prevent duplication.",
            inputSchema: {
              type: "object",
              properties: {
                searchTerm: {
                  type: "string",
                  description:
                    "Search term (keywords from purpose, description, or tags)",
                },
                category: {
                  type: "string",
                  description:
                    "Optional: Filter by category (SELECT, INSERT, UPDATE, DELETE, SCHEMA, ADMIN, ANALYTICS, MAINTENANCE)",
                },
              },
              required: ["searchTerm"],
            },
          },
          {
            name: "tsql_library_get",
            description:
              "Get a specific query template by ID and optionally replace parameters",
            inputSchema: {
              type: "object",
              properties: {
                queryId: {
                  type: "string",
                  description: "Query ID from search results",
                },
                parameters: {
                  type: "object",
                  description:
                    "Optional: Parameter values to replace in template (e.g., { 'tableName': 'dbo.Cases' })",
                },
              },
              required: ["queryId"],
            },
          },
          {
            name: "tsql_library_add",
            description:
              "Add a new successful query to the library. ONLY add queries that executed successfully and returned expected results.",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description:
                    "Unique ID (e.g., 'get-open-cases', 'count-records-by-status')",
                },
                category: {
                  type: "string",
                  description:
                    "Category (SELECT, INSERT, UPDATE, DELETE, SCHEMA, ADMIN, ANALYTICS, MAINTENANCE)",
                },
                purpose: {
                  type: "string",
                  description: "Short purpose statement (1-2 sentences)",
                },
                description: {
                  type: "string",
                  description: "Detailed description of what the query does",
                },
                tsql: {
                  type: "string",
                  description:
                    "T-SQL query template with @parameterNames for values",
                },
                parameters: {
                  type: "array",
                  description:
                    "Array of parameter definitions (name, type, description, required, example)",
                },
                exampleUsage: {
                  type: "string",
                  description: "Example of how to use this query",
                },
                successCriteria: {
                  type: "string",
                  description:
                    "What indicates this query executed successfully",
                },
                testedOn: {
                  type: "object",
                  description:
                    "Servers and databases where tested (e.g., { 'servers': ['CPTWEB2018'], 'databases': ['WebDB_Test'] })",
                },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  description: "Tags for easy discovery",
                },
              },
              required: [
                "id",
                "category",
                "purpose",
                "description",
                "tsql",
                "successCriteria",
                "testedOn",
                "tags",
              ],
            },
          },
          {
            name: "tsql_library_list_categories",
            description:
              "List all query categories with counts. Useful for browsing the library.",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "tsql_library_stats",
            description:
              "Get T-SQL library statistics (most used queries, recently added, etc.)",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "tsql_library_find_similar",
            description:
              "Find similar queries before adding a new one. Prevents duplication.",
            inputSchema: {
              type: "object",
              properties: {
                tsql: {
                  type: "string",
                  description: "T-SQL query to check for similarity",
                },
                purpose: {
                  type: "string",
                  description: "Purpose of the query",
                },
              },
              required: ["tsql", "purpose"],
            },
          },
          // PostgreSQL tools
          {
            name: "postgresql_list_servers",
            description:
              "Get list of available PostgreSQL instances (localhost, Azure PostgreSQL, etc.) configured in the service",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "postgresql_connect",
            description:
              "Connect to a PostgreSQL instance. Connection pooling is automatic.",
            inputSchema: {
              type: "object",
              properties: {
                serverName: {
                  type: "string",
                  description:
                    "Name of the server to connect to (e.g., 'localhost', 'azure-postgres')",
                },
              },
              required: ["serverName"],
            },
          },
          {
            name: "postgresql_list_databases",
            description:
              "Get list of databases on a connected PostgreSQL server",
            inputSchema: {
              type: "object",
              properties: {
                serverName: {
                  type: "string",
                  description:
                    "Name of the connected server (e.g., 'localhost')",
                },
              },
              required: ["serverName"],
            },
          },
          {
            name: "postgresql_select_database",
            description:
              "Select a specific database on a connected server for subsequent queries",
            inputSchema: {
              type: "object",
              properties: {
                serverName: {
                  type: "string",
                  description: "Name of the connected server",
                },
                databaseName: {
                  type: "string",
                  description: "Name of the database to select",
                },
              },
              required: ["serverName", "databaseName"],
            },
          },
          {
            name: "postgresql_get_connection_string",
            description:
              "Get the connection string for a server and database (without exposing credentials)",
            inputSchema: {
              type: "object",
              properties: {
                serverName: {
                  type: "string",
                  description: "Name of the server",
                },
                databaseName: {
                  type: "string",
                  description:
                    "Optional: Database name. If not provided, uses default from config.",
                },
              },
              required: ["serverName"],
            },
          },
          {
            name: "postgresql_execute_query",
            description:
              "Execute a SQL query against the selected database. Use parameterized queries with $1, $2, etc.",
            inputSchema: {
              type: "object",
              properties: {
                serverName: {
                  type: "string",
                  description: "Name of the connected server",
                },
                query: {
                  type: "string",
                  description:
                    "SQL query to execute (use $1, $2, etc. for parameters)",
                },
                params: {
                  type: "array",
                  description:
                    "Optional: Array of parameter values (e.g., ['value1', 123])",
                },
              },
              required: ["serverName", "query"],
            },
          },
          {
            name: "postgresql_execute_procedure",
            description: "Execute a PostgreSQL stored procedure/function",
            inputSchema: {
              type: "object",
              properties: {
                serverName: {
                  type: "string",
                  description: "Name of the connected server",
                },
                procedureName: {
                  type: "string",
                  description:
                    "Name of the procedure/function (e.g., 'get_user_stats')",
                },
                params: {
                  type: "array",
                  description: "Optional: Array of parameter values",
                },
              },
              required: ["serverName", "procedureName"],
            },
          },
          {
            name: "postgresql_get_status",
            description:
              "Get current connection status for all PostgreSQL servers",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          // PgSQL Query Library tools
          {
            name: "pgsql_library_search",
            description:
              "Search PostgreSQL Query Library for existing query patterns. ALWAYS search before writing new queries!",
            inputSchema: {
              type: "object",
              properties: {
                searchTerm: {
                  type: "string",
                  description:
                    "Search term to look for in query purpose, description, tags, or SQL",
                },
                category: {
                  type: "string",
                  description:
                    "Optional: Filter by category (SELECT, INSERT, UPDATE, DELETE, DDL, SCHEMA, ADMIN, ANALYTICS, MAINTENANCE, VIEWS, FUNCTIONS, TRIGGERS, INDEXES)",
                },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  description: "Optional: Filter by tags",
                },
              },
            },
          },
          {
            name: "pgsql_library_get",
            description:
              "Get a specific query from the library by ID, with optional parameter replacement",
            inputSchema: {
              type: "object",
              properties: {
                queryId: {
                  type: "string",
                  description: "ID of the query to retrieve",
                },
                paramValues: {
                  type: "object",
                  description:
                    "Optional: Parameter values to replace in template (e.g., { 'tableName': 'users' })",
                },
              },
              required: ["queryId"],
            },
          },
          {
            name: "pgsql_library_add",
            description:
              "Add a new successful query to the library. ONLY add queries that executed successfully and returned expected results.",
            inputSchema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description:
                    "Unique ID (e.g., 'get-active-users', 'count-records-by-status')",
                },
                category: {
                  type: "string",
                  description:
                    "Category (SELECT, INSERT, UPDATE, DELETE, DDL, SCHEMA, ADMIN, ANALYTICS, MAINTENANCE, VIEWS, FUNCTIONS, TRIGGERS, INDEXES)",
                },
                purpose: {
                  type: "string",
                  description: "Short purpose statement (1-2 sentences)",
                },
                description: {
                  type: "string",
                  description: "Detailed description of what the query does",
                },
                sql: {
                  type: "string",
                  description:
                    "SQL query template with $1, $2 parameters or ${paramName} placeholders",
                },
                parameters: {
                  type: "array",
                  description:
                    "Array of parameter definitions (name, type, description, required, example)",
                },
                exampleUsage: {
                  type: "string",
                  description: "Example of how to use this query",
                },
                successCriteria: {
                  type: "string",
                  description:
                    "What indicates this query executed successfully",
                },
                testedOn: {
                  type: "object",
                  description:
                    "Servers and databases where tested (e.g., { 'servers': ['localhost'], 'databases': ['devteamjiratools'] })",
                },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  description: "Tags for easy discovery",
                },
                postgresqlFeatures: {
                  type: "array",
                  items: { type: "string" },
                  description:
                    "Optional: PostgreSQL-specific features used (e.g., ['jsonb', 'cte', 'window-functions'])",
                },
              },
              required: [
                "id",
                "category",
                "purpose",
                "description",
                "sql",
                "successCriteria",
                "testedOn",
                "tags",
              ],
            },
          },
          {
            name: "pgsql_library_list_categories",
            description:
              "List all query categories with counts. Useful for browsing the library.",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "pgsql_library_stats",
            description:
              "Get PgSQL library statistics (most used queries, recently added, etc.)",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "pgsql_library_find_similar",
            description:
              "Find similar queries before adding a new one. Prevents duplication.",
            inputSchema: {
              type: "object",
              properties: {
                sql: {
                  type: "string",
                  description: "SQL query to check for similarity",
                },
                purpose: {
                  type: "string",
                  description: "Purpose of the query",
                },
              },
              required: ["sql", "purpose"],
            },
          },
          {
            name: "check_node_version",
            description:
              "Check installed Node.js version and optionally compare against required version",
            inputSchema: {
              type: "object",
              properties: {
                required_version: {
                  type: "string",
                  description: "Required version to compare (e.g., '18.0.0')",
                },
              },
            },
          },
          {
            name: "check_python_version",
            description:
              "Check installed Python version and optionally compare against required version",
            inputSchema: {
              type: "object",
              properties: {
                required_version: {
                  type: "string",
                  description: "Required version to compare (e.g., '3.9.0')",
                },
              },
            },
          },
          {
            name: "check_npm_version",
            description:
              "Check installed npm version and optionally compare against required version",
            inputSchema: {
              type: "object",
              properties: {
                required_version: {
                  type: "string",
                  description: "Required version to compare (e.g., '8.0.0')",
                },
              },
            },
          },
          {
            name: "check_pip_version",
            description:
              "Check installed pip version and optionally compare against required version",
            inputSchema: {
              type: "object",
              properties: {
                required_version: {
                  type: "string",
                  description: "Required version to compare (e.g., '21.0.0')",
                },
              },
            },
          },
          {
            name: "check_npm_package",
            description:
              "Check if a specific npm package is installed and get its version",
            inputSchema: {
              type: "object",
              properties: {
                package_name: {
                  type: "string",
                  description: "Package name to check",
                },
                directory: {
                  type: "string",
                  description:
                    "Project directory (optional, defaults to current)",
                },
              },
              required: ["package_name"],
            },
          },
          {
            name: "check_python_package",
            description:
              "Check if a specific Python package is installed and get its version",
            inputSchema: {
              type: "object",
              properties: {
                package_name: {
                  type: "string",
                  description: "Package name to check",
                },
              },
              required: ["package_name"],
            },
          },
          {
            name: "install_npm_package",
            description:
              "Install npm package (REQUIRES SECURITY APPROVAL). Will generate a security sequence that must be validated before installation proceeds.",
            inputSchema: {
              type: "object",
              properties: {
                package_name: {
                  type: "string",
                  description: "Package name to install",
                },
                version: {
                  type: "string",
                  description: "Specific version (optional)",
                },
                save_dev: {
                  type: "boolean",
                  description: "Install as dev dependency",
                },
                directory: {
                  type: "string",
                  description: "Project directory (optional)",
                },
              },
              required: ["package_name"],
            },
          },
          {
            name: "install_python_package",
            description:
              "Install Python package with pip (REQUIRES SECURITY APPROVAL). Will generate a security sequence that must be validated before installation proceeds.",
            inputSchema: {
              type: "object",
              properties: {
                package_name: {
                  type: "string",
                  description: "Package name to install",
                },
                version: {
                  type: "string",
                  description: "Specific version (optional)",
                },
                user_install: {
                  type: "boolean",
                  description: "Install with --user flag",
                },
              },
              required: ["package_name"],
            },
          },
          {
            name: "update_npm_dependencies",
            description:
              "Update all npm dependencies in a project (REQUIRES SECURITY APPROVAL). Will generate a security sequence that must be validated before update proceeds.",
            inputSchema: {
              type: "object",
              properties: {
                directory: {
                  type: "string",
                  description:
                    "Project directory (optional, defaults to current)",
                },
              },
            },
          },
          {
            name: "update_python_dependencies",
            description:
              "Update all Python packages to latest versions (REQUIRES SECURITY APPROVAL). Will generate a security sequence that must be validated before update proceeds.",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "run_system_command",
            description:
              "Run arbitrary system command (REQUIRES SECURITY APPROVAL). WARNING: This is extremely dangerous. Will generate a security sequence that must be validated.",
            inputSchema: {
              type: "object",
              properties: {
                command: {
                  type: "string",
                  description: "Command to execute",
                },
                cwd: {
                  type: "string",
                  description: "Working directory (optional)",
                },
              },
              required: ["command"],
            },
          },
          {
            name: "get_system_info",
            description:
              "Get comprehensive system information (platform, Node version, Python version, memory, etc.)",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "validate_security_sequence",
            description:
              "Validate a security sequence to approve a pending operation. The sequence must be submitted ALONE with no other text.",
            inputSchema: {
              type: "object",
              properties: {
                operation_id: {
                  type: "string",
                  description: "Operation ID from the approval request",
                },
                sequence: {
                  type: "string",
                  description:
                    "Security sequence to validate (must be exact match, alone)",
                },
              },
              required: ["operation_id", "sequence"],
            },
          },
          {
            name: "get_security_status",
            description: "Get status of a pending security operation",
            inputSchema: {
              type: "object",
              properties: {
                operation_id: {
                  type: "string",
                  description: "Operation ID to check status",
                },
              },
              required: ["operation_id"],
            },
          },
          {
            name: "check_flutter_status",
            description:
              "Check if Flutter SDK is installed and configured correctly",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "install_flutter",
            description:
              "Install Flutter SDK on Windows (requires security approval). Downloads Flutter 3.24.0 to C:\\src\\flutter and adds to PATH. This is a SYSTEM-LEVEL operation that requires explicit user approval via security sequence.",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "run_flutter_doctor",
            description:
              "Run flutter doctor to check Flutter setup and diagnose issues",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "generate_flutter_ui_mockup",
            description:
              "Generate Flutter UI mockup code from a description. Creates complete widget code for screens, forms, lists, etc.",
            inputSchema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description:
                    "Widget class name (e.g., 'LoginScreen', 'ProfilePage', must start with uppercase)",
                },
                description: {
                  type: "string",
                  description:
                    "Description of the UI to generate (e.g., 'Login screen with email and password fields')",
                },
                design_system: {
                  type: "string",
                  enum: ["material", "cupertino", "adaptive"],
                  description:
                    "Design system to use (material=Android, cupertino=iOS, adaptive=both). Defaults to material.",
                },
                layout: {
                  type: "string",
                  enum: ["column", "row", "stack", "list", "grid", "form"],
                  description: "Layout type for the UI. Defaults to column.",
                },
                include_state: {
                  type: "boolean",
                  description:
                    "Generate StatefulWidget with state management (true) or StatelessWidget (false). Defaults to false.",
                },
                include_comments: {
                  type: "boolean",
                  description:
                    "Include explanatory comments in generated code. Defaults to true.",
                },
              },
              required: ["name", "description"],
            },
          },
          // Voice Feedback tools
          {
            name: "speak_feedback",
            description:
              "Provide spoken voice feedback during work operations (separate from chat responses). Gives natural-sounding updates like 'Building... Now!' or 'I need some input please!' Uses 100% FREE platform-native TTS (Windows SAPI, macOS say, Linux espeak). No cloud services or paid APIs.",
            inputSchema: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                  description:
                    "Text to speak (e.g., 'Building... Now!', 'I need some input please!', 'Analysis complete')",
                },
                priority: {
                  type: "string",
                  enum: ["normal", "urgent", "low"],
                  description:
                    "Priority level affecting speech speed (urgent=faster, low=slower). Defaults to normal.",
                },
                interrupt: {
                  type: "boolean",
                  description:
                    "If true, interrupts any current speech. Defaults to false.",
                },
              },
              required: ["text"],
            },
          },
          {
            name: "stop_voice_feedback",
            description:
              "Stop any currently playing voice feedback speech",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "test_voice_feedback",
            description:
              "Test voice feedback by speaking a test message",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
        ],
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "health_check":
            return this.handleHealthCheck();

          case "get_neural_recommendation":
            return await this.handleNeuralRecommendation(args);

          case "log_expert_outcome":
            return await this.handleLogOutcome(args);

          case "validate_fact_suggestion":
            return await this.handleValidateFactSuggestion(args);

          case "check_pattern_generalization":
            return await this.handleCheckPatternGeneralization(args);

          case "route_query_to_experts":
            return await this.handleRouteQuery(args);

          case "generate_pdf":
            return await this.handleGeneratePDF(args);

          case "store_live_memory":
            return await this.handleStoreMemory(args);

          case "get_live_memory":
            return await this.handleGetMemory(args);

          case "query_database":
            return await this.handleDatabaseQuery(args);

          case "validate_mermaid_diagram":
            return await this.handleValidateMermaid(args);

          case "generate_mermaid_test_html":
            return await this.handleGenerateMermaidTestHTML(args);

          case "get_mermaid_examples":
            return await this.handleGetMermaidExamples();

          // YouTube Transcript Extraction tools
          case "extract_youtube_transcript":
            return await this.handleExtractYouTubeTranscript(args);

          case "youtube_list_captions":
            return await this.handleYouTubeListCaptions(args);

          case "youtube_download_caption":
            return await this.handleYouTubeDownloadCaption(args);

          case "youtube_get_quota_info":
            return await this.handleYouTubeGetQuotaInfo();

          case "check_youtube_service_status":
            return await this.handleCheckYouTubeServiceStatus();

          // Flutter UI Mockup tools
          case "generate_flutter_mockup":
            return await this.handleGenerateFlutterMockup(args);

          case "generate_flutter_pattern":
            return await this.handleGenerateFlutterPattern(args);

          case "list_flutter_patterns":
            return await this.handleListFlutterPatterns();

          case "generate_flutter_app_structure":
            return await this.handleGenerateFlutterAppStructure(args);

          case "get_cursor_performance_metrics":
            return await this.handleGetPerformanceMetrics();

          case "track_conversation_event":
            return await this.handleTrackConversationEvent(args);

          case "get_conversation_recommendations":
            return await this.handleGetConversationRecommendations(args);

          // JIRA tools
          case "jira_search_issues":
            return await this.handleJiraSearchIssues(args);

          case "jira_get_issue":
            return await this.handleJiraGetIssue(args);

          case "jira_create_issue":
            return await this.handleJiraCreateIssue(args);

          case "jira_update_issue":
            return await this.handleJiraUpdateIssue(args);

          case "jira_transition_issue":
            return await this.handleJiraTransitionIssue(args);

          case "jira_get_transitions":
            return await this.handleJiraGetTransitions(args);

          case "jira_add_comment":
            return await this.handleJiraAddComment(args);

          case "jira_get_projects":
            return await this.handleJiraGetProjects();

          case "jira_health_check":
            return await this.handleJiraHealthCheck();

          case "jira_resolve_current_user":
            return await this.handleJiraResolveCurrentUser();

          case "jira_set_conversation_user":
            return await this.handleJiraSetConversationUser(args);

          case "jira_get_conversation_user":
            return await this.handleJiraGetConversationUser(args);

          // SQL Server tools
          case "sql_server_list_servers":
            return await this.handleSqlServerListServers();

          case "sql_server_connect":
            return await this.handleSqlServerConnect(args);

          case "sql_server_list_databases":
            return await this.handleSqlServerListDatabases(args);

          case "sql_server_select_database":
            return await this.handleSqlServerSelectDatabase(args);

          case "sql_server_get_connection_string":
            return await this.handleSqlServerGetConnectionString(args);

          case "sql_server_execute_query":
            return await this.handleSqlServerExecuteQuery(args);

          case "sql_server_execute_procedure":
            return await this.handleSqlServerExecuteProcedure(args);

          case "sql_server_get_status":
            return await this.handleSqlServerGetStatus();

          // T-SQL Query Library tools
          case "tsql_library_search":
            return await this.handleTsqlLibrarySearch(args);

          case "tsql_library_get":
            return await this.handleTsqlLibraryGet(args);

          case "tsql_library_add":
            return await this.handleTsqlLibraryAdd(args);

          case "tsql_library_list_categories":
            return await this.handleTsqlLibraryListCategories();

          case "tsql_library_stats":
            return await this.handleTsqlLibraryStats();

          case "tsql_library_find_similar":
            return await this.handleTsqlLibraryFindSimilar(args);

          // PostgreSQL tools
          case "postgresql_list_servers":
            return await this.handlePostgreSQLListServers();

          case "postgresql_connect":
            return await this.handlePostgreSQLConnect(args);

          case "postgresql_list_databases":
            return await this.handlePostgreSQLListDatabases(args);

          case "postgresql_select_database":
            return await this.handlePostgreSQLSelectDatabase(args);

          case "postgresql_get_connection_string":
            return await this.handlePostgreSQLGetConnectionString(args);

          case "postgresql_execute_query":
            return await this.handlePostgreSQLExecuteQuery(args);

          case "postgresql_execute_procedure":
            return await this.handlePostgreSQLExecuteProcedure(args);

          case "postgresql_get_status":
            return await this.handlePostgreSQLGetStatus();

          // PgSQL Query Library tools
          case "pgsql_library_search":
            return await this.handlePgSqlLibrarySearch(args);

          case "pgsql_library_get":
            return await this.handlePgSqlLibraryGet(args);

          case "pgsql_library_add":
            return await this.handlePgSqlLibraryAdd(args);

          case "pgsql_library_list_categories":
            return await this.handlePgSqlLibraryListCategories();

          case "pgsql_library_stats":
            return await this.handlePgSqlLibraryStats();

          case "pgsql_library_find_similar":
            return await this.handlePgSqlLibraryFindSimilar(args);

          case "check_node_version":
            return await this.handleCheckNodeVersion(args);

          case "check_python_version":
            return await this.handleCheckPythonVersion(args);

          case "check_npm_version":
            return await this.handleCheckNpmVersion(args);

          case "check_pip_version":
            return await this.handleCheckPipVersion(args);

          case "check_npm_package":
            return await this.handleCheckNpmPackage(args);

          case "check_python_package":
            return await this.handleCheckPythonPackage(args);

          case "install_npm_package":
            return await this.handleInstallNpmPackage(args);

          case "install_python_package":
            return await this.handleInstallPythonPackage(args);

          case "update_npm_dependencies":
            return await this.handleUpdateNpmDependencies(args);

          case "update_python_dependencies":
            return await this.handleUpdatePythonDependencies(args);

          case "run_system_command":
            return await this.handleRunSystemCommand(args);

          case "get_system_info":
            return await this.handleGetSystemInfo(args);

          case "validate_security_sequence":
            return await this.handleValidateSecuritySequence(args);

          case "get_security_status":
            return await this.handleGetSecurityStatus(args);

          case "check_flutter_status":
            return await this.handleCheckFlutterStatus();

          case "install_flutter":
            return await this.handleInstallFlutter();

          case "run_flutter_doctor":
            return await this.handleRunFlutterDoctor();

          case "generate_flutter_ui_mockup":
            return await this.handleGenerateFlutterUIMockup(args);

          // Voice Feedback tools
          case "speak_feedback":
            return await this.handleSpeakFeedback(args);

          case "stop_voice_feedback":
            return await this.handleStopVoiceFeedback();

          case "test_voice_feedback":
            return await this.handleTestVoiceFeedback();

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private handleHealthCheck() {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        neuralNetwork: this.neuralService.getStatus(),
        pdfGeneration: this.pdfService.getStatus(),
        liveMemory: this.memoryService.getStatus(),
        database: this.dbService.getStatus(),
        sqlServer: this.sqlServerService
          ? this.sqlServerService.getStatus()
          : "not_configured",
        tsqlLibrary: this.tsqlLibraryService
          ? this.tsqlLibraryService.getStatus()
          : "not_configured",
        postgreSQL: this.postgreSQLService
          ? this.postgreSQLService.getStatus()
          : "not_configured",
        pgsqlLibrary: this.pgsqlLibraryService
          ? this.pgsqlLibraryService.getStatus()
          : "not_configured",
        monitoring: "active",
        jira: this.jiraService ? "active" : "not_configured",
        securityCheckpoint: this.securityService.getStatus(),
        systemManagement: this.systemService.getStatus(),
        flutterManagement: this.flutterService.getStatus(),
        voiceFeedback: (() => {
          const status = this.voiceFeedbackService.getStatus();
          return {
            enabled: this.voiceFeedbackService.getEnabled(),
            provider: status.provider,
            azureConfigured: status.azureConfigured,
            platform: status.platform,
          };
        })(),
      },
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(health, null, 2),
        },
      ],
    };
  }

  private async handleNeuralRecommendation(args: any) {
    const { expertId, context } = args;
    const recommendation = await this.neuralService.getRecommendation(
      expertId,
      context
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(recommendation, null, 2),
        },
      ],
    };
  }

  private async handleLogOutcome(args: any) {
    const { expertId, interaction, outcome } = args;
    await this.neuralService.logOutcome(expertId, interaction, outcome);

    return {
      content: [
        {
          type: "text",
          text: `Outcome logged successfully for ${expertId}`,
        },
      ],
    };
  }

  private async handleValidateFactSuggestion(args: any) {
    const { factStatement, context, evidence } = args;
    const result = await this.neuralService.validateFactSuggestion(
      factStatement,
      context,
      evidence
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleCheckPatternGeneralization(args: any) {
    const { patternCode, challengeContext, crossChallengeFeatures } = args;
    const result = await this.neuralService.checkPatternGeneralization(
      patternCode,
      challengeContext,
      crossChallengeFeatures
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleRouteQuery(args: any) {
    const { query, context = {} } = args;
    const decision = await this.queryRouterService.routeQuery(query, context);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(decision, null, 2),
        },
      ],
    };
  }

  private async handleGeneratePDF(args: any) {
    const { template, data, outputPath } = args;
    const pdfPath = await this.pdfService.generatePDF(
      template,
      data,
      outputPath
    );

    return {
      content: [
        {
          type: "text",
          text: `✅ PDF generated successfully!\n\nPath: ${pdfPath}\nTemplate: ${template}\n\nThe PDF contains the complete formatted content from the source document.`,
        },
      ],
    };
  }

  private async handleStoreMemory(args: any) {
    const { key, value, ttl } = args;
    await this.memoryService.set(key, value, ttl);

    return {
      content: [
        {
          type: "text",
          text: `Memory stored successfully: ${key}`,
        },
      ],
    };
  }

  private async handleGetMemory(args: any) {
    const { key } = args;
    const value = await this.memoryService.get(key);

    return {
      content: [
        {
          type: "text",
          text: value ? JSON.stringify(value, null, 2) : "Key not found",
        },
      ],
    };
  }

  private async handleDatabaseQuery(args: any) {
    const { query, params } = args;
    const results = await this.dbService.query(query, params);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async handleGetPerformanceMetrics() {
    const metrics = await this.monitoringService.getPerformanceMetrics();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(metrics, null, 2),
        },
      ],
    };
  }

  private async handleTrackConversationEvent(args: any) {
    const { conversationId, action, data } = args;
    this.monitoringService.trackConversation(conversationId, action, data);

    return {
      content: [
        {
          type: "text",
          text: `Event tracked: ${action} for conversation ${conversationId}`,
        },
      ],
    };
  }

  private async handleGetConversationRecommendations(args: any) {
    const { conversationId } = args;
    const recommendations =
      this.monitoringService.getConversationRecommendations(conversationId);

    return {
      content: [
        {
          type: "text",
          text:
            recommendations.length > 0
              ? JSON.stringify({ recommendations }, null, 2)
              : "No recommendations - conversation is healthy",
        },
      ],
    };
  }

  private async handleValidateMermaid(args: any) {
    const { diagram, type } = args;
    const result = this.mermaidService.validateDiagram(diagram, type);

    let responseText = `# Mermaid Diagram Validation\n\n`;
    responseText += `**Status:** ${
      result.valid ? "✅ VALID" : "❌ INVALID"
    }\n\n`;

    if (result.errors.length > 0) {
      responseText += `## ❌ Errors (${result.errors.length})\n`;
      result.errors.forEach((err, i) => {
        responseText += `${i + 1}. ${err}\n`;
      });
      responseText += `\n`;
    }

    if (result.warnings.length > 0) {
      responseText += `## ⚠️ Warnings (${result.warnings.length})\n`;
      result.warnings.forEach((warn, i) => {
        responseText += `${i + 1}. ${warn}\n`;
      });
      responseText += `\n`;
    }

    if (result.sanitized) {
      responseText += `## 🔧 Sanitized Version (Emojis Removed)\n\n`;
      responseText += `\`\`\`mermaid\n${result.sanitized}\n\`\`\`\n\n`;
      responseText += `**Recommendation:** Use the sanitized version for better compatibility.\n`;
    }

    if (result.valid && result.warnings.length === 0) {
      responseText += `## ✅ All Good!\n\nYour Mermaid diagram passed all checks.\n`;
    }

    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };
  }

  private async handleGenerateMermaidTestHTML(args: any) {
    const { diagram, outputPath } = args;
    const html = this.mermaidService.generateTestHTML(diagram);

    // Write HTML file using Node.js fs
    const fs = await import("fs");
    const path = await import("path");

    const fullPath = path.resolve(outputPath);
    fs.writeFileSync(fullPath, html, "utf8");

    return {
      content: [
        {
          type: "text",
          text: `✅ Test HTML generated: ${fullPath}\n\nOpen this file in a browser to see the rendered diagram.`,
        },
      ],
    };
  }

  private async handleGetMermaidExamples() {
    const examples = this.mermaidService.getExamples();

    let responseText = `# Mermaid Diagram Examples\n\n`;

    for (const [type, code] of Object.entries(examples)) {
      responseText += `## ${type.charAt(0).toUpperCase() + type.slice(1)}\n\n`;
      responseText += `\`\`\`mermaid\n${code}\n\`\`\`\n\n`;
    }

    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };
  }

  // ============================================================================
  // YOUTUBE TRANSCRIPT EXTRACTION HANDLER METHODS
  // ============================================================================

  private async handleExtractYouTubeTranscript(args: any) {
    const {
      videoUrl,
      outputPath,
      includeTimestamps = false,
      includeMetadata = true,
      title = "YouTube Video Transcript",
    } = args;

    try {
      // Check if service is available
      if (!this.youtubeService.isAvailable()) {
        return {
          content: [
            {
              type: "text",
              text:
                "❌ YouTube Transcript service is not available.\n\n" +
                "The youtube-transcript package is not installed.\n\n" +
                "**To enable this feature:**\n" +
                "1. Navigate to .cursor/cursor-capabilities-service\n" +
                "2. Run: npm install\n" +
                "3. Restart the MCP service\n",
            },
          ],
          isError: true,
        };
      }

      // Extract transcript
      const data = await this.youtubeService.extractTranscript(videoUrl);

      // Save to file
      await this.youtubeService.saveTranscript(data, outputPath, {
        format: "markdown",
        includeTimestamps,
        includeMetadata,
        title,
      });

      return {
        content: [
          {
            type: "text",
            text:
              `✅ Successfully extracted YouTube transcript!\n\n` +
              `**Video Information:**\n` +
              `- Video URL: ${data.videoUrl}\n` +
              `- Video ID: ${data.videoId}\n` +
              `- Duration: ${Math.round(
                data.metadata.totalDuration
              )} seconds\n` +
              `- Word Count: ${data.metadata.wordCount.toLocaleString()}\n` +
              `- Segments: ${data.metadata.totalSegments}\n\n` +
              `**Output:**\n` +
              `- Saved to: \`${outputPath}\`\n` +
              `- Format: Markdown\n` +
              `- Timestamps: ${includeTimestamps ? "Yes" : "No"}\n` +
              `- Metadata: ${includeMetadata ? "Yes" : "No"}\n\n` +
              `**Next Steps:**\n` +
              `1. Review the transcript at: ${outputPath}\n` +
              `2. Extract key concepts and facts\n` +
              `3. Organize into hierarchical knowledge structure\n` +
              `4. Update expert's behavior.json file\n`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text:
              `❌ Failed to extract YouTube transcript\n\n` +
              `**Error:** ${error.message}\n\n` +
              `**Common Causes:**\n` +
              `- Video does not have captions enabled\n` +
              `- Video creator disabled transcript access\n` +
              `- Invalid video URL or ID\n` +
              `- Video is private or unavailable\n\n` +
              `**Video URL provided:** ${videoUrl}\n`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleYouTubeListCaptions(args: any) {
    const { videoId } = args;

    try {
      if (!this.youtubeAPIService.isAvailable()) {
        return {
          content: [
            {
              type: "text",
              text:
                "❌ YouTube Data API not configured\n\n" +
                "**Missing:** YOUTUBE_API_KEY environment variable\n\n" +
                "**To enable:**\n" +
                "1. Create API key in Google Cloud Console\n" +
                "2. Enable YouTube Data API v3\n" +
                "3. Set YOUTUBE_API_KEY environment variable\n" +
                "4. Restart MCP service\n",
            },
          ],
          isError: true,
        };
      }

      const result = await this.youtubeAPIService.listCaptions(videoId);

      let response =
        `✅ Found ${result.metadata.totalCaptions} caption track(s) for video: ${videoId}\n\n` +
        `**Summary:**\n` +
        `- Manual Captions: ${result.metadata.manualCaptions}\n` +
        `- Auto-Generated: ${result.metadata.autoGeneratedCaptions}\n\n`;

      if (result.captions.length === 0) {
        response += `⚠️  This video has NO captions available.\n`;
      } else {
        response += `**Caption Tracks:**\n\n`;
        for (const caption of result.captions) {
          const typeEmoji = caption.trackKind === "standard" ? "✅" : "🤖";
          const downloadable =
            caption.trackKind === "standard"
              ? "Yes (with OAuth)"
              : "No (API limitation)";
          response +=
            `${typeEmoji} **${caption.name}** (${caption.language})\n` +
            `   - ID: \`${caption.id}\`\n` +
            `   - Type: ${caption.trackKind} ${
              caption.isAutoGenerated ? "(auto-generated)" : "(manual)"
            }\n` +
            `   - Status: ${caption.status}\n` +
            `   - Downloadable via API: ${downloadable}\n\n`;
        }

        response += `**Note:** Auto-generated captions cannot be downloaded via YouTube Data API.\n`;
        response += `Use \`extract_youtube_transcript\` (scraping method) for auto-generated captions.\n`;
      }

      response += `\n**Quota Cost:** 50 units (this call)\n`;

      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Failed to list captions\n\n**Error:** ${error.message}\n`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleYouTubeDownloadCaption(args: any) {
    const { captionId, format = "srt", outputPath } = args;

    try {
      if (!this.youtubeAPIService.hasOAuth()) {
        return {
          content: [
            {
              type: "text",
              text:
                "❌ OAuth 2.0 not configured\n\n" +
                "**Required for captions.download:**\n" +
                "- YOUTUBE_CLIENT_ID\n" +
                "- YOUTUBE_CLIENT_SECRET\n" +
                "- YOUTUBE_REFRESH_TOKEN\n\n" +
                "**Alternative:** Use `extract_youtube_transcript` (scraping method) which doesn't require OAuth.\n",
            },
          ],
          isError: true,
        };
      }

      const result = await this.youtubeAPIService.downloadCaption(
        captionId,
        format as any
      );

      // Parse transcript if SRT format
      let segments: any[] = [];
      let wordCount = 0;
      if (format === "srt") {
        segments = this.youtubeAPIService.parseTranscript(
          result.content,
          format
        );
        const text = segments.map((s) => s.text).join(" ");
        wordCount = text.split(/\s+/).length;
      }

      // Save to file if outputPath provided
      if (outputPath) {
        const fs = await import("fs/promises");
        await fs.writeFile(outputPath, result.content, "utf-8");
      }

      let response =
        `✅ Successfully downloaded caption!\n\n` +
        `**Caption ID:** ${result.captionId}\n` +
        `**Format:** ${result.format}\n` +
        `**Content Length:** ${result.content.length} characters\n`;

      if (segments.length > 0) {
        response += `**Segments:** ${segments.length}\n`;
        response += `**Word Count:** ${wordCount}\n`;
      }

      if (outputPath) {
        response += `**Saved to:** ${outputPath}\n`;
      }

      response += `\n**Quota Cost:** 200 units (this call)\n`;
      response += `\n⚠️  **Remember:** This only works for manually uploaded captions, not auto-generated.\n`;

      return {
        content: [
          {
            type: "text",
            text: response,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Failed to download caption\n\n**Error:** ${error.message}\n`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleYouTubeGetQuotaInfo() {
    const quotaInfo = this.youtubeAPIService.getQuotaUsageEstimate();

    const response =
      `# YouTube Data API v3 Quota Information\n\n` +
      `${quotaInfo.message}\n\n` +
      `**Recommendations:**\n` +
      quotaInfo.recommendations.map((r) => `- ${r}`).join("\n") +
      "\n\n" +
      `**API Status:**\n` +
      `- API Key: ${
        this.youtubeAPIService.isAvailable()
          ? "✅ Configured"
          : "❌ Not configured"
      }\n` +
      `- OAuth 2.0: ${
        this.youtubeAPIService.hasOAuth()
          ? "✅ Configured"
          : "❌ Not configured"
      }\n\n` +
      `**Configuration:**\n` +
      `- Set YOUTUBE_API_KEY for captions.list (read-only, 50 units)\n` +
      `- Set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN for captions.download (200 units)\n`;

    return {
      content: [
        {
          type: "text",
          text: response,
        },
      ],
    };
  }

  private async handleCheckYouTubeServiceStatus() {
    const scrapingAvailable = await this.youtubeService.isAvailable();
    const apiAvailable = this.youtubeAPIService.isAvailable();
    const oauthAvailable = this.youtubeAPIService.hasOAuth();

    let response = `# YouTube Transcript Services Status\n\n`;

    response += `## 1. Scraping Method (extract_youtube_transcript)\n`;
    if (scrapingAvailable) {
      response +=
        `✅ **AVAILABLE**\n\n` +
        `**Capabilities:**\n` +
        `- Extract auto-generated captions ✅\n` +
        `- Extract manual captions ✅\n` +
        `- No API key required ✅\n` +
        `- No quota limits ✅\n` +
        `- Markdown formatting with timestamps\n` +
        `- Save to custom output paths\n\n` +
        `**Best for:** Auto-generated captions (90%+ of YouTube videos)\n\n`;
    } else {
      response +=
        `⚠️ **NOT AVAILABLE**\n\n` +
        `youtube-transcript package not installed.\n` +
        `Run: npm install\n\n`;
    }

    response += `## 2. Official API Method (youtube_list_captions, youtube_download_caption)\n`;
    if (apiAvailable) {
      response +=
        `✅ **API Key Configured** (captions.list available)\n` +
        `${oauthAvailable ? "✅" : "❌"} **OAuth 2.0** ${
          oauthAvailable ? "Configured" : "Not Configured"
        } (required for captions.download)\n\n` +
        `**Capabilities:**\n` +
        `- List available captions (50 units) ✅\n` +
        `- Download manual captions (200 units) ${
          oauthAvailable ? "✅" : "❌ Needs OAuth"
        }\n` +
        `- Auto-generated captions ❌ NOT SUPPORTED BY API\n\n` +
        `**Limitations:**\n` +
        `- Requires OAuth 2.0 for caption download\n` +
        `- Cannot access auto-generated captions (API limitation)\n` +
        `- Quota limits: 10,000 units/day (max ~50 downloads)\n\n` +
        `**Best for:** Videos with manually uploaded captions (rare)\n\n`;
    } else {
      response +=
        `❌ **NOT CONFIGURED**\n\n` +
        `Set YOUTUBE_API_KEY environment variable to enable.\n\n`;
    }

    response += `## Recommendation\n\n`;
    response += `For most YouTube videos, use **\`extract_youtube_transcript\`** (scraping method).\n`;
    response += `It supports auto-generated captions and has no quota limits.\n\n`;
    response += `Use official API only for videos with manually uploaded captions and when you have OAuth configured.\n`;

    return {
      content: [
        {
          type: "text",
          text: response,
        },
      ],
    };
  }

  // ============================================================================
  // FLUTTER UI MOCKUP HANDLER METHODS
  // ============================================================================

  private async handleGenerateFlutterMockup(args: any) {
    const {
      name,
      description,
      designSystem,
      layout,
      includeState,
      includeComments,
    } = args;

    const result = await this.flutterUIService.generateMockup({
      name,
      description,
      designSystem: designSystem || "material",
      layout: layout || "column",
      includeState: includeState !== undefined ? includeState : false,
      includeComments: includeComments !== undefined ? includeComments : true,
    });

    return {
      content: [
        {
          type: "text",
          text: `# Flutter UI Mockup: ${result.name}\n\n**Design System:** ${
            result.designSystem
          }\n**Has State:** ${
            result.hasState ? "Yes (StatefulWidget)" : "No (StatelessWidget)"
          }\n\n## Generated Code\n\n\`\`\`dart\n${
            result.code
          }\`\`\`\n\n## Usage\n\n${
            result.usage
          }\n\n---\n\n✅ Generated Flutter ${
            result.hasState ? "StatefulWidget" : "StatelessWidget"
          } with ${result.designSystem} design system.`,
        },
      ],
    };
  }

  private async handleGenerateFlutterPattern(args: any) {
    const { pattern, name, designSystem } = args;

    const options: any = {};
    if (name) options.name = name;
    if (designSystem) options.designSystem = designSystem;

    const result = await this.flutterUIService.generatePattern(
      pattern,
      options
    );

    return {
      content: [
        {
          type: "text",
          text: `# Flutter UI Pattern: ${pattern}\n\n**Widget Name:** ${
            result.name
          }\n**Design System:** ${result.designSystem}\n**Has State:** ${
            result.hasState ? "Yes (StatefulWidget)" : "No (StatelessWidget)"
          }\n\n## Generated Code\n\n\`\`\`dart\n${
            result.code
          }\`\`\`\n\n## Usage\n\n${
            result.usage
          }\n\n---\n\n✅ Generated ${pattern} pattern successfully.`,
        },
      ],
    };
  }

  private async handleListFlutterPatterns() {
    const patterns = this.flutterUIService.listPatterns();

    let responseText = `# Available Flutter UI Patterns\n\n`;
    responseText += `The following UI patterns can be generated:\n\n`;

    for (const pattern of patterns) {
      responseText += `- **${pattern}**: \`generate_flutter_pattern(pattern: "${pattern}")\`\n`;
    }

    responseText += `\n## Pattern Descriptions\n\n`;
    responseText += `- **login**: Login screen with email/password fields and login button\n`;
    responseText += `- **signup**: Signup screen with name, email, password, confirm password fields\n`;
    responseText += `- **profile**: Profile screen with avatar, name, email, bio, edit button\n`;
    responseText += `- **list**: List screen with items in ListView (title, subtitle, trailing icon)\n`;
    responseText += `- **detail**: Detail screen with header image, title, description, action buttons\n`;
    responseText += `- **settings**: Settings screen with sections (Account, Notifications, Privacy)\n`;

    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };
  }

  private async handleGenerateFlutterAppStructure(args: any) {
    const { appName, screens } = args;

    const structure = await this.flutterUIService.generateAppStructure(
      appName,
      screens
    );

    let responseText = `# Flutter App Structure: ${appName}\n\n`;
    responseText += `Generated complete app with ${screens.length} screens:\n\n`;

    for (const [path, code] of Object.entries(structure)) {
      responseText += `## ${path}\n\n`;
      responseText += `\`\`\`dart\n${code}\`\`\`\n\n`;
    }

    responseText += `---\n\n✅ Generated complete Flutter app structure with navigation.`;

    return {
      content: [
        {
          type: "text",
          text: responseText,
        },
      ],
    };
  }

  // ============================================================================
  // JIRA HANDLER METHODS
  // ============================================================================

  private ensureJiraService(): JiraService {
    if (!this.jiraService) {
      throw new Error(
        "JIRA service not configured. Set JIRA_EMAIL and JIRA_API_TOKEN environment variables."
      );
    }
    return this.jiraService;
  }

  private async handleJiraSearchIssues(args: any) {
    const jira = this.ensureJiraService();
    const { jql, maxResults, fields } = args;

    const result = await jira.searchIssues({
      jql,
      maxResults: maxResults || 50,
      fields: fields || ["key", "summary", "status", "assignee", "priority"],
    });

    if (result.success) {
      const issues = result.data?.issues || [];
      return {
        content: [
          {
            type: "text",
            text: `Found ${issues.length} issue(s):\n\n${JSON.stringify(
              result.data,
              null,
              2
            )}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Error: ${
            result.error?.message
          }\n\nDetails: ${JSON.stringify(result.error?.details, null, 2)}`,
        },
      ],
      isError: true,
    };
  }

  private async handleJiraGetIssue(args: any) {
    const jira = this.ensureJiraService();
    const { issueKey, fields } = args;

    const result = await jira.getIssue(issueKey, fields);

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Error: ${result.error?.message}`,
        },
      ],
      isError: true,
    };
  }

  private async handleJiraCreateIssue(args: any) {
    const jira = this.ensureJiraService();
    const {
      projectKey,
      summary,
      issueType,
      description,
      assigneeAccountId,
      priority,
      labels,
    } = args;

    const fields: any = {
      project: { key: projectKey },
      summary,
      issuetype: { name: issueType },
    };

    if (description) fields.description = description;
    if (assigneeAccountId) fields.assignee = { accountId: assigneeAccountId };
    if (priority) fields.priority = { name: priority };
    if (labels) fields.labels = labels;

    const result = await jira.createIssue(fields);

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `✅ Issue created successfully!\n\nKey: ${
              result.data?.key
            }\nID: ${result.data?.id}\n\n${JSON.stringify(
              result.data,
              null,
              2
            )}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Error creating issue: ${
            result.error?.message
          }\n\nDetails: ${JSON.stringify(result.error?.details, null, 2)}`,
        },
      ],
      isError: true,
    };
  }

  private async handleJiraUpdateIssue(args: any) {
    const jira = this.ensureJiraService();
    const { issueKey, fields } = args;

    const result = await jira.updateIssue(issueKey, fields);

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `✅ Issue ${issueKey} updated successfully!`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Error updating issue: ${result.error?.message}`,
        },
      ],
      isError: true,
    };
  }

  private async handleJiraTransitionIssue(args: any) {
    const jira = this.ensureJiraService();
    const { issueKey, transitionId } = args;

    const result = await jira.transitionIssue(issueKey, transitionId);

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `✅ Issue ${issueKey} transitioned successfully!`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Error transitioning issue: ${result.error?.message}`,
        },
      ],
      isError: true,
    };
  }

  private async handleJiraGetTransitions(args: any) {
    const jira = this.ensureJiraService();
    const { issueKey } = args;

    const result = await jira.getTransitions(issueKey);

    if (result.success) {
      const transitions = result.data?.transitions || [];
      let text = `Available transitions for ${issueKey}:\n\n`;
      transitions.forEach((t: any) => {
        text += `- ID: ${t.id} | Name: "${t.name}" → Status: "${t.to.name}"\n`;
      });
      text += `\n${JSON.stringify(result.data, null, 2)}`;

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Error getting transitions: ${result.error?.message}`,
        },
      ],
      isError: true,
    };
  }

  private async handleJiraAddComment(args: any) {
    const jira = this.ensureJiraService();
    const { issueKey, comment } = args;

    const result = await jira.addComment(issueKey, comment);

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `✅ Comment added to ${issueKey}!\n\n${JSON.stringify(
              result.data,
              null,
              2
            )}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Error adding comment: ${result.error?.message}`,
        },
      ],
      isError: true,
    };
  }

  private async handleJiraGetProjects() {
    const jira = this.ensureJiraService();

    const result = await jira.getProjects();

    if (result.success) {
      const projects = result.data || [];
      let text = `Found ${projects.length} project(s):\n\n`;
      projects.forEach((p: any) => {
        text += `- ${p.key}: ${p.name}\n`;
      });
      text += `\n${JSON.stringify(projects, null, 2)}`;

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Error getting projects: ${result.error?.message}`,
        },
      ],
      isError: true,
    };
  }

  private async handleJiraHealthCheck() {
    const jira = this.ensureJiraService();

    const result = await jira.healthCheck();

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `✅ JIRA API Health Check: ${result.data?.status}\n\n${result.data?.message}\n\nUser: ${result.data?.user?.displayName} (${result.data?.user?.emailAddress})`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ JIRA API Health Check Failed: ${result.error?.message}`,
        },
      ],
      isError: true,
    };
  }

  private async handleJiraResolveCurrentUser() {
    const jira = this.ensureJiraService();

    try {
      // Get mapping info
      const mappingInfo = jira.getUserMappingInfo();

      // Try to resolve user
      const resolution = await jira.resolveJiraUser();

      let text = `# JIRA User Resolution\n\n`;
      text += `**Windows User:** ${mappingInfo.windowsUser}\n`;
      text += `**Has Mapping:** ${
        mappingInfo.hasMappingConfigured ? "✅ Yes" : "❌ No"
      }\n`;
      text += `**Total Mappings:** ${mappingInfo.totalMappings}\n\n`;

      if (mappingInfo.hasMappingConfigured && mappingInfo.mapping) {
        text += `## Configured Mapping\n`;
        text += `- Email: ${mappingInfo.mapping.email}\n`;
        text += `- Account ID: ${
          mappingInfo.mapping.accountId || "Not set (will be looked up)"
        }\n`;
        if (mappingInfo.mapping.displayName) {
          text += `- Display Name: ${mappingInfo.mapping.displayName}\n`;
        }
        text += `\n`;
      }

      text += `## Resolved JIRA User\n`;
      text += `- Email: ${resolution.email}\n`;
      text += `- Account ID: ${resolution.accountId || "❌ Not found"}\n`;
      if (resolution.displayName) {
        text += `- Display Name: ${resolution.displayName}\n`;
      }
      text += `- Source: ${resolution.source}\n\n`;

      if (!mappingInfo.hasMappingConfigured) {
        text += `## ⚠️ No Mapping Configured\n\n`;
        text += `To add a mapping for user "${mappingInfo.windowsUser}":\n\n`;
        text += `1. Edit \`.cursor/cursor-capabilities-service/jira-user-mapping.json\`\n`;
        text += `2. Add entry:\n`;
        text += `\`\`\`json\n`;
        text += `"${mappingInfo.windowsUser}": {\n`;
        text += `  "email": "your-email@example.com",\n`;
        text += `  "accountId": "optional-account-id",\n`;
        text += `  "displayName": "Your Name"\n`;
        text += `}\n`;
        text += `\`\`\`\n\n`;
        text += `Or use \`jira_set_conversation_user\` to set user for this conversation.\n`;
      }

      if (!resolution.accountId) {
        text += `## ❌ Account ID Not Found\n\n`;
        text += `Could not resolve account ID for email: ${resolution.email}\n\n`;
        text += `You can:\n`;
        text += `1. Use \`jira_set_conversation_user\` with correct email\n`;
        text += `2. Find your account ID at: https://[your-domain].atlassian.net/people\n`;
        text += `3. Add account ID to user mapping file\n`;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error resolving user: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleJiraSetConversationUser(args: any) {
    const jira = this.ensureJiraService();
    const { email, accountId, conversationId } = args;

    try {
      // Resolve user (lookup accountId if not provided)
      const resolution = await jira.resolveJiraUser(email, accountId);

      if (!resolution.accountId) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Could not find JIRA user with email: ${email}\n\nPlease verify the email address or provide the accountId.`,
            },
          ],
          isError: true,
        };
      }

      // Store in conversation memory
      const memoryKey = `jira_user_${conversationId}`;
      await this.memoryService.set(memoryKey, {
        email: resolution.email,
        accountId: resolution.accountId,
        displayName: resolution.displayName,
        setAt: new Date().toISOString(),
      });

      return {
        content: [
          {
            type: "text",
            text: `✅ JIRA user set for this conversation!\n\nEmail: ${
              resolution.email
            }\nAccount ID: ${resolution.accountId}\n${
              resolution.displayName
                ? `Display Name: ${resolution.displayName}\n`
                : ""
            }\nThis user will be used for comments and assignments in this conversation.`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error setting conversation user: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleJiraGetConversationUser(args: any) {
    const { conversationId } = args;

    try {
      const memoryKey = `jira_user_${conversationId}`;
      const userData = await this.memoryService.get(memoryKey);

      if (!userData) {
        const jira = this.ensureJiraService();
        const resolution = await jira.resolveJiraUser();

        return {
          content: [
            {
              type: "text",
              text: `No user set for this conversation.\n\nWill use auto-resolved user:\n- Email: ${
                resolution.email
              }\n- Account ID: ${
                resolution.accountId || "Not found"
              }\n- Source: ${
                resolution.source
              }\n\nUse \`jira_set_conversation_user\` to override.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Current conversation user:\n\n${JSON.stringify(
              userData,
              null,
              2
            )}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error getting conversation user: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  // ============================================================================
  // SQL SERVER HANDLER METHODS
  // ============================================================================

  private ensureSqlServerService(): SqlServerService {
    if (!this.sqlServerService) {
      throw new Error(
        "SQL Server service not configured. Check sql-server-config.json."
      );
    }
    return this.sqlServerService;
  }

  private async handleSqlServerListServers() {
    const sqlService = this.ensureSqlServerService();
    const servers = sqlService.getAvailableServers();

    let text = `# Available SQL Server Instances\n\n`;
    text += `Found ${servers.length} server(s):\n\n`;

    servers.forEach((server) => {
      text += `## ${server.name}\n`;
      text += `- **Server:** ${server.server}\n`;
      text += `- **Description:** ${server.description}\n`;
      text += `- **Authentication:** ${server.authentication}\n`;
      if (server.security) {
        text += `- **Security:** ${server.security.note}\n`;
        text += `- **Data Classification:** ${server.security.dataClassification}\n`;
      }
      text += `\n`;
    });

    text += `\n**Next Steps:**\n`;
    text += `1. Connect to a server: \`sql_server_connect\`\n`;
    text += `2. List databases: \`sql_server_list_databases\`\n`;
    text += `3. Select database: \`sql_server_select_database\`\n`;
    text += `4. Execute queries: \`sql_server_execute_query\`\n`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  private async handleSqlServerConnect(args: any) {
    const sqlService = this.ensureSqlServerService();
    const { serverName } = args;

    const result = await sqlService.connectToServer(serverName);

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `✅ ${result.message}\n\nServer: ${result.server}\nAuthentication: ${result.authentication}\n\n**Next:** Use \`sql_server_list_databases\` to see available databases.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Connection failed: ${result.error}\n\nServer: ${serverName}`,
        },
      ],
      isError: true,
    };
  }

  private async handleSqlServerListDatabases(args: any) {
    const sqlService = this.ensureSqlServerService();
    const { serverName } = args;

    const result = await sqlService.getDatabases(serverName);

    if (result.success) {
      let text = `# Databases on ${serverName}\n\n`;
      text += `Found ${result.count} database(s):\n\n`;

      result.databases.forEach((db: any) => {
        text += `- **${db.database_name}**\n`;
        text += `  - Size: ${db.size_mb} MB\n`;
        text += `  - Status: ${db.status}\n`;
        text += `  - Recovery Model: ${db.recovery_model}\n`;
        text += `  - Created: ${db.create_date}\n\n`;
      });

      text += `\n**Next:** Use \`sql_server_select_database\` to select a database for queries.`;

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Error: ${result.error}`,
        },
      ],
      isError: true,
    };
  }

  private async handleSqlServerSelectDatabase(args: any) {
    const sqlService = this.ensureSqlServerService();
    const { serverName, databaseName } = args;

    const result = await sqlService.selectDatabase(serverName, databaseName);

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `✅ ${result.message}\n\nYou can now execute queries using \`sql_server_execute_query\`.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Error: ${result.error}`,
        },
      ],
      isError: true,
    };
  }

  private async handleSqlServerGetConnectionString(args: any) {
    const sqlService = this.ensureSqlServerService();
    const { serverName, databaseName } = args;

    try {
      const connectionString = sqlService.getConnectionString(
        serverName,
        databaseName
      );

      let text = `# Connection String\n\n`;
      text += `**Server:** ${serverName}\n`;
      if (databaseName) {
        text += `**Database:** ${databaseName}\n`;
      }
      text += `\n`;
      text += `\`\`\`\n${connectionString}\n\`\`\`\n\n`;
      text += `⚠️ **Security Note:** This connection string uses Windows Authentication.\n`;
      text += `Ensure proper permissions are configured for the service account.\n\n`;
      text += `**Azure Key Vault Migration:** See sql-server-config.json for Key Vault setup.`;

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleSqlServerExecuteQuery(args: any) {
    const sqlService = this.ensureSqlServerService();
    const { serverName, query, params } = args;

    const result = await sqlService.executeQuery(serverName, query, params);

    if (result.success) {
      let text = `# Query Results\n\n`;
      text += `**Server:** ${serverName}\n`;
      text += `**Database:** ${result.database}\n`;
      text += `**Rows Affected:** ${result.rowsAffected}\n`;
      text += `**Row Count:** ${result.rowCount}\n\n`;

      if (result.recordset && result.recordset.length > 0) {
        text += `## Results\n\n`;
        text += `\`\`\`json\n${JSON.stringify(
          result.recordset,
          null,
          2
        )}\n\`\`\`\n`;
      } else {
        text += `No records returned.\n`;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Query Error: ${result.error}\n\nServer: ${serverName}\nDatabase: ${result.database}`,
        },
      ],
      isError: true,
    };
  }

  private async handleSqlServerExecuteProcedure(args: any) {
    const sqlService = this.ensureSqlServerService();
    const { serverName, procedureName, params } = args;

    const result = await sqlService.executeProcedure(
      serverName,
      procedureName,
      params
    );

    if (result.success) {
      let text = `# Stored Procedure Results\n\n`;
      text += `**Server:** ${serverName}\n`;
      text += `**Database:** ${result.database}\n`;
      text += `**Procedure:** ${result.procedure}\n`;
      text += `**Return Value:** ${result.returnValue}\n`;
      text += `**Rows Affected:** ${result.rowsAffected}\n\n`;

      if (result.recordset && result.recordset.length > 0) {
        text += `## Results\n\n`;
        text += `\`\`\`json\n${JSON.stringify(
          result.recordset,
          null,
          2
        )}\n\`\`\`\n`;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Procedure Error: ${result.error}`,
        },
      ],
      isError: true,
    };
  }

  private async handleSqlServerGetStatus() {
    const sqlService = this.ensureSqlServerService();
    const status = sqlService.getStatus();

    let text = `# SQL Server Service Status\n\n`;
    text += `**Status:** ${status.status}\n`;
    text += `**Mode:** ${status.mode}\n`;
    text += `**Configured Servers:** ${status.configuredServers.join(", ")}\n`;
    text += `**Azure Key Vault:** ${
      status.azureKeyVaultEnabled ? "Enabled" : "Disabled"
    }\n\n`;

    text += `## Connection Status\n\n`;
    text += `**Total Servers:** ${status.connectionStatus.totalServers}\n`;
    text += `**Connected:** ${status.connectionStatus.connectedServers}\n\n`;

    if (Object.keys(status.connectionStatus.servers).length > 0) {
      text += `### Servers:\n\n`;
      for (const [name, conn] of Object.entries(
        status.connectionStatus.servers
      )) {
        const c = conn as any;
        text += `- **${name}**\n`;
        text += `  - Connected: ${c.connected ? "✅ Yes" : "❌ No"}\n`;
        text += `  - Selected DB: ${c.selectedDatabase || "None"}\n`;
      }
    }

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  // ============================================================================
  // T-SQL QUERY LIBRARY HANDLER METHODS
  // ============================================================================

  private ensureTsqlLibraryService(): TsqlLibraryService {
    if (!this.tsqlLibraryService) {
      throw new Error(
        "T-SQL Query Library service not configured. Check tsql-query-library.json."
      );
    }
    return this.tsqlLibraryService;
  }

  private async handleTsqlLibrarySearch(args: any) {
    const tsqlLib = this.ensureTsqlLibraryService();
    const { searchTerm, category } = args;

    const results = tsqlLib.searchQueries(searchTerm, category);

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No queries found matching '${searchTerm}'${
              category ? ` in category '${category}'` : ""
            }.\n\nTry:\n- Different search terms\n- Broader keywords\n- Browse categories with tsql_library_list_categories`,
          },
        ],
      };
    }

    let text = `# T-SQL Library Search Results\n\n`;
    text += `Found ${results.length} matching quer${
      results.length === 1 ? "y" : "ies"
    }:\n\n`;

    results.forEach((query) => {
      text += `## ${query.id}\n`;
      text += `- **Category:** ${query.category}\n`;
      text += `- **Purpose:** ${query.purpose}\n`;
      text += `- **Times Used:** ${query.timesUsed}\n`;
      text += `- **Tags:** ${query.tags.join(", ")}\n`;
      if (query.parameters.length > 0) {
        text += `- **Parameters:** ${query.parameters
          .map((p) => `@${p.name}`)
          .join(", ")}\n`;
      }
      text += `\n`;
    });

    text += `\n**Next:** Use \`tsql_library_get\` with a query ID to get the full template.`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  private async handleTsqlLibraryGet(args: any) {
    const tsqlLib = this.ensureTsqlLibraryService();
    const { queryId, parameters } = args;

    if (parameters) {
      // Get query with parameter substitution
      const result = tsqlLib.replaceParameters(queryId, parameters);

      if (!result.success) {
        return {
          content: [
            {
              type: "text",
              text: `❌ ${result.error}\n\n${
                result.missingParameters
                  ? `Missing: ${result.missingParameters.join(", ")}\n\n`
                  : ""
              }${
                result.requiredParameters
                  ? `Required parameters:\n${result.requiredParameters
                      .map(
                        (p: any) => `- @${p.name} (${p.type}): ${p.description}`
                      )
                      .join("\n")}`
                  : ""
              }`,
            },
          ],
          isError: true,
        };
      }

      let text = `# Query: ${result.purpose}\n\n`;
      text += `**Times Used:** ${result.timesUsed}\n\n`;
      text += `## T-SQL (with parameters):\n\n`;
      text += `\`\`\`sql\n${result.tsql}\n\`\`\`\n\n`;
      text += `**Ready to execute with sql_server_execute_query!**`;

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } else {
      // Get query template without substitution
      const query = tsqlLib.getQuery(queryId);

      if (!query) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Query '${queryId}' not found.\n\nUse \`tsql_library_search\` to find queries.`,
            },
          ],
          isError: true,
        };
      }

      let text = `# Query Template: ${query.id}\n\n`;
      text += `**Category:** ${query.category}\n`;
      text += `**Purpose:** ${query.purpose}\n`;
      text += `**Description:** ${query.description}\n`;
      text += `**Times Used:** ${query.timesUsed}\n`;
      text += `**Tags:** ${query.tags.join(", ")}\n\n`;

      if (query.parameters.length > 0) {
        text += `## Parameters:\n\n`;
        query.parameters.forEach((p) => {
          text += `- **@${p.name}** (${p.type})${
            p.required ? " *required*" : ""
          }\n`;
          text += `  ${p.description}\n`;
          text += `  Example: ${p.example}\n\n`;
        });
      }

      text += `## T-SQL Template:\n\n`;
      text += `\`\`\`sql\n${query.tsql}\n\`\`\`\n\n`;

      text += `## Example Usage:\n${query.exampleUsage}\n\n`;
      text += `## Success Criteria:\n${query.successCriteria}\n\n`;

      text += `**Tested On:**\n`;
      text += `- Servers: ${query.testedOn.servers.join(", ")}\n`;
      text += `- Databases: ${query.testedOn.databases.join(", ")}\n`;
      text += `- Last Tested: ${query.testedOn.lastTested}\n`;

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    }
  }

  private async handleTsqlLibraryAdd(args: any) {
    const tsqlLib = this.ensureTsqlLibraryService();
    const {
      id,
      category,
      purpose,
      description,
      tsql,
      parameters,
      exampleUsage,
      successCriteria,
      testedOn,
      tags,
    } = args;

    const result = tsqlLib.addQuery(
      id,
      category,
      purpose,
      description,
      tsql,
      parameters || [],
      exampleUsage,
      successCriteria,
      testedOn,
      tags
    );

    if (!result.success) {
      return {
        content: [
          {
            type: "text",
            text: `❌ ${result.error}\n\n${
              result.suggestion ? `Suggestion: ${result.suggestion}\n\n` : ""
            }${
              result.validCategories
                ? `Valid categories: ${result.validCategories.join(", ")}`
                : ""
            }`,
          },
        ],
        isError: true,
      };
    }

    let text = `✅ Query added to library!\n\n`;
    text += `**ID:** ${result.queryId}\n`;
    text += `**Category:** ${result.category}\n`;
    text += `**Total Queries:** ${result.totalQueries}\n\n`;
    text += `This query is now reusable across all T-SQL operations.`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  private async handleTsqlLibraryListCategories() {
    const tsqlLib = this.ensureTsqlLibraryService();
    const result = tsqlLib.listCategories();

    let text = `# T-SQL Query Library Categories\n\n`;
    text += `**Total Queries:** ${result.total}\n\n`;

    result.categories.forEach((category: string) => {
      const count = result.counts[category];
      text += `- **${category}**: ${count} quer${count === 1 ? "y" : "ies"}\n`;
    });

    text += `\n**Tip:** Use \`tsql_library_search\` with a category filter to browse queries.`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  private async handleTsqlLibraryStats() {
    const tsqlLib = this.ensureTsqlLibraryService();
    const stats = tsqlLib.getStatistics();

    let text = `# T-SQL Query Library Statistics\n\n`;
    text += `**Total Queries:** ${stats.totalQueries}\n\n`;

    if (stats.mostUsed.length > 0) {
      text += `## Most Used Queries:\n\n`;
      stats.mostUsed.forEach((q: any, i: number) => {
        text += `${i + 1}. **${q.id}** (${q.category}) - ${q.timesUsed} uses\n`;
        text += `   ${q.purpose}\n\n`;
      });
    }

    if (stats.recentlyAdded.length > 0) {
      text += `## Recently Added:\n\n`;
      stats.recentlyAdded.slice(0, 5).forEach((q: any, i: number) => {
        text += `${i + 1}. **${q.id}** (${q.category}) - ${q.addedDate}\n`;
        text += `   ${q.purpose}\n\n`;
      });
    }

    text += `## By Category:\n\n`;
    stats.byCategory.forEach((cat: any) => {
      text += `- **${cat.category}**: ${cat.count} quer${
        cat.count === 1 ? "y" : "ies"
      }\n`;
    });

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  private async handleTsqlLibraryFindSimilar(args: any) {
    const tsqlLib = this.ensureTsqlLibraryService();
    const { tsql, purpose } = args;

    const similar = tsqlLib.findSimilarQueries(tsql, purpose);

    if (similar.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `✅ No similar queries found.\n\nThis appears to be a new pattern. If the query executes successfully, consider adding it to the library with \`tsql_library_add\`.`,
          },
        ],
      };
    }

    let text = `# Similar Queries Found\n\n`;
    text += `Found ${similar.length} similar quer${
      similar.length === 1 ? "y" : "ies"
    }:\n\n`;

    similar.forEach((query) => {
      text += `## ${query.id}\n`;
      text += `- **Category:** ${query.category}\n`;
      text += `- **Purpose:** ${query.purpose}\n`;
      text += `- **Times Used:** ${query.timesUsed}\n\n`;
      text += `**T-SQL:**\n\`\`\`sql\n${query.tsql.substring(0, 200)}${
        query.tsql.length > 200 ? "..." : ""
      }\n\`\`\`\n\n`;
    });

    text += `⚠️ **Recommendation:** Review these similar queries before adding a new one to prevent duplication.`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  // PostgreSQL handlers
  private ensurePostgreSQLService(): PostgreSQLService {
    if (!this.postgreSQLService) {
      throw new Error(
        "PostgreSQL service is not configured. Check postgresql-config.json"
      );
    }
    return this.postgreSQLService;
  }

  private async handlePostgreSQLListServers() {
    const pgsql = this.ensurePostgreSQLService();
    const servers = pgsql.getAvailableServers();

    let text = `# Available PostgreSQL Instances\n\n`;
    text += `Found ${servers.length} configured server${
      servers.length === 1 ? "" : "s"
    }:\n\n`;

    servers.forEach((server) => {
      text += `## ${server.name}\n`;
      text += `- **Host:** ${server.host}:${server.port}\n`;
      text += `- **Authentication:** ${server.authentication}\n`;
      text += `- **SSL:** ${server.ssl ? "Enabled" : "Disabled"}\n`;
      text += `- **Description:** ${server.description}\n`;
      if (server.security) {
        text += `- **Data Classification:** ${server.security.dataClassification}\n`;
        text += `- **Security Note:** ${server.security.note}\n`;
      }
      text += `\n`;
    });

    text += `\nUse \`postgresql_connect\` to connect to a server.`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  private async handlePostgreSQLConnect(args: any) {
    const pgsql = this.ensurePostgreSQLService();
    const { serverName } = args;

    const result = await pgsql.connectToServer(serverName);

    if (result.success) {
      let text = `✅ **Connected to PostgreSQL: ${result.serverName}**\n\n`;
      text += `- **Host:** ${result.host}:${result.port}\n`;
      text += `- **Version:** ${result.version}\n`;
      text += `- **Authentication:** ${result.authentication}\n\n`;
      text += `Next step: Use \`postgresql_list_databases\` to see available databases.`;

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `❌ Failed to connect to ${result.serverName}:\n${result.error}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handlePostgreSQLListDatabases(args: any) {
    const pgsql = this.ensurePostgreSQLService();
    const { serverName } = args;

    const result = await pgsql.getDatabases(serverName);

    if (result.success) {
      let text = `# Databases on ${result.serverName}\n\n`;
      text += `Found ${result.count} database${
        result.count === 1 ? "" : "s"
      }:\n\n`;

      result.databases.forEach((db: any) => {
        text += `## ${db.database_name}\n`;
        text += `- **Size:** ${db.size}\n`;
        text += `- **Collation:** ${db.collation}\n`;
        text += `- **Active Connections:** ${db.active_connections}`;
        if (db.connection_limit >= 0) {
          text += ` / ${db.connection_limit}`;
        }
        text += `\n\n`;
      });

      text += `Use \`postgresql_select_database\` to select a database for queries.`;

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error listing databases on ${result.serverName}:\n${result.error}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handlePostgreSQLSelectDatabase(args: any) {
    const pgsql = this.ensurePostgreSQLService();
    const { serverName, databaseName } = args;

    const result = await pgsql.selectDatabase(serverName, databaseName);

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `✅ ${result.message}\n\nYou can now execute queries with \`postgresql_execute_query\`.`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error selecting database:\n${result.error}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handlePostgreSQLGetConnectionString(args: any) {
    const pgsql = this.ensurePostgreSQLService();
    const { serverName, databaseName } = args;

    const connStr = pgsql.getConnectionString(serverName, databaseName);

    // Mask credentials
    const maskedConnStr = connStr.replace(/:([^@:]+)@/, ":****@");

    return {
      content: [
        {
          type: "text",
          text: `🔗 **Connection String** (credentials masked):\n\n\`\`\`\n${maskedConnStr}\n\`\`\``,
        },
      ],
    };
  }

  private async handlePostgreSQLExecuteQuery(args: any) {
    const pgsql = this.ensurePostgreSQLService();
    const { serverName, query, params } = args;

    const result = await pgsql.executeQuery(serverName, query, params);

    if (result.success) {
      let text = `✅ **Query executed successfully**\n\n`;
      text += `- **Server:** ${result.serverName}\n`;
      text += `- **Database:** ${result.database}\n`;
      text += `- **Command:** ${result.command}\n`;
      text += `- **Rows Affected:** ${result.rowCount}\n\n`;

      if (result.rows && result.rows.length > 0) {
        text += `**Results:**\n`;
        text += `\`\`\`json\n${JSON.stringify(result.rows, null, 2)}\n\`\`\``;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `❌ Query failed on ${result.serverName}/${result.database}:\n${result.error}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handlePostgreSQLExecuteProcedure(args: any) {
    const pgsql = this.ensurePostgreSQLService();
    const { serverName, procedureName, params } = args;

    const result = await pgsql.executeProcedure(
      serverName,
      procedureName,
      params
    );

    if (result.success) {
      let text = `✅ **Procedure executed successfully**\n\n`;
      text += `- **Server:** ${result.serverName}\n`;
      text += `- **Database:** ${result.database}\n`;
      text += `- **Procedure:** ${result.procedure}\n`;
      text += `- **Rows Returned:** ${result.rowCount}\n\n`;

      if (result.rows && result.rows.length > 0) {
        text += `**Results:**\n`;
        text += `\`\`\`json\n${JSON.stringify(result.rows, null, 2)}\n\`\`\``;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `❌ Procedure failed on ${result.serverName}/${result.database}:\n${result.error}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handlePostgreSQLGetStatus() {
    const pgsql = this.ensurePostgreSQLService();
    const status = pgsql.getStatus();

    let text = `# PostgreSQL Service Status\n\n`;
    text += `- **Status:** ${status.status}\n`;
    text += `- **Mode:** ${status.mode}\n`;
    text += `- **Azure Key Vault:** ${
      status.azureKeyVaultEnabled ? "Enabled" : "Disabled"
    }\n\n`;

    text += `## Configured Servers\n\n`;
    status.configuredServers.forEach((server: string) => {
      text += `- ${server}\n`;
    });

    text += `\n## Connection Status\n\n`;
    text += `- **Total Servers:** ${status.connectionStatus.totalServers}\n`;
    text += `- **Connected:** ${status.connectionStatus.connectedServers}\n\n`;

    if (Object.keys(status.connectionStatus.servers).length > 0) {
      text += `### Active Connections\n\n`;
      for (const [name, conn] of Object.entries(
        status.connectionStatus.servers
      )) {
        const c = conn as any;
        text += `- **${name}:** ${
          c.connected ? "✅ Connected" : "❌ Disconnected"
        }`;
        if (c.selectedDatabase) {
          text += ` (DB: ${c.selectedDatabase})`;
        }
        text += `\n`;
      }
    }

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  // PgSQL Query Library handlers
  private ensurePgSqlLibraryService(): PgSqlLibraryService {
    if (!this.pgsqlLibraryService) {
      throw new Error(
        "PgSQL Query Library service is not configured. Check pgsql-query-library.json"
      );
    }
    return this.pgsqlLibraryService;
  }

  private async handlePgSqlLibrarySearch(args: any) {
    const pgsqlLib = this.ensurePgSqlLibraryService();
    const { searchTerm, category, tags } = args;

    const results = pgsqlLib.searchQueries(searchTerm, category, tags);

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `❌ No queries found matching your search.\n\n**Search Term:** ${
              searchTerm || "none"
            }\n**Category:** ${category || "any"}\n**Tags:** ${
              tags ? tags.join(", ") : "none"
            }`,
          },
        ],
      };
    }

    let text = `# PostgreSQL Query Library Search Results\n\n`;
    text += `Found ${results.length} quer${
      results.length === 1 ? "y" : "ies"
    }:\n\n`;

    results.forEach((query) => {
      text += `## ${query.id}\n`;
      text += `- **Category:** ${query.category}\n`;
      text += `- **Purpose:** ${query.purpose}\n`;
      text += `- **Times Used:** ${query.timesUsed}\n`;
      text += `- **Tags:** ${query.tags.join(", ")}\n`;
      if (query.postgresqlFeatures && query.postgresqlFeatures.length > 0) {
        text += `- **PostgreSQL Features:** ${query.postgresqlFeatures.join(
          ", "
        )}\n`;
      }
      text += `\n**SQL:**\n\`\`\`sql\n${query.sql.substring(0, 200)}${
        query.sql.length > 200 ? "..." : ""
      }\n\`\`\`\n\n`;
    });

    text += `Use \`pgsql_library_get\` with a query ID to get the full query with parameter substitution.`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  private async handlePgSqlLibraryGet(args: any) {
    const pgsqlLib = this.ensurePgSqlLibraryService();
    const { queryId, paramValues } = args;

    const query = pgsqlLib.getQuery(queryId);

    if (!query) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Query not found: ${queryId}`,
          },
        ],
        isError: true,
      };
    }

    let text = `# ${query.id}\n\n`;
    text += `**Category:** ${query.category}\n`;
    text += `**Purpose:** ${query.purpose}\n\n`;
    text += `**Description:** ${query.description}\n\n`;

    // Parameters
    if (query.parameters && query.parameters.length > 0) {
      text += `## Parameters\n\n`;
      query.parameters.forEach((param) => {
        text += `- **${param.name}** (${param.type}${
          param.required ? ", required" : ""
        }): ${param.description}\n`;
        text += `  - Example: \`${param.example}\`\n`;
      });
      text += `\n`;
    }

    // SQL
    text += `## SQL\n\n\`\`\`sql\n${query.sql}\n\`\`\`\n\n`;

    // If param values provided, show substituted version
    if (paramValues) {
      const substituted = pgsqlLib.replaceParameters(queryId, paramValues);
      if (substituted) {
        text += `## With Your Parameters\n\n\`\`\`sql\n${substituted.sql}\n\`\`\`\n\n`;
      }
    }

    text += `**Example Usage:** ${query.exampleUsage}\n\n`;
    text += `**Success Criteria:** ${query.successCriteria}\n\n`;
    text += `**Tested On:**\n`;
    text += `- Servers: ${query.testedOn.servers.join(", ")}\n`;
    text += `- Databases: ${query.testedOn.databases.join(", ")}\n`;
    text += `- Last Tested: ${query.testedOn.lastTested}\n\n`;
    text += `**Tags:** ${query.tags.join(", ")}\n`;
    text += `**Times Used:** ${query.timesUsed}\n`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  private async handlePgSqlLibraryAdd(args: any) {
    const pgsqlLib = this.ensurePgSqlLibraryService();

    const result = pgsqlLib.addQuery({
      category: args.category,
      purpose: args.purpose,
      description: args.description,
      sql: args.sql,
      parameters: args.parameters || [],
      exampleUsage: args.exampleUsage || "",
      successCriteria: args.successCriteria,
      testedOn: args.testedOn,
      tags: args.tags,
      postgresqlFeatures: args.postgresqlFeatures || [],
    });

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `✅ **Query added to PgSQL library!**\n\n${result.message}\n\nQuery ID: \`${result.queryId}\`\n\nUse \`pgsql_library_get\` to retrieve it later.`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `❌ Failed to add query:\n${result.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handlePgSqlLibraryListCategories() {
    const pgsqlLib = this.ensurePgSqlLibraryService();
    const { categories, queryCounts } = pgsqlLib.listCategories();

    let text = `# PgSQL Query Library Categories\n\n`;

    const categoriesWithCounts = categories.map((cat) => ({
      category: cat,
      count: queryCounts[cat] || 0,
    }));

    categoriesWithCounts.forEach((cat) => {
      text += `- **${cat.category}**: ${cat.count} quer${
        cat.count === 1 ? "y" : "ies"
      }\n`;
    });

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  private async handlePgSqlLibraryStats() {
    const pgsqlLib = this.ensurePgSqlLibraryService();
    const stats = pgsqlLib.getStatistics();

    let text = `# PgSQL Query Library Statistics\n\n`;
    text += `- **Total Queries:** ${stats.totalQueries}\n`;
    text += `- **Total Usage:** ${stats.totalUsage}\n`;
    text += `- **Last Updated:** ${stats.lastUpdated || "Never"}\n\n`;

    text += `## Categories\n\n`;
    stats.categories.categories.forEach((cat: string) => {
      const count = stats.categories.queryCounts[cat] || 0;
      text += `- **${cat}**: ${count} quer${count === 1 ? "y" : "ies"}\n`;
    });

    if (stats.mostUsedQueries.length > 0) {
      text += `\n## Most Used Queries\n\n`;
      stats.mostUsedQueries.forEach((q: any, i: number) => {
        text += `${i + 1}. **${q.id}** (${q.category}) - ${q.timesUsed} uses\n`;
        text += `   - ${q.purpose}\n`;
      });
    }

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  private async handlePgSqlLibraryFindSimilar(args: any) {
    const pgsqlLib = this.ensurePgSqlLibraryService();
    const { sql, purpose } = args;

    const similar = pgsqlLib.findSimilarQueries(sql);

    if (similar.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `✅ No similar queries found.\n\nThis appears to be a new pattern. If the query executes successfully, consider adding it to the library with \`pgsql_library_add\`.`,
          },
        ],
      };
    }

    let text = `# Similar Queries Found\n\n`;
    text += `Found ${similar.length} similar quer${
      similar.length === 1 ? "y" : "ies"
    }:\n\n`;

    similar.forEach((query) => {
      text += `## ${query.id}\n`;
      text += `- **Category:** ${query.category}\n`;
      text += `- **Purpose:** ${query.purpose}\n`;
      text += `- **Times Used:** ${query.timesUsed}\n\n`;
      text += `**SQL:**\n\`\`\`sql\n${query.sql.substring(0, 200)}${
        query.sql.length > 200 ? "..." : ""
      }\n\`\`\`\n\n`;
    });

    text += `⚠️ **Recommendation:** Review these similar queries before adding a new one to prevent duplication.`;

    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  }

  // ==========================================
  // System Management Handlers
  // ==========================================

  private async handleCheckNodeVersion(args: any) {
    try {
      const result = await this.systemService.checkNodeVersion(
        args.required_version
      );

      let text = `## Node.js Version Check\n\n`;
      text += `- **Installed:** v${result.installed}\n`;
      if (result.required) {
        text += `- **Required:** v${result.required}\n`;
        text += `- **Satisfies:** ${result.satisfies ? "✅ Yes" : "❌ No"}\n`;
      }
      if (result.location) {
        text += `- **Location:** \`${result.location}\`\n`;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error checking Node version: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleCheckPythonVersion(args: any) {
    try {
      const result = await this.systemService.checkPythonVersion(
        args.required_version
      );

      let text = `## Python Version Check\n\n`;
      text += `- **Installed:** ${result.installed}\n`;
      if (result.required) {
        text += `- **Required:** ${result.required}\n`;
        text += `- **Satisfies:** ${result.satisfies ? "✅ Yes" : "❌ No"}\n`;
      }
      if (result.location) {
        text += `- **Location:** \`${result.location}\`\n`;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error checking Python version: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleCheckNpmVersion(args: any) {
    try {
      const result = await this.systemService.checkNpmVersion(
        args.required_version
      );

      let text = `## npm Version Check\n\n`;
      text += `- **Installed:** ${result.installed}\n`;
      if (result.required) {
        text += `- **Required:** ${result.required}\n`;
        text += `- **Satisfies:** ${result.satisfies ? "✅ Yes" : "❌ No"}\n`;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error checking npm version: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleCheckPipVersion(args: any) {
    try {
      const result = await this.systemService.checkPipVersion(
        args.required_version
      );

      let text = `## pip Version Check\n\n`;
      text += `- **Installed:** ${result.installed}\n`;
      if (result.required) {
        text += `- **Required:** ${result.required}\n`;
        text += `- **Satisfies:** ${result.satisfies ? "✅ Yes" : "❌ No"}\n`;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error checking pip version: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleCheckNpmPackage(args: any) {
    try {
      const result = await this.systemService.checkNpmPackage(
        args.package_name,
        args.directory
      );

      let text = `## npm Package Check: ${args.package_name}\n\n`;

      if (result.installed) {
        text += `✅ **Status:** Installed\n`;
        text += `- **Version:** ${result.version}\n`;
        if (result.location) {
          text += `- **Location:** \`${result.location}\`\n`;
        }
      } else {
        text += `❌ **Status:** Not installed\n`;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error checking npm package: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleCheckPythonPackage(args: any) {
    try {
      const result = await this.systemService.checkPythonPackage(
        args.package_name
      );

      let text = `## Python Package Check: ${args.package_name}\n\n`;

      if (result.installed) {
        text += `✅ **Status:** Installed\n`;
        text += `- **Version:** ${result.version}\n`;
        if (result.location) {
          text += `- **Location:** \`${result.location}\`\n`;
        }
      } else {
        text += `❌ **Status:** Not installed\n`;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error checking Python package: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleInstallNpmPackage(args: any) {
    // SECURITY CHECKPOINT: Request approval
    const approvalResponse = this.securityService.requestApproval(
      "install_npm_package",
      args
    );

    return {
      content: [
        {
          type: "text",
          text: approvalResponse,
        },
      ],
    };
  }

  private async handleInstallPythonPackage(args: any) {
    // SECURITY CHECKPOINT: Request approval
    const approvalResponse = this.securityService.requestApproval(
      "install_python_package",
      args
    );

    return {
      content: [
        {
          type: "text",
          text: approvalResponse,
        },
      ],
    };
  }

  private async handleUpdateNpmDependencies(args: any) {
    // SECURITY CHECKPOINT: Request approval
    const approvalResponse = this.securityService.requestApproval(
      "update_npm_dependencies",
      args
    );

    return {
      content: [
        {
          type: "text",
          text: approvalResponse,
        },
      ],
    };
  }

  private async handleUpdatePythonDependencies(args: any) {
    // SECURITY CHECKPOINT: Request approval
    const approvalResponse = this.securityService.requestApproval(
      "update_python_dependencies",
      args
    );

    return {
      content: [
        {
          type: "text",
          text: approvalResponse,
        },
      ],
    };
  }

  private async handleRunSystemCommand(args: any) {
    // SECURITY CHECKPOINT: Request approval
    const approvalResponse = this.securityService.requestApproval(
      "run_system_command",
      args
    );

    return {
      content: [
        {
          type: "text",
          text: approvalResponse,
        },
      ],
    };
  }

  private async handleGetSystemInfo(args: any) {
    try {
      const info = await this.systemService.getSystemInfo();

      let text = `## System Information\n\n`;
      text += `### Platform\n`;
      text += `- **OS:** ${info.platform} (${info.arch})\n`;
      text += `- **Type:** ${info.os.type}\n`;
      text += `- **Release:** ${info.os.release}\n`;
      text += `- **Total Memory:** ${info.os.totalMemory}\n`;
      text += `- **Free Memory:** ${info.os.freeMemory}\n\n`;

      text += `### Versions\n`;
      text += `- **Node.js:** ${info.nodeVersion}\n`;
      text += `- **npm:** ${info.npmVersion}\n`;

      if (info.pythonVersion) {
        text += `- **Python:** ${info.pythonVersion}\n`;
      }

      if (info.pipVersion) {
        text += `- **pip:** ${info.pipVersion}\n`;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error getting system info: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleValidateSecuritySequence(args: any) {
    try {
      const validation = this.securityService.validateSequence(
        args.operation_id,
        args.sequence
      );

      if (!validation.valid) {
        return {
          content: [
            {
              type: "text",
              text: `❌ ${validation.reason}`,
            },
          ],
          isError: true,
        };
      }

      // Sequence validated! Execute the operation
      const operation = validation.operation!;
      let result: any;

      let text = `✅ SECURITY SEQUENCE VALIDATED\n\n`;
      text += `Executing: ${operation.operation}...\n\n`;
      text += `═══════════════════════════════════════════════\n\n`;

      switch (operation.operation) {
        case "install_npm_package":
          result = await this.systemService.installNpmPackage(operation.args);
          break;

        case "install_python_package":
          result = await this.systemService.installPythonPackage(
            operation.args
          );
          break;

        case "update_npm_dependencies":
          result = await this.systemService.updateNpmDependencies(
            operation.args.directory
          );
          break;

        case "update_python_dependencies":
          result = await this.systemService.updatePythonDependencies();
          break;

        case "run_system_command":
          result = await this.systemService.runSystemCommand(operation.args);
          break;

        case "install_flutter":
          result = await this.flutterService.installFlutter();
          break;

        default:
          throw new Error(`Unknown operation: ${operation.operation}`);
      }

      // Complete the operation
      this.securityService.completeOperation(args.operation_id);

      // Format result
      if (result.success) {
        text += `## ✅ Operation Completed Successfully\n\n`;
        text += `\`\`\`\n${result.output}\n\`\`\`\n`;
      } else {
        text += `## ❌ Operation Failed\n\n`;
        text += `**Error:** ${result.error}\n\n`;
        if (result.output) {
          text += `**Output:**\n\`\`\`\n${result.output}\n\`\`\`\n`;
        }
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
        isError: !result.success,
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error validating security sequence: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleGetSecurityStatus(args: any) {
    try {
      const status = this.securityService.getOperationStatus(args.operation_id);

      let text = `## Security Operation Status\n\n`;

      if (status.status === "not_found") {
        text += `❌ **Status:** ${status.message}\n`;
      } else {
        text += `- **Status:** ${status.status}\n`;
        text += `- **Operation:** ${status.operation}\n`;
        text += `- **Age:** ${status.age} seconds\n`;
        text += `- **Expires In:** ${status.expiresIn} seconds\n`;
        text += `- **Validated:** ${status.validated ? "Yes" : "No"}\n`;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error getting security status: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  // ==========================================
  // Flutter Management Handlers
  // ==========================================

  /**
   * Handle check_flutter_status
   */
  private async handleCheckFlutterStatus(): Promise<any> {
    try {
      const status = await this.flutterService.checkFlutterStatus();

      let text = `## Flutter SDK Status\n\n`;

      if (status.installed) {
        text += `✅ **Flutter is installed**\n\n`;
        if (status.version) {
          text += `- **Version:** ${status.version}\n`;
        }
        if (status.location) {
          text += `- **Location:** \`${status.location}\`\n`;
        }
        text += `- **In PATH:** ${status.inPath ? "✅ Yes" : "❌ No"}\n\n`;

        if (!status.inPath) {
          text += `⚠️  **Warning:** Flutter is installed but not in PATH.\n`;
          text += `You may need to restart your terminal/IDE or manually add Flutter to PATH.\n\n`;
          text += `**Flutter Location:** \`${status.location}\\bin\`\n`;
        }
      } else {
        text += `❌ **Flutter is NOT installed**\n\n`;
        text += `To install Flutter, use the \`install_flutter\` tool.\n`;
        text += `This will download and install Flutter SDK 3.24.0 to \`C:\\src\\flutter\`.\n`;
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error checking Flutter status: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Handle install_flutter
   */
  private async handleInstallFlutter(): Promise<any> {
    // SECURITY CHECKPOINT: Request approval
    const approvalResponse = this.securityService.requestApproval(
      "install_flutter",
      {}
    );

    return {
      content: [
        {
          type: "text",
          text: approvalResponse,
        },
      ],
    };
  }

  /**
   * Handle run_flutter_doctor
   */
  private async handleRunFlutterDoctor(): Promise<any> {
    try {
      const result = await this.flutterService.runFlutterDoctor();

      let text = `## Flutter Doctor\n\n`;

      if (result.success) {
        text += `\`\`\`\n${result.output}\n\`\`\`\n\n`;

        if (result.issues && result.issues.length > 0) {
          text += `### ❌ Issues Found:\n\n`;
          for (const issue of result.issues) {
            text += `- ${issue}\n`;
          }
          text += `\n`;
        }

        if (result.warnings && result.warnings.length > 0) {
          text += `### ⚠️  Warnings:\n\n`;
          for (const warning of result.warnings) {
            text += `- ${warning}\n`;
          }
          text += `\n`;
        }

        if (
          (!result.issues || result.issues.length === 0) &&
          (!result.warnings || result.warnings.length === 0)
        ) {
          text += `✅ **Flutter is fully configured and ready to use!**\n`;
        }
      } else {
        text += `❌ ${result.output}\n\n`;
        if (result.issues) {
          for (const issue of result.issues) {
            text += `- ${issue}\n`;
          }
        }
      }

      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
        isError: !result.success,
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error running flutter doctor: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  /**
   * Handle generate_flutter_ui_mockup
   */
  private async handleGenerateFlutterUIMockup(args: any): Promise<any> {
    try {
      const result = await this.flutterService.generateFlutterMockup({
        name: args.name,
        description: args.description,
        designSystem: args.design_system,
        layout: args.layout,
        includeState: args.include_state,
        includeComments: args.include_comments,
      });

      if (result.success) {
        let text = `## Flutter UI Mockup Generated\n\n`;
        text += `**Widget:** ${args.name}\n`;
        text += `**Description:** ${args.description}\n\n`;
        text += `\`\`\`dart\n${result.code}\n\`\`\`\n\n`;
        text += `### Next Steps:\n\n`;
        text += `1. Copy the code above\n`;
        text += `2. Create a new file: \`lib/${args.name.toLowerCase()}.dart\`\n`;
        text += `3. Paste the code into the file\n`;
        text += `4. Import in your app: \`import 'package:yourapp/${args.name.toLowerCase()}.dart';\`\n`;
        text += `5. Use the widget: \`${args.name}()\`\n`;

        return {
          content: [
            {
              type: "text",
              text,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `❌ ${result.error}`,
            },
          ],
          isError: true,
        };
      }
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error generating Flutter mockup: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  // ============================================================================
  // VOICE FEEDBACK HANDLER METHODS
  // ============================================================================

  private async handleSpeakFeedback(args: any): Promise<any> {
    try {
      const { text, priority = "normal", interrupt = false } = args;
      const result = await this.voiceFeedbackService.speak({
        text,
        priority: priority as "normal" | "urgent" | "low",
        interrupt,
      });

      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: `✅ Voice feedback spoken: "${text}"`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `⚠️ Voice feedback: ${result.error || "Failed to speak"}`,
            },
          ],
          isError: false, // Not a critical error, just a warning
        };
      }
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error speaking feedback: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleStopVoiceFeedback(): Promise<any> {
    try {
      this.voiceFeedbackService.stop();
      return {
        content: [
          {
            type: "text",
            text: `✅ Voice feedback stopped`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error stopping voice feedback: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  private async handleTestVoiceFeedback(): Promise<any> {
    try {
      const result = await this.voiceFeedbackService.test();

      if (result.success) {
        return {
          content: [
            {
              type: "text",
              text: `✅ Voice feedback test successful! You should have heard: "Voice feedback is working!"`,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `⚠️ Voice feedback test failed: ${result.error || "Unknown error"}\n\n**Platform Support:**\n- Windows: Uses PowerShell SAPI (built-in)\n- macOS: Uses 'say' command (built-in)\n- Linux: Requires 'espeak' or 'spd-say' package`,
            },
          ],
          isError: false,
        };
      }
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error testing voice feedback: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  // ==========================================
  // Service Start
  // ==========================================

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log("🚀 Cursor Capabilities Service running via MCP");
    console.log("📡 Connected to Cursor AI");
  }
}

// Start the service
const service = new CursorCapabilitiesService();
service.start().catch((error) => {
  console.error("❌ Failed to start service:", error);
  process.exit(1);
});
