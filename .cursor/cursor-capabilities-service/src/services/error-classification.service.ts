import * as fs from "fs/promises";
import * as path from "path";

/**
 * Error Classification Service
 * 
 * Lightweight decision tree-based error classification for integration flows.
 * Collects training data from all deployed systems for offline PyTorch training.
 * 
 * NOTE: This service uses the hardened implementation for production stability.
 * For development/testing, use ErrorClassificationHardenedService directly.
 */
export class ErrorClassificationService {
  private learningDataPath: string = "./training-data/error-classification/";
  private stateFilePath: string = "./state/error-classification-state.json";
  private neuralApiUrl: string = "http://127.0.0.1:5555";
  private neuralApiAvailable: boolean = false;
  private decisionTree: any;

  constructor() {
    this.initializeDecisionTree();
    this.checkNeuralApiAvailability();
    this.ensureDirectoriesExist();
  }

  /**
   * Ensure training data and state directories exist
   */
  private async ensureDirectoriesExist(): Promise<void> {
    try {
      await fs.mkdir(this.learningDataPath, { recursive: true });
      await fs.mkdir(path.dirname(this.stateFilePath), { recursive: true });
    } catch (error) {
      console.error("Failed to create directories:", error);
    }
  }

  /**
   * Check if Python Neural API is available for enhanced classification
   */
  private async checkNeuralApiAvailability(): Promise<void> {
    try {
      const response = await fetch(`${this.neuralApiUrl}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      });

      if (response.ok) {
        this.neuralApiAvailable = true;
        console.log("✅ Error Classification: Neural API available for enhanced classification");
      }
    } catch (error) {
      // Graceful degradation - use decision tree only
      this.neuralApiAvailable = false;
    }
  }

  /**
   * Initialize decision tree for error classification
   */
  private initializeDecisionTree(): void {
    // Decision tree structure (lightweight, fast classification)
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
   * Classify error and get recommended action
   */
  async classifyError(context: {
    httpStatus?: number;
    errorMessage?: string;
    errorType?: string;
    sourceSystem?: string;
    targetSystem?: string;
    timestamp?: string;
    retryCount?: number;
    deploymentId?: string;
  }): Promise<{
    classification: string;
    action: string;
    confidence: number;
    maxRetries?: number;
    delaySeconds?: number;
    learningEnabled: boolean;
    modelSource: "neural" | "decision_tree" | "pattern_match";
  }> {
    // Try neural API first if available
    if (this.neuralApiAvailable) {
      try {
        const response = await fetch(`${this.neuralApiUrl}/neural/classify-error`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ context }),
          signal: AbortSignal.timeout(1000), // Fast timeout for lightweight
        });

        if (response.ok) {
          const result = await response.json();
          if (result.available) {
            // Log for training
            await this.logClassification(context, result, "neural");
            return {
              ...result,
              modelSource: "neural",
            };
          }
        }
      } catch (error) {
        // Fall back to decision tree
        console.log("Neural API unavailable, using decision tree");
      }
    }

    // Decision tree classification (lightweight, fast)
    const classification = this.classifyWithDecisionTree(context);

    // Log for training
    await this.logClassification(context, classification, "decision_tree");

    return {
      ...classification,
      modelSource: classification.modelSource || "decision_tree",
    };
  }

  /**
   * Classify error using decision tree (lightweight, deterministic)
   */
  private classifyWithDecisionTree(context: any): any {
    const httpStatus = context.httpStatus || context.statusCode;
    const errorMessage = (context.errorMessage || "").toLowerCase();

    // Navigate decision tree
    let currentNode = this.decisionTree.root.branches[httpStatus?.toString()];

    if (!currentNode) {
      // Default classification
      return {
        classification: "UNKNOWN_ERROR",
        action: "retry_with_backoff",
        confidence: 0.50,
        maxRetries: 2,
        learningEnabled: true,
        modelSource: "decision_tree",
      };
    }

    // Check for nested conditions
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
   * Match error message patterns (lightweight pattern matching)
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
   * Log classification for training data collection
   */
  private async logClassification(
    context: any,
    classification: any,
    modelSource: string
  ): Promise<void> {
    if (!classification.learningEnabled) {
      return; // Skip logging if learning disabled
    }

    const trainingData = {
      timestamp: new Date().toISOString(),
      context: {
        httpStatus: context.httpStatus,
        errorMessage: context.errorMessage,
        errorType: context.errorType,
        sourceSystem: context.sourceSystem,
        targetSystem: context.targetSystem,
        retryCount: context.retryCount || 0,
      },
      classification: {
        label: classification.classification,
        action: classification.action,
        confidence: classification.confidence,
        maxRetries: classification.maxRetries,
        modelSource: modelSource,
      },
      version: "1.0.0",
      deploymentId: context.deploymentId || "unknown",
    };

    try {
      const filename = path.join(
        this.learningDataPath,
        `classification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.json`
      );
      await fs.writeFile(filename, JSON.stringify(trainingData, null, 2));
      
      // Update state file with pattern statistics
      await this.updateState(trainingData);
    } catch (error: any) {
      console.error("Failed to log classification:", error.message);
    }
  }

  /**
   * Update state file with pattern statistics
   */
  private async updateState(trainingData: any): Promise<void> {
    try {
      let state: any = {
        pattern_counts: {},
        total_classifications: 0,
        last_updated: new Date().toISOString(),
      };

      // Load existing state
      try {
        const stateData = await fs.readFile(this.stateFilePath, "utf-8");
        state = JSON.parse(stateData);
      } catch {
        // State file doesn't exist yet, use defaults
      }

      // Update statistics
      const key = `${trainingData.context.httpStatus}_${trainingData.classification.label}`;
      state.pattern_counts[key] = (state.pattern_counts[key] || 0) + 1;
      state.total_classifications += 1;

      // Save state
      await fs.writeFile(this.stateFilePath, JSON.stringify(state, null, 2));
    } catch (error) {
      // Non-critical, don't fail on state update
      console.error("Failed to update state:", error);
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
    const outcomeData = {
      timestamp: new Date().toISOString(),
      classification,
      context,
      outcome,
      version: "1.0.0",
      deploymentId: context.deploymentId || "unknown",
    };

    try {
      const filename = path.join(
        this.learningDataPath,
        `outcome-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.json`
      );
      await fs.writeFile(filename, JSON.stringify(outcomeData, null, 2));
    } catch (error: any) {
      console.error("Failed to log outcome:", error.message);
    }
  }

  /**
   * Get service status
   */
  getStatus(): any {
    return {
      status: "operational",
      mode: this.neuralApiAvailable ? "neural_enhanced" : "decision_tree_only",
      neuralApiAvailable: this.neuralApiAvailable,
      trainingDataPath: this.learningDataPath,
      note: "Lightweight classification service - works perfectly without neural API",
    };
  }
}

