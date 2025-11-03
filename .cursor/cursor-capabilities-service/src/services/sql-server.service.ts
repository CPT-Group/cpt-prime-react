import * as fs from "fs";
import sql from "mssql";
import * as path from "path";
import { fileURLToPath } from "url";

/**
 * SQL Server Service
 *
 * Provides MS SQL Server connectivity for the Cursor MCP service.
 * Supports multiple SQL Server instances with dynamic database selection.
 *
 * Features:
 * - Multiple server management (CPT2K16, CPTWEB2018, etc.)
 * - Dynamic database discovery and selection
 * - Connection pooling for performance
 * - T-SQL query execution with parameterization
 * - Windows Authentication support
 * - Azure Key Vault integration (future)
 */

interface SqlServerConfig {
  servers: {
    [key: string]: {
      server: string;
      description: string;
      port: number;
      authentication: "windows" | "sql";
      username?: string;
      password?: string;
      options: any;
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
  };
  azureKeyVault?: {
    enabled: boolean;
    keyVaultUri?: string;
    secrets?: { [key: string]: string };
  };
}

interface ServerConnection {
  pool: sql.ConnectionPool | null;
  config: any;
  connected: boolean;
  selectedDatabase: string | null;
}

export class SqlServerService {
  private config: SqlServerConfig;
  private connections: Map<string, ServerConnection> = new Map();
  private configPath: string;

  constructor() {
    // Load configuration
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.configPath = path.join(__dirname, "../../sql-server-config.json");

    if (!fs.existsSync(this.configPath)) {
      console.warn("⚠️  SQL Server config not found:", this.configPath);
      throw new Error("SQL Server configuration file not found");
    }

    this.config = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));
    console.log(
      `✅ SQL Server Service initialized with ${
        Object.keys(this.config.servers).length
      } server(s)`
    );
  }

  /**
   * Get list of available SQL Server instances
   */
  getAvailableServers(): any[] {
    return Object.entries(this.config.servers).map(([name, config]) => ({
      name,
      server: config.server,
      description: config.description,
      authentication: config.authentication,
      security: config.security,
    }));
  }

  /**
   * Connect to a SQL Server instance
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
      // Build connection config
      const config: sql.config = {
        server: serverConfig.server,
        port: serverConfig.port,
        options: {
          ...serverConfig.options,
        },
        requestTimeout: this.config.queryDefaults.timeout,
        pool: {
          min: this.config.connectionPool.min,
          max: this.config.connectionPool.max,
          idleTimeoutMillis: this.config.connectionPool.idleTimeoutMillis,
        },
      };

      // Add authentication
      if (serverConfig.authentication === "windows") {
        config.authentication = {
          type: "ntlm",
          options: {
            domain: "",
            userName: "",
            password: "",
          },
        };
      } else if (serverConfig.authentication === "sql") {
        config.user = serverConfig.username;
        config.password = serverConfig.password;
      }

      const pool = new sql.ConnectionPool(config);
      await pool.connect();

      this.connections.set(serverName, {
        pool,
        config,
        connected: true,
        selectedDatabase: null,
      });

      console.log(`✅ Connected to SQL Server: ${serverName}`);

      return {
        success: true,
        message: `Connected to ${serverName}`,
        serverName,
        server: serverConfig.server,
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
      const result = await connection.pool.request().query(`
        SELECT 
          name AS database_name,
          database_id,
          create_date,
          state_desc AS status,
          recovery_model_desc AS recovery_model,
          (SELECT SUM(size) * 8 / 1024 FROM sys.master_files WHERE database_id = d.database_id) AS size_mb
        FROM sys.databases d
        WHERE database_id > 4  -- Exclude system databases
        ORDER BY name
      `);

      return {
        success: true,
        serverName,
        databases: result.recordset,
        count: result.recordset.length,
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
      // Test database access by running a simple query
      await connection.pool
        .request()
        .query(`USE [${databaseName}]; SELECT DB_NAME() AS current_db`);

      connection.selectedDatabase = databaseName;

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
      connStr += `Database=${databaseName};`;
    }

    return connStr;
  }

  /**
   * Execute a T-SQL query
   */
  async executeQuery(
    serverName: string,
    query: string,
    params?: { [key: string]: any }
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
      const request = connection.pool.request();

      // Add parameters if provided
      if (params) {
        for (const [name, value] of Object.entries(params)) {
          request.input(name, value);
        }
      }

      // Add USE statement to ensure correct database context
      const fullQuery = `USE [${connection.selectedDatabase}];\n${query}`;

      const result = await request.query(fullQuery);

      return {
        success: true,
        serverName,
        database: connection.selectedDatabase,
        rowsAffected: result.rowsAffected,
        recordset: result.recordset,
        recordsets: result.recordsets,
        rowCount: result.recordset?.length || 0,
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
   * Execute a stored procedure
   */
  async executeProcedure(
    serverName: string,
    procedureName: string,
    params?: { [key: string]: any }
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
      const request = connection.pool.request();

      // Add parameters if provided
      if (params) {
        for (const [name, value] of Object.entries(params)) {
          request.input(name, value);
        }
      }

      const result = await request.execute(procedureName);

      return {
        success: true,
        serverName,
        database: connection.selectedDatabase,
        procedure: procedureName,
        rowsAffected: result.rowsAffected,
        recordset: result.recordset,
        recordsets: result.recordsets,
        returnValue: result.returnValue,
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
      await connection.pool.close();
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
        await conn.pool.close();
      }
    }
    this.connections.clear();
    console.log("✅ Disconnected from all SQL Servers");
  }

  /**
   * Get service status
   */
  getStatus(): any {
    return {
      status: "operational",
      mode: "sql-server",
      configuredServers: Object.keys(this.config.servers),
      connectionStatus: this.getConnectionStatus(),
      azureKeyVaultEnabled: this.config.azureKeyVault?.enabled || false,
    };
  }
}
