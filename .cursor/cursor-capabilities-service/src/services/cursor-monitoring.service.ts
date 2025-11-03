/**
 * Cursor IDE Monitoring Service
 *
 * Provides monitoring and performance metrics for Cursor IDE
 * Helps AI make memory-aware decisions during conversations
 */

import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export interface CursorPerformanceMetrics {
  timestamp: string;
  memory: {
    totalSystemMB: number;
    freeSystemMB: number;
    usedSystemPercent: number;
  };
  cursor: {
    processMemoryMB?: number;
    dataFolderSizeMB?: number;
    chatStateSizeMB?: number;
    cacheSizeMB?: number;
  };
  recommendations: string[];
  healthStatus: "excellent" | "good" | "warning" | "critical";
}

export interface ConversationMetrics {
  exchangeCount: number;
  filesRead: number;
  totalLinesGenerated: number;
  conversationDurationMinutes: number;
  lastCheckpointMinutes: number;
}

export class CursorMonitoringService {
  private conversationMetrics: Map<string, ConversationMetrics> = new Map();

  constructor() {
    console.log("CursorMonitoringService initialized");
  }

  /**
   * Get current performance metrics
   */
  async getPerformanceMetrics(): Promise<CursorPerformanceMetrics> {
    const metrics: CursorPerformanceMetrics = {
      timestamp: new Date().toISOString(),
      memory: this.getSystemMemory(),
      cursor: await this.getCursorMetrics(),
      recommendations: [],
      healthStatus: "excellent",
    };

    // Analyze and add recommendations
    this.analyzeMetrics(metrics);

    return metrics;
  }

  /**
   * Get system memory information
   */
  private getSystemMemory() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    return {
      totalSystemMB: Math.round(totalMem / 1024 / 1024),
      freeSystemMB: Math.round(freeMem / 1024 / 1024),
      usedSystemPercent: Math.round((usedMem / totalMem) * 100),
    };
  }

  /**
   * Get Cursor-specific metrics (Windows/macOS paths)
   */
  private async getCursorMetrics() {
    const metrics: any = {};

    try {
      // Determine OS and set paths
      const platform = os.platform();
      let cursorDataPath: string;
      let statePath: string;
      let cachePath: string;

      if (platform === "win32") {
        const appData = process.env.APPDATA || "";
        const localAppData = process.env.LOCALAPPDATA || "";
        cursorDataPath = path.join(appData, "Cursor");
        statePath = path.join(cursorDataPath, "state.vscdb");
        cachePath = path.join(localAppData, "Cursor", "Cache");
      } else if (platform === "darwin") {
        const home = process.env.HOME || "";
        cursorDataPath = path.join(
          home,
          "Library",
          "Application Support",
          "Cursor"
        );
        statePath = path.join(cursorDataPath, "state.vscdb");
        cachePath = path.join(home, "Library", "Caches", "Cursor");
      } else {
        // Linux
        const home = process.env.HOME || "";
        cursorDataPath = path.join(home, ".config", "Cursor");
        statePath = path.join(cursorDataPath, "state.vscdb");
        cachePath = path.join(home, ".cache", "Cursor");
      }

      // Get folder/file sizes
      if (fs.existsSync(cursorDataPath)) {
        metrics.dataFolderSizeMB = await this.getFolderSizeMB(cursorDataPath);
      }

      if (fs.existsSync(statePath)) {
        metrics.chatStateSizeMB = await this.getFileSizeMB(statePath);
      }

      if (fs.existsSync(cachePath)) {
        metrics.cacheSizeMB = await this.getFolderSizeMB(cachePath);
      }

      // Try to get Cursor process memory (if accessible)
      // This may not work without elevated permissions
      try {
        const { execSync } = require("child_process");
        if (platform === "win32") {
          const output = execSync(
            'tasklist /FI "IMAGENAME eq Cursor.exe" /FO CSV',
            { encoding: "utf-8" }
          );
          // Parse output to get memory (basic implementation)
          const lines = output.split("\n");
          if (lines.length > 1) {
            const parts = lines[1].split(",");
            if (parts.length > 4) {
              const memKB = parseInt(parts[4].replace(/[^0-9]/g, ""));
              metrics.processMemoryMB = Math.round(memKB / 1024);
            }
          }
        }
      } catch (error) {
        // Process monitoring not available, skip
      }
    } catch (error) {
      console.error("Error getting Cursor metrics:", error);
    }

    return metrics;
  }

  /**
   * Get file size in MB
   */
  private async getFileSizeMB(filePath: string): Promise<number> {
    try {
      const stats = fs.statSync(filePath);
      return Math.round((stats.size / 1024 / 1024) * 100) / 100;
    } catch {
      return 0;
    }
  }

  /**
   * Get folder size in MB (recursive)
   */
  private async getFolderSizeMB(folderPath: string): Promise<number> {
    try {
      let totalSize = 0;

      const walk = (dir: string) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          try {
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
              walk(filePath);
            } else {
              totalSize += stats.size;
            }
          } catch {
            // Skip files that can't be accessed
          }
        }
      };

      walk(folderPath);
      return Math.round((totalSize / 1024 / 1024) * 100) / 100;
    } catch {
      return 0;
    }
  }

  /**
   * Analyze metrics and generate recommendations
   */
  private analyzeMetrics(metrics: CursorPerformanceMetrics): void {
    let warningCount = 0;
    let criticalCount = 0;

    // Check system memory
    if (metrics.memory.usedSystemPercent > 90) {
      metrics.recommendations.push(
        "CRITICAL: System memory is very high (>90%). Close other applications."
      );
      criticalCount++;
    } else if (metrics.memory.usedSystemPercent > 80) {
      metrics.recommendations.push(
        "WARNING: System memory is elevated (>80%). Consider closing unused applications."
      );
      warningCount++;
    }

    // Check chat state size
    if (
      metrics.cursor.chatStateSizeMB &&
      metrics.cursor.chatStateSizeMB > 100
    ) {
      metrics.recommendations.push(
        "Chat history is large (>100MB). Consider clearing old conversations."
      );
      warningCount++;
    }

    // Check cache size
    if (metrics.cursor.cacheSizeMB && metrics.cursor.cacheSizeMB > 500) {
      metrics.recommendations.push(
        "Cache is large (>500MB). Run cleanup script to clear cache."
      );
      warningCount++;
    }

    // Check process memory
    if (
      metrics.cursor.processMemoryMB &&
      metrics.cursor.processMemoryMB > 4000
    ) {
      metrics.recommendations.push(
        "CRITICAL: Cursor is using excessive memory (>4GB). Restart recommended."
      );
      criticalCount++;
    } else if (
      metrics.cursor.processMemoryMB &&
      metrics.cursor.processMemoryMB > 2000
    ) {
      metrics.recommendations.push(
        "Cursor memory usage is elevated (>2GB). Consider restarting soon."
      );
      warningCount++;
    }

    // Set health status
    if (criticalCount > 0) {
      metrics.healthStatus = "critical";
    } else if (warningCount > 2) {
      metrics.healthStatus = "warning";
    } else if (warningCount > 0) {
      metrics.healthStatus = "good";
    } else {
      metrics.healthStatus = "excellent";
    }

    // Add general recommendations if none exist
    if (metrics.recommendations.length === 0) {
      metrics.recommendations.push(
        "System is healthy. No immediate actions needed."
      );
    }
  }

  /**
   * Track conversation metrics
   */
  trackConversation(
    conversationId: string,
    action: "exchange" | "file_read" | "code_generated" | "checkpoint",
    data?: any
  ): void {
    let metrics = this.conversationMetrics.get(conversationId);

    if (!metrics) {
      metrics = {
        exchangeCount: 0,
        filesRead: 0,
        totalLinesGenerated: 0,
        conversationDurationMinutes: 0,
        lastCheckpointMinutes: 0,
      };
      this.conversationMetrics.set(conversationId, metrics);
    }

    switch (action) {
      case "exchange":
        metrics.exchangeCount++;
        break;
      case "file_read":
        metrics.filesRead++;
        break;
      case "code_generated":
        if (data?.lines) {
          metrics.totalLinesGenerated += data.lines;
        }
        break;
      case "checkpoint":
        metrics.lastCheckpointMinutes = 0;
        break;
    }
  }

  /**
   * Get conversation recommendations
   */
  getConversationRecommendations(conversationId: string): string[] {
    const metrics = this.conversationMetrics.get(conversationId);
    if (!metrics) return [];

    const recommendations: string[] = [];

    if (metrics.exchangeCount > 30) {
      recommendations.push(
        "Conversation is very long (30+ exchanges). Consider creating a checkpoint."
      );
    } else if (metrics.exchangeCount > 20) {
      recommendations.push(
        "Conversation is getting long. Consider checkpointing soon."
      );
    }

    if (metrics.filesRead > 20) {
      recommendations.push(
        "Many files have been read. Consider starting a fresh composer session."
      );
    }

    if (metrics.totalLinesGenerated > 2000) {
      recommendations.push(
        "Large amount of code generated. Performance may be affected."
      );
    }

    return recommendations;
  }

  /**
   * Clear conversation metrics
   */
  clearConversation(conversationId: string): void {
    this.conversationMetrics.delete(conversationId);
  }
}
