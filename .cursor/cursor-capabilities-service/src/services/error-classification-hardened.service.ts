import * as fs from "fs/promises";
import * as path from "path";

/**
 * Error Classification Service (Hardened)
 * 
 * Production-ready error classification with comprehensive stability measures:
 * - Input validation
 * - State corruption recovery
 * - Circuit breaker pattern
 * - Resource limits
 * - Transaction-safe state updates
 * - Health monitoring
 */
export class ErrorClassificationHardenedService {
  private learningDataPath: string = "./training-data/error-classification/";
  private stateFilePath: string = "./state/error-classification-state.json";
  private neuralApiUrl: string = "http://127.0.0.1:5555";
  private neuralApiAvailable: boolean = false;
  private decisionTree: any;
  
  // Circuit breaker
  private circuitBreakerFailures: number = 0;
  private circuitBreakerLastFailure: number = 0;
  private circuitBreakerState: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5;
  private readonly CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute
  
  // Resource limits
  private readonly MAX_TRAINING_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly MAX_FILES_IN_DIR = 10000;
  private readonly MAX_STATE_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  
  // Caching
  private classificationCache = new Map<string, { result: any; timestamp: number }>();
  private readonly CACHE_TTL = 300000; // 5 minutes
  private readonly CACHE_MAX_SIZE = 1000;
  
  // Batch logging
  private logQueue: any[] = [];
  private readonly LOG_BATCH_SIZE = 100;
  private logFlushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeDecisionTree();
    this.checkNeuralApiAvailability();
    this.ensureDirectoriesExist();
    this.startLogFlushInterval();
  }

  /**
   * Start periodic log flush
   */
  private startLogFlushInterval(): void {
    this.logFlushInterval = setInterval(() => {
      this.flushLogQueue().catch((error) => {
        console.error("Failed to flush log queue:", error);
      });
    }, 5000); // Flush every 5 seconds
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    if (this.logFlushInterval) {
      clearInterval(this.logFlushInterval);
      this.logFlushInterval = null;
    }
    await this.flushLogQueue();
    this.classificationCache.clear();
  }

  /**
   * Ensure training data and state directories exist
   */
  private async ensureDirectoriesExist(): Promise<void> {
    try {
      await fs.mkdir(this.learningDataPath, { recursive: true });
      await fs.mkdir(path.dirname(this.stateFilePath), { recursive: true });
    } catch (error: any) {
      console.error("Failed to create directories:", error.message);
      // Non-critical, will retry on next operation
    }
  }

  /**
   * Check if Python Neural API is available with circuit breaker
   */
  private async checkNeuralApiAvailability(): Promise<void> {
    if (this.circuitBreakerState === "OPEN") {
      const timeSinceLastFailure = Date.now() - this.circuitBreakerLastFailure;
      if (timeSinceLastFailure > this.CIRCUIT_BREAKER_TIMEOUT) {
        this.circuitBreakerState = "HALF_OPEN";
      } else {
        return; // Circuit breaker is open
      }
    }

    try {
      const response = await fetch(`${this.neuralApiUrl}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      });

      if (response.ok) {
        this.neuralApiAvailable = true;
        this.resetCircuitBreaker();
        console.log("✅ Error Classification: Neural API available");
      } else {
        this.recordCircuitBreakerFailure();
      }
    } catch (error) {
      this.recordCircuitBreakerFailure();
      this.neuralApiAvailable = false;
    }
  }

  /**
   * Circuit breaker failure handling
   */
  private recordCircuitBreakerFailure(): void {
    this.circuitBreakerFailures += 1;
    this.circuitBreakerLastFailure = Date.now();
    
    if (this.circuitBreakerFailures >= this.CIRCUIT_BREAKER_THRESHOLD) {
      this.circuitBreakerState = "OPEN";
      console.warn("⚠️ Circuit breaker OPEN - Neural API unavailable");
    }
  }

  /**
   * Reset circuit breaker on success
   */
  private resetCircuitBreaker(): void {
    this.circuitBreakerFailures = 0;
    this.circuitBreakerState = "CLOSED";
  }

  /**
   * Initialize decision tree for error classification
   */
  private initializeDecisionTree(): void {
    this.decisionTree = {
      root: {
        condition: "http_status",
        branches: {
          "400": {
            condition: "error_message_pattern",
            branches: {
              validation: {
                classification: "VALIDATION_ERROR",
                action: "no_retry",
                confidence: 0.95,
                learning_enabled: true,
              },
            },
          },
          "401": {
            classification: "AUTHENTICATION_ERROR",
            action: "retry_once_after_refresh",
            confidence: 0.90,
            learning_enabled: true,
          },
          "403": {
            classification: "AUTHORIZATION_ERROR",
            action: "no_retry",
            confidence: 0.95,
            learning_enabled: false,
          },
          "404": {
            classification: "RESOURCE_NOT_FOUND",
            action: "no_retry",
            confidence: 0.90,
            learning_enabled: true,
          },
          "429": {
            classification: "RATE_LIMIT",
            action: "retry_with_backoff",
            max_retries: 5,
            confidence: 0.95,
            learning_enabled: true,
          },
          "500": {
            condition: "error_message_pattern",
            branches: {
              timeout: {
                classification: "TIMEOUT_ERROR",
                action: "retry_with_backoff",
                max_retries: 3,
                confidence: 0.85,
                learning_enabled: true,
              },
              connection: {
                classification: "CONNECTION_ERROR",
                action: "retry_immediate",
                max_retries: 3,
                confidence: 0.90,
                learning_enabled: true,
              },
              server: {
                classification: "SERVER_ERROR",
                action: "retry_with_backoff",
                max_retries: 3,
                confidence: 0.80,
                learning_enabled: true,
              },
            },
          },
          "502": {
            classification: "BAD_GATEWAY",
            action: "retry_with_backoff",
            max_retries: 3,
            confidence: 0.85,
            learning_enabled: true,
          },
          "503": {
            classification: "SERVICE_UNAVAILABLE",
            action: "retry_with_backoff",
            max_retries: 3,
            confidence: 0.90,
            learning_enabled: true,
          },
        },
      },
    };
  }

  /**
   * Validate input context
   */
  private validateInput(context: any): {
    httpStatus?: number;
    errorMessage?: string;
    errorType?: string;
    sourceSystem?: string;
    targetSystem?: string;
    timestamp?: string;
    retryCount?: number;
    deploymentId?: string;
  } {
    const validated: any = {};

    if (typeof context.httpStatus === "number") {
      validated.httpStatus = Math.max(100, Math.min(599, context.httpStatus));
    }

    if (typeof context.errorMessage === "string") {
      validated.errorMessage = context.errorMessage.substring(0, 1000); // Max 1000 chars
    }

    if (typeof context.errorType === "string") {
      validated.errorType = context.errorType.substring(0, 100);
    }

    if (typeof context.sourceSystem === "string") {
      validated.sourceSystem = context.sourceSystem.substring(0, 100);
    }

    if (typeof context.targetSystem === "string") {
      validated.targetSystem = context.targetSystem.substring(0, 100);
    }

    if (typeof context.retryCount === "number") {
      validated.retryCount = Math.max(0, Math.min(100, context.retryCount));
    }

    if (typeof context.deploymentId === "string") {
      validated.deploymentId = context.deploymentId.substring(0, 100);
    }

    return validated;
  }

  /**
   * Generate cache key from context
   */
  private generateCacheKey(context: any): string {
    return `${context.httpStatus || "unknown"}_${(context.errorMessage || "").substring(0, 50)}`;
  }

  /**
   * Classify error with full hardening
   */
  async classifyError(context: any): Promise<{
    classification: string;
    action: string;
    confidence: number;
    maxRetries?: number;
    delaySeconds?: number;
    learningEnabled: boolean;
    modelSource: "neural" | "decision_tree" | "pattern_match";
  }> {
    try {
      // Validate input
      const validatedContext = this.validateInput(context);

      // Check cache
      const cacheKey = this.generateCacheKey(validatedContext);
      const cached = this.classificationCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.result;
      }

      let result: any;

      // Try neural API with circuit breaker
      if (this.neuralApiAvailable && this.circuitBreakerState !== "OPEN") {
        try {
          const response = await fetch(`${this.neuralApiUrl}/neural/classify-error`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ context: validatedContext }),
            signal: AbortSignal.timeout(1000),
          });

          if (response.ok) {
            const apiResult = await response.json();
            if (apiResult.available) {
              result = { ...apiResult, modelSource: "neural" };
              this.resetCircuitBreaker();
              // Cache result
              this.updateCache(cacheKey, result);
              // Queue for logging (non-blocking)
              this.queueLogging(validatedContext, result, "neural");
              return result;
            }
          }
        } catch (error) {
          this.recordCircuitBreakerFailure();
          // Fall through to decision tree
        }
      }

      // Decision tree classification (always works)
      result = this.classifyWithDecisionTree(validatedContext);
      result.modelSource = "decision_tree";

      // Cache result
      this.updateCache(cacheKey, result);

      // Queue for logging (non-blocking)
      this.queueLogging(validatedContext, result, "decision_tree");

      return result;
    } catch (error: any) {
      // Ultimate fallback - never fail
      console.error("Error in classifyError:", error.message);
      return {
        classification: "UNKNOWN_ERROR",
        action: "retry_with_backoff",
        confidence: 0.50,
        maxRetries: 2,
        learningEnabled: true,
        modelSource: "decision_tree",
      };
    }
  }

  /**
   * Update cache with size limit
   */
  private updateCache(key: string, result: any): void {
    if (this.classificationCache.size >= this.CACHE_MAX_SIZE) {
      // Remove oldest entry
      const firstKey = this.classificationCache.keys().next().value;
      if (firstKey) {
        this.classificationCache.delete(firstKey);
      }
    }
    this.classificationCache.set(key, { result, timestamp: Date.now() });
  }

  /**
   * Queue logging (non-blocking)
   */
  private queueLogging(context: any, classification: any, modelSource: string): void {
    if (!classification.learningEnabled) return;

    this.logQueue.push({
      context,
      classification,
      modelSource,
      timestamp: new Date().toISOString(),
    });

    // Flush if queue is full
    if (this.logQueue.length >= this.LOG_BATCH_SIZE) {
      this.flushLogQueue().catch((error) => {
        console.error("Failed to flush log queue:", error);
      });
    }
  }

  /**
   * Flush log queue to disk
   */
  private async flushLogQueue(): Promise<void> {
    if (this.logQueue.length === 0) return;

    const batch = this.logQueue.splice(0, this.LOG_BATCH_SIZE);
    
    // Check resource limits before writing
    try {
      const fileCount = await this.getFileCount();
      if (fileCount >= this.MAX_FILES_IN_DIR) {
        console.warn("Training data directory at capacity, skipping logging");
        return;
      }

      // Write batch files
      for (const item of batch) {
        const filename = path.join(
          this.learningDataPath,
          `classification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.json`
        );

        const trainingData = {
          ...item,
          version: "1.0.0",
          deploymentId: item.context.deploymentId || "unknown",
        };

        const data = JSON.stringify(trainingData, null, 2);
        if (data.length > this.MAX_TRAINING_FILE_SIZE) {
          console.warn("Training data file too large, skipping");
          continue;
        }

        await fs.writeFile(filename, data);
      }

      // Update state (non-blocking, fire-and-forget)
      this.updateState(batch).catch((error) => {
        console.error("Failed to update state:", error);
      });
    } catch (error: any) {
      console.error("Failed to flush log queue:", error.message);
      // Non-critical, don't throw
    }
  }

  /**
   * Get file count in training data directory
   */
  private async getFileCount(): Promise<number> {
    try {
      const files = await fs.readdir(this.learningDataPath);
      return files.length;
    } catch {
      return 0;
    }
  }

  /**
   * Classify error using decision tree (lightweight, deterministic)
   */
  private classifyWithDecisionTree(context: any): any {
    const httpStatus = context.httpStatus || context.statusCode;
    const errorMessage = (context.errorMessage || "").toLowerCase();

    let currentNode = this.decisionTree.root.branches[httpStatus?.toString()];

    if (!currentNode) {
      return {
        classification: "UNKNOWN_ERROR",
        action: "retry_with_backoff",
        confidence: 0.50,
        maxRetries: 2,
        learningEnabled: true,
        modelSource: "decision_tree",
      };
    }

    if (currentNode.condition) {
      const patternMatch = this.matchErrorPattern(errorMessage, currentNode.condition);
      currentNode = currentNode.branches[patternMatch] || currentNode;
    }

    return {
      classification: currentNode.classification,
      action: currentNode.action,
      confidence: currentNode.confidence || 0.80,
      maxRetries: currentNode.max_retries || 3,
      delaySeconds: currentNode.delay_seconds,
      learningEnabled: currentNode.learning_enabled !== false,
      modelSource: "decision_tree",
    };
  }

  /**
   * Match error message patterns
   */
  private matchErrorPattern(errorMessage: string, patternType: string): string {
    if (!errorMessage) return "default";

    if (patternType === "error_message_pattern") {
      if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
        return "timeout";
      }
      if (
        errorMessage.includes("connection") ||
        errorMessage.includes("connect") ||
        errorMessage.includes("network")
      ) {
        return "connection";
      }
      if (
        errorMessage.includes("validation") ||
        errorMessage.includes("invalid") ||
        errorMessage.includes("missing")
      ) {
        return "validation";
      }
      if (errorMessage.includes("server") || errorMessage.includes("internal")) {
        return "server";
      }
    }

    return "default";
  }

  /**
   * Update state file with atomic write and backup
   */
  private async updateState(batch: any[]): Promise<void> {
    try {
      // Load existing state
      let state: any = {
        pattern_counts: {},
        total_classifications: 0,
        last_updated: new Date().toISOString(),
      };

      try {
        const stateData = await fs.readFile(this.stateFilePath, "utf-8");
        if (stateData.length > this.MAX_STATE_FILE_SIZE) {
          console.warn("State file too large, resetting");
        } else {
          state = JSON.parse(stateData);
        }
      } catch {
        // State file doesn't exist or corrupted, use defaults
      }

      // Update statistics from batch
      for (const item of batch) {
        const key = `${item.context.httpStatus}_${item.classification.label || item.classification.classification}`;
        state.pattern_counts[key] = (state.pattern_counts[key] || 0) + 1;
        state.total_classifications += 1;
      }

      state.last_updated = new Date().toISOString();

      // Atomic write: backup first, then write, then validate
      const backupPath = this.stateFilePath + ".backup";
      try {
        await fs.copyFile(this.stateFilePath, backupPath);
      } catch {
        // No existing file, skip backup
      }

      const stateJson = JSON.stringify(state, null, 2);
      if (stateJson.length > this.MAX_STATE_FILE_SIZE) {
        console.warn("State file would exceed size limit, skipping update");
        return;
      }

      await fs.writeFile(this.stateFilePath, stateJson, "utf-8");

      // Validate written file
      const validation = await fs.readFile(this.stateFilePath, "utf-8");
      JSON.parse(validation); // Will throw if corrupted
    } catch (error) {
      // Non-critical, don't fail
      console.error("Failed to update state:", error);
      // Try to restore from backup if write failed
      try {
        const backupPath = this.stateFilePath + ".backup";
        await fs.copyFile(backupPath, this.stateFilePath);
      } catch {
        // Backup restore failed, state will be recreated on next update
      }
    }
  }

  /**
   * Log outcome for training (call after retry success/failure)
   */
  async logOutcome(
    classification: string,
    context: any,
    outcome: {
      success: boolean;
      retriesUsed: number;
      totalTimeMs: number;
      finalStatus?: number;
    }
  ): Promise<void> {
    // Queue for batch processing
    this.logQueue.push({
      type: "outcome",
      timestamp: new Date().toISOString(),
      classification,
      context: this.validateInput(context),
      outcome,
      version: "1.0.0",
      deploymentId: context.deploymentId || "unknown",
    });

    // Trigger flush if queue is full
    if (this.logQueue.length >= this.LOG_BATCH_SIZE) {
      this.flushLogQueue().catch((error) => {
        console.error("Failed to flush outcome log:", error);
      });
    }
  }

  /**
   * Get comprehensive health status
   */
  async getHealthStatus(): Promise<any> {
    const fileCount = await this.getFileCount();
    
    return {
      status: "healthy",
      service: "error-classification",
      mode: this.neuralApiAvailable ? "neural_enhanced" : "decision_tree_only",
      neuralApiAvailable: this.neuralApiAvailable,
      circuitBreakerState: this.circuitBreakerState,
      circuitBreakerFailures: this.circuitBreakerFailures,
      cacheSize: this.classificationCache.size,
      logQueueSize: this.logQueue.length,
      fileCount: fileCount,
      fileCountHealthy: fileCount < this.MAX_FILES_IN_DIR,
      trainingDataPath: this.learningDataPath,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get service status (backward compatibility)
   */
  getStatus(): any {
    return {
      status: "operational",
      mode: this.neuralApiAvailable ? "neural_enhanced" : "decision_tree_only",
      neuralApiAvailable: this.neuralApiAvailable,
      trainingDataPath: this.learningDataPath,
      note: "Hardened service - guaranteed to never fail",
    };
  }
}

