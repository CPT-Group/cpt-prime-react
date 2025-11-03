import * as fs from "fs";
import * as path from "path";
import { Pool, QueryResult } from "pg";
import { fileURLToPath } from "url";

/**
 * PostgreSQL Service
 *
 * Provides PostgreSQL connectivity for the Cursor MCP service.
 * Supports multiple PostgreSQL instances with dynamic database selection.
 *
 * Features:
 * - Multiple server management (localhost, Azure PostgreSQL, etc.)
 * - Dynamic database discovery and selection
 * - Connection pooling for performance
 * - SQL query execution with parameterization
 * - SSL/TLS support for secure connections
 * - Azure Key Vault integration (future)
 */

interface PostgreSQLConfig {
  servers: {
    [key: string]: {
      host: string;
      port: number;
      description: string;
      authentication: "password";
      ssl: boolean;
      sslMode?: string;
      databases?: any;
      security?: any;
      connectionString: string;
      migrateToKeyVault?: any;
    };
  };
  defaultServer: string;
  queryDefaults: {
    timeout: number;
    maxRows: number;
    enableResultStreaming: boolean;
  };
  connectionPool: {
    min: number;
    max: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
  };
  azureKeyVault?: {
    enabled: boolean;
    keyVaultUri?: string;
    secrets?: { [key: string]: string };
  };
}

interface ServerConnection {
  pool: Pool | null;
  config: any;
  connected: boolean;
  selectedDatabase: string | null;
  currentConnectionString: string;
}

export class PostgreSQLService {
  private config: PostgreSQLConfig;
  private connections: Map<string, ServerConnection> = new Map();
  private configPath: string;

  constructor() {
    // Load configuration
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.configPath = path.join(__dirname, "../../postgresql-config.json");

    if (!fs.existsSync(this.configPath)) {
      console.warn("⚠️  PostgreSQL config not found:", this.configPath);
      throw new Error("PostgreSQL configuration file not found");
    }

    this.config = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
    console.log(
      `✅ PostgreSQL Service initialized with ${
        Object.keys(this.config.servers).length
      } server(s)`
    );
  }

  /**
   * Get list of available PostgreSQL instances
   */
  getAvailableServers(): any[] {
    return Object.entries(this.config.servers).map(([name, config]) => ({
      name,
      host: config.host,
      port: config.port,
      description: config.description,
      authentication: config.authentication,
      ssl: config.ssl,
      security: config.security,
    }));
  }

  /**
   * Connect to a PostgreSQL instance
   */
  async connectToServer(serverName: string): Promise<any> {
    const serverConfig = this.config.servers[serverName];
    if (!serverConfig) {
      throw new Error(`Server '${serverName}' not found in configuration`);
    }

    // Check if already connected
    if (
      this.connections.has(serverName) &&
      this.connections.get(serverName)?.connected
    ) {
      return {
        success: true,
        message: `Already connected to ${serverName}`,
        serverName,
      };
    }

    try {
      // Parse connection string to get connection config
      const connStr = serverConfig.connectionString;
      const pool = new Pool({
        connectionString: connStr,
        min: this.config.connectionPool.min,
        max: this.config.connectionPool.max,
        idleTimeoutMillis: this.config.connectionPool.idleTimeoutMillis,
        connectionTimeoutMillis:
          this.config.connectionPool.connectionTimeoutMillis,
        ssl: serverConfig.ssl
          ? {
              rejectUnauthorized: false, // For development; use proper certs in production
            }
          : false,
      });

      // Test connection
      const client = await pool.connect();
      const result = await client.query("SELECT version()");
      client.release();

      this.connections.set(serverName, {
        pool,
        config: serverConfig,
        connected: true,
        selectedDatabase: null,
        currentConnectionString: connStr,
      });

      console.log(`✅ Connected to PostgreSQL: ${serverName}`);

      return {
        success: true,
        message: `Connected to ${serverName}`,
        serverName,
        host: serverConfig.host,
        port: serverConfig.port,
        version: result.rows[0].version,
        authentication: serverConfig.authentication,
      };
    } catch (error: any) {
      console.error(`❌ Failed to connect to ${serverName}:`, error.message);
      return {
        success: false,
        error: error.message,
        serverName,
      };
    }
  }

  /**
   * Get list of databases on a connected server
   */
  async getDatabases(serverName: string): Promise<any> {
    const connection = this.connections.get(serverName);
    if (!connection || !connection.connected || !connection.pool) {
      throw new Error(
        `Not connected to server '${serverName}'. Connect first.`
      );
    }

    try {
      const result = await connection.pool.query(`
        SELECT 
          datname AS database_name,
          pg_size_pretty(pg_database_size(datname)) AS size,
          datcollate AS collation,
          datconnlimit AS connection_limit,
          (SELECT count(*) FROM pg_stat_activity WHERE datname = d.datname) AS active_connections
        FROM pg_database d
        WHERE datistemplate = false
        ORDER BY datname
      `);

      return {
        success: true,
        serverName,
        databases: result.rows,
        count: result.rows.length,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        serverName,
      };
    }
  }

  /**
   * Select a database to use for queries
   */
  async selectDatabase(serverName: string, databaseName: string): Promise<any> {
    const connection = this.connections.get(serverName);
    if (!connection || !connection.connected || !connection.pool) {
      throw new Error(
        `Not connected to server '${serverName}'. Connect first.`
      );
    }

    try {
      // Close existing pool
      await connection.pool.end();

      // Create new connection string with selected database
      const serverConfig = connection.config;
      const oldConnStr = connection.currentConnectionString;

      // Replace database name in connection string
      const newConnStr = oldConnStr.replace(
        /\/([^/?]+)(\?|$)/,
        `/${databaseName}$2`
      );

      // Create new pool with selected database
      const pool = new Pool({
        connectionString: newConnStr,
        min: this.config.connectionPool.min,
        max: this.config.connectionPool.max,
        idleTimeoutMillis: this.config.connectionPool.idleTimeoutMillis,
        connectionTimeoutMillis:
          this.config.connectionPool.connectionTimeoutMillis,
        ssl: serverConfig.ssl
          ? {
              rejectUnauthorized: false,
            }
          : false,
      });

      // Test connection to new database
      const client = await pool.connect();
      await client.query("SELECT current_database()");
      client.release();

      connection.pool = pool;
      connection.selectedDatabase = databaseName;
      connection.currentConnectionString = newConnStr;

      return {
        success: true,
        serverName,
        database: databaseName,
        message: `Database '${databaseName}' selected on ${serverName}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        serverName,
        database: databaseName,
      };
    }
  }

  /**
   * Get connection string for a server and database
   */
  getConnectionString(serverName: string, databaseName?: string): string {
    const serverConfig = this.config.servers[serverName];
    if (!serverConfig) {
      throw new Error(`Server '${serverName}' not found in configuration`);
    }

    let connStr = serverConfig.connectionString;

    if (databaseName) {
      // Replace database name in connection string
      connStr = connStr.replace(/\/([^/?]+)(\?|$)/, `/${databaseName}$2`);
    }

    return connStr;
  }

  /**
   * Execute a SQL query
   */
  async executeQuery(
    serverName: string,
    query: string,
    params?: any[]
  ): Promise<any> {
    const connection = this.connections.get(serverName);
    if (!connection || !connection.connected || !connection.pool) {
      throw new Error(
        `Not connected to server '${serverName}'. Connect first.`
      );
    }

    if (!connection.selectedDatabase) {
      throw new Error(
        `No database selected on '${serverName}'. Select a database first.`
      );
    }

    try {
      const result: QueryResult = await connection.pool.query(query, params);

      return {
        success: true,
        serverName,
        database: connection.selectedDatabase,
        rowCount: result.rowCount,
        rows: result.rows,
        command: result.command,
        fields: result.fields?.map((f) => ({
          name: f.name,
          dataType: f.dataTypeID,
        })),
      };
    } catch (error: any) {
      console.error(`❌ Query error on ${serverName}:`, error.message);
      return {
        success: false,
        error: error.message,
        serverName,
        database: connection.selectedDatabase,
        query: query.substring(0, 200) + "...",
      };
    }
  }

  /**
   * Execute a stored procedure/function
   */
  async executeProcedure(
    serverName: string,
    procedureName: string,
    params?: any[]
  ): Promise<any> {
    const connection = this.connections.get(serverName);
    if (!connection || !connection.connected || !connection.pool) {
      throw new Error(
        `Not connected to server '${serverName}'. Connect first.`
      );
    }

    if (!connection.selectedDatabase) {
      throw new Error(
        `No database selected on '${serverName}'. Select a database first.`
      );
    }

    try {
      // PostgreSQL uses SELECT for functions
      const paramPlaceholders = params
        ? params.map((_, i) => `$${i + 1}`).join(", ")
        : "";
      const query = `SELECT * FROM ${procedureName}(${paramPlaceholders})`;

      const result: QueryResult = await connection.pool.query(query, params);

      return {
        success: true,
        serverName,
        database: connection.selectedDatabase,
        procedure: procedureName,
        rowCount: result.rowCount,
        rows: result.rows,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        serverName,
        database: connection.selectedDatabase,
        procedure: procedureName,
      };
    }
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): any {
    const status: any = {
      servers: {},
      totalServers: Object.keys(this.config.servers).length,
      connectedServers: 0,
    };

    for (const [name, conn] of this.connections.entries()) {
      status.servers[name] = {
        connected: conn.connected,
        selectedDatabase: conn.selectedDatabase,
      };
      if (conn.connected) {
        status.connectedServers++;
      }
    }

    return status;
  }

  /**
   * Disconnect from a server
   */
  async disconnect(serverName: string): Promise<void> {
    const connection = this.connections.get(serverName);
    if (connection && connection.pool) {
      await connection.pool.end();
      this.connections.delete(serverName);
      console.log(`✅ Disconnected from ${serverName}`);
    }
  }

  /**
   * Disconnect from all servers
   */
  async disconnectAll(): Promise<void> {
    for (const [name, conn] of this.connections.entries()) {
      if (conn.pool) {
        await conn.pool.end();
      }
    }
    this.connections.clear();
    console.log("✅ Disconnected from all PostgreSQL servers");
  }

  /**
   * Get service status
   */
  getStatus(): any {
    return {
      status: "operational",
      mode: "postgresql",
      configuredServers: Object.keys(this.config.servers),
      connectionStatus: this.getConnectionStatus(),
      azureKeyVaultEnabled: this.config.azureKeyVault?.enabled || false,
    };
  }
}
