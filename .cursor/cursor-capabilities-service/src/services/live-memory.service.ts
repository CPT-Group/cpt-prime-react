import * as fs from "fs/promises";
import * as path from "path";

/**
 * Live Memory Service
 *
 * Persistent Redis-like storage for session state and temporary data.
 * Uses file-based persistence, can be upgraded to Redis for distributed systems.
 */
export class LiveMemoryService {
  private memory: Map<string, any> = new Map();
  private ttls: Map<string, NodeJS.Timeout> = new Map();
  private memoryFilePath: string = "./.cursor/memory-state.json";
  private autoSaveInterval: NodeJS.Timeout | null = null;
  private isDirty: boolean = false;

  constructor() {
    this.loadMemoryFromDisk();
    this.startAutoSave();
    console.log(
      "✅ Live Memory Service initialized (persistent file-based storage)"
    );
  }

  /**
   * Load memory from disk on startup
   */
  private async loadMemoryFromDisk(): Promise<void> {
    try {
      const fileExists = await fs
        .access(this.memoryFilePath)
        .then(() => true)
        .catch(() => false);

      if (fileExists) {
        const content = await fs.readFile(this.memoryFilePath, "utf-8");
        const data = JSON.parse(content);

        // Restore entries
        for (const [key, value] of Object.entries(data)) {
          this.memory.set(key, value);
        }

        console.log(`✅ Loaded ${this.memory.size} memory entries from disk`);
      }
    } catch (error) {
      console.log("ℹ️  No existing memory state found, starting fresh");
    }
  }

  /**
   * Save memory to disk
   */
  private async saveMemoryToDisk(): Promise<void> {
    if (!this.isDirty) return; // Skip if no changes

    try {
      // Convert Map to plain object for JSON
      const data: Record<string, any> = {};
      for (const [key, value] of this.memory.entries()) {
        data[key] = value;
      }

      // Ensure directory exists
      const dir = path.dirname(this.memoryFilePath);
      await fs.mkdir(dir, { recursive: true });

      // Write to temp file first, then rename (atomic operation)
      const tempFile = `${this.memoryFilePath}.tmp`;
      await fs.writeFile(tempFile, JSON.stringify(data, null, 2), "utf-8");
      await fs.rename(tempFile, this.memoryFilePath);

      this.isDirty = false;
      console.log(`💾 Saved ${this.memory.size} memory entries to disk`);
    } catch (error) {
      console.error("❌ Failed to save memory to disk:", error);
    }
  }

  /**
   * Start auto-save timer (save every 10 seconds if dirty)
   */
  private startAutoSave(): void {
    this.autoSaveInterval = setInterval(() => {
      if (this.isDirty) {
        this.saveMemoryToDisk();
      }
    }, 10000); // 10 seconds
  }

  /**
   * Stop auto-save and perform final save
   */
  async shutdown(): Promise<void> {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    await this.saveMemoryToDisk();
    console.log("✅ Memory service shutdown complete");
  }

  /**
   * Store a value in memory
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    // Store the value
    this.memory.set(key, value);
    this.isDirty = true;

    // Clear existing TTL if any
    const existingTTL = this.ttls.get(key);
    if (existingTTL) {
      clearTimeout(existingTTL);
    }

    // Set new TTL if provided
    if (ttl && ttl > 0) {
      const timeout = setTimeout(() => {
        this.memory.delete(key);
        this.ttls.delete(key);
        this.isDirty = true;
        console.log(`🗑️  Memory key expired: ${key}`);
      }, ttl * 1000);

      this.ttls.set(key, timeout);
    }

    console.log(`💾 Stored in memory: ${key}${ttl ? ` (TTL: ${ttl}s)` : ""}`);

    // Immediate save for critical data
    if (key.startsWith("critical:")) {
      await this.saveMemoryToDisk();
    }
  }

  /**
   * Retrieve a value from memory
   */
  async get(key: string): Promise<any> {
    const value = this.memory.get(key);

    if (value) {
      console.log(`📖 Retrieved from memory: ${key}`);
    } else {
      console.log(`❌ Key not found in memory: ${key}`);
    }

    return value || null;
  }

  /**
   * Query memory keys by pattern
   */
  async query(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace("*", ".*"));
    const matchingKeys = Array.from(this.memory.keys()).filter((k) =>
      regex.test(k)
    );

    console.log(
      `🔍 Query pattern "${pattern}" matched ${matchingKeys.length} keys`
    );
    return matchingKeys;
  }

  /**
   * Delete a key from memory
   */
  async delete(key: string): Promise<boolean> {
    const existed = this.memory.has(key);

    if (existed) {
      this.memory.delete(key);
      this.isDirty = true;

      const ttl = this.ttls.get(key);
      if (ttl) {
        clearTimeout(ttl);
        this.ttls.delete(key);
      }

      console.log(`🗑️  Deleted from memory: ${key}`);
    }

    return existed;
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    return this.memory.has(key);
  }

  /**
   * Get all keys
   */
  async keys(): Promise<string[]> {
    return Array.from(this.memory.keys());
  }

  /**
   * Clear all memory
   */
  async clear(): Promise<void> {
    // Clear all TTL timers
    for (const timeout of this.ttls.values()) {
      clearTimeout(timeout);
    }

    this.memory.clear();
    this.ttls.clear();

    console.log("🗑️  All memory cleared");
  }

  /**
   * Get memory stats
   */
  async stats(): Promise<any> {
    return {
      totalKeys: this.memory.size,
      keysWithTTL: this.ttls.size,
      memoryUsage: process.memoryUsage(),
    };
  }

  /**
   * Get service status
   */
  getStatus(): any {
    return {
      status: "operational",
      mode: "persistent-file",
      keysStored: this.memory.size,
      keysWithTTL: this.ttls.size,
      persistencePath: this.memoryFilePath,
      isDirty: this.isDirty,
      note: "Using persistent file-based storage. Can upgrade to Redis for distributed systems.",
    };
  }
}

/**
 * Redis Integration (Phase 5 Enhancement)
 *
 * To upgrade to Redis:
 * 1. npm install ioredis
 * 2. Import Redis from 'ioredis'
 * 3. Replace Map with Redis client
 * 4. Update all methods to use Redis commands
 *
 * Example:
 * import Redis from 'ioredis';
 * this.redis = new Redis({ host: 'localhost', port: 6379 });
 * await this.redis.set(key, JSON.stringify(value));
 */
