import * as fs from "fs/promises";
import * as path from "path";

/**
 * Neural Network Service
 *
 * Manages neural networks for expert persona adjustment and code quality prediction.
 * Calls Python neural API (MiniLM, DialoGPT) if available, falls back to stubs.
 */
export class NeuralNetworkService {
  private networks: Map<string, any> = new Map();
  private trainingDataPath: string = "./training-data/";
  private neuralApiUrl: string = "http://127.0.0.1:5555";
  private neuralApiAvailable: boolean = false;

  constructor() {
    this.initializeStubNetworks();
    this.checkNeuralApiAvailability();
  }

  /**
   * Check if Python Neural API is available
   */
  private async checkNeuralApiAvailability(): Promise<void> {
    try {
      const response = await fetch(`${this.neuralApiUrl}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(2000), // 2 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        this.neuralApiAvailable = data.neural_available === true;

        if (this.neuralApiAvailable) {
          console.log(
            "✅ Neural API connected - using real neural models (MiniLM, DialoGPT)"
          );
        } else {
          console.log(
            "⚠️  Neural API reachable but models not loaded - using stubs"
          );
        }
      } else {
        console.log(
          "⚠️  Neural API not responding - using stub recommendations"
        );
      }
    } catch (error) {
      console.log(
        "ℹ️  Neural API not available (start with: cd python-neural-api && ./start-neural-api.ps1) - using stubs"
      );
      this.neuralApiAvailable = false;
    }
  }

  /**
   * Initialize stub networks for immediate testing
   */
  private initializeStubNetworks() {
    // Designer expert stub
    this.networks.set("designer-expert", {
      expertId: "designer-expert",
      modelStatus: "stub",
      config: {
        enabled: true,
        capabilities: ["persona_adjustment", "strategic_questioning"],
      },
    });

    // C# expert stub
    this.networks.set("csharp-expert", {
      expertId: "csharp-expert",
      modelStatus: "stub",
      config: {
        enabled: true,
        capabilities: ["code_quality_prediction", "pattern_selection"],
      },
    });

    console.log("✅ Neural network stubs initialized for testing");
  }

  /**
   * Get neural network recommendation for an expert
   */
  async getRecommendation(expertId: string, context: any): Promise<any> {
    // Try Python Neural API first if available
    if (this.neuralApiAvailable) {
      try {
        const response = await fetch(`${this.neuralApiUrl}/neural/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expertId, context }),
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.available) {
            console.log(
              `🧠 Neural recommendation from real models for ${expertId}`
            );
            return result;
          }
        }
      } catch (error) {
        console.log(
          `⚠️  Neural API call failed, falling back to stubs:`,
          error
        );
        this.neuralApiAvailable = false; // Disable until next restart
      }
    }

    // Fall back to intelligent stub recommendations
    return this.getIntelligentStubRecommendation(expertId, context);
  }

  /**
   * Get intelligent stub recommendation (analyzes context)
   */
  private getIntelligentStubRecommendation(
    expertId: string,
    context: any
  ): any {
    // Analyze context to provide intelligent recommendations
    const analysis = this.analyzeContext(context);

    return {
      available: true,
      modelStatus: "intelligent_stub",
      expertId: expertId,
      contextAnalysis: analysis,
      recommendations: {
        tone: analysis.suggestedTone,
        conversationalMarkers: this.getConversationalMarkers(analysis),
        structureGuidance: this.getStructureGuidance(analysis),
        humanizationTips: [
          "Use contractions naturally (it's, we're, you'll)",
          "Include conversational phrases ('Well...', 'Actually...', 'Let me think...')",
          "Show thinking process occasionally",
          "Admit uncertainty where appropriate ('I'm not entirely sure about...')",
          "Reference expert knowledge naturally ('From my knowledge of...')",
          "Ask follow-up questions to engage user",
        ],
        expertCitationStyle: this.getExpertCitationStyle(analysis),
        confidence: 0.85,
        note: "Intelligent stub - analyzes context and provides smart recommendations. Will improve with trained models in Phase 5.",
      },
    };
  }

  /**
   * Analyze conversation context
   */
  private analyzeContext(context: any): any {
    const query = context.userQuery || context.query || "";
    const messageCount = context.conversationHistory?.length || 0;
    const queryLength = query.length;
    const hasQuestionMark = query.includes("?");
    const isCode = query.includes("function") || query.includes("class") || query.includes("const");
    const isArchitecture = query.toLowerCase().includes("design") || 
                           query.toLowerCase().includes("architecture") ||
                           query.toLowerCase().includes("system");
    const isSimple = queryLength < 100 && !isArchitecture;
    const userTone = this.detectUserTone(query);

    return {
      queryComplexity: isSimple ? "simple" : isArchitecture ? "complex" : "moderate",
      conversationStage: messageCount < 3 ? "opening" : messageCount < 10 ? "middle" : "established",
      userTone: userTone,
      suggestedTone: this.matchTone(userTone),
      isQuestion: hasQuestionMark,
      isCodeRequest: isCode,
      isArchitectureRequest: isArchitecture,
      needsDetailedExplanation: !isSimple,
      shouldAskFollowUp: isSimple || messageCount < 3,
    };
  }

  /**
   * Detect user's communication tone
   */
  private detectUserTone(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("please") || lowerQuery.includes("thank")) {
      return "polite_formal";
    }
    if (lowerQuery.includes("!") || lowerQuery.includes("need") || lowerQuery.includes("urgent")) {
      return "urgent";
    }
    if (lowerQuery.match(/\b(hey|hi|yo)\b/)) {
      return "casual";
    }
    if (query.length > 200 || lowerQuery.includes("specifically")) {
      return "detailed_formal";
    }
    
    return "professional";
  }

  /**
   * Match appropriate response tone to user tone
   */
  private matchTone(userTone: string): string {
    const toneMapping: { [key: string]: string } = {
      polite_formal: "professional_friendly",
      urgent: "focused_helpful",
      casual: "conversational_approachable",
      detailed_formal: "comprehensive_technical",
      professional: "balanced_expert",
    };

    return toneMapping[userTone] || "balanced_expert";
  }

  /**
   * Get conversational markers based on context
   */
  private getConversationalMarkers(analysis: any): string[] {
    const markers: string[] = [];

    if (analysis.conversationStage === "opening") {
      markers.push("Great question!", "Excellent question!", "I'd be happy to help with that!");
    }

    if (analysis.queryComplexity === "complex") {
      markers.push("Let me think through this...", "This is an interesting challenge...", "Let me break this down...");
    }

    if (analysis.userTone === "casual") {
      markers.push("Well...", "Actually...", "You know what...");
    } else {
      markers.push("Let me explain...", "From my understanding...", "Based on experience...");
    }

    if (analysis.needsDetailedExplanation) {
      markers.push("To give you the complete picture...", "Let me cover all the important aspects...");
    }

    return markers;
  }

  /**
   * Get structure guidance based on context
   */
  private getStructureGuidance(analysis: any): any {
    if (analysis.queryComplexity === "simple") {
      return {
        structure: "brief_answer",
        sections: ["direct_answer", "brief_explanation", "optional_followup"],
        estimatedLength: "short",
      };
    }

    if (analysis.isArchitectureRequest) {
      return {
        structure: "comprehensive",
        sections: [
          "acknowledgment",
          "multi_expert_identification",
          "expert_analysis",
          "synthesis",
          "recommendations",
          "followup_questions",
        ],
        estimatedLength: "long",
      };
    }

    if (analysis.isCodeRequest) {
      return {
        structure: "code_focused",
        sections: [
          "acknowledgment",
          "expert_consultation",
          "code_example",
          "explanation",
          "best_practices",
        ],
        estimatedLength: "medium",
      };
    }

    return {
      structure: "standard",
      sections: ["acknowledgment", "expert_consultation", "detailed_answer", "citation"],
      estimatedLength: "medium",
    };
  }

  /**
   * Get expert citation style based on context
   */
  private getExpertCitationStyle(analysis: any): any {
    if (analysis.queryComplexity === "complex") {
      return {
        style: "explicit_multi_expert",
        pattern: "State experts upfront, cite throughout, final attribution",
        example:
          "I'll consult [expert-1], [expert-2], [expert-3] for this... According to [expert-1]: [...] From [expert-2]: [...] (Multi-expert consultation: expert-1, expert-2, expert-3)",
      };
    }

    if (analysis.conversationStage === "opening") {
      return {
        style: "friendly_explicit",
        pattern: "Natural introduction, cite expert, friendly closing",
        example:
          "Great question! According to [expert-name]: [...] Would you like me to elaborate? (This comes from [expert-name])",
      };
    }

    return {
      style: "standard",
      pattern: "Brief introduction, expert citation, knowledge, attribution",
      example: "According to [expert-name]: [...] (Using [expert-name]'s guidance)",
    };
  }

  /**
   * Get designer expert recommendations (stub)
   */
  private getDesignerRecommendation(context: any): any {
    // Analyze context to provide reasonable stub recommendations
    const messageCount = context.conversationHistory?.length || 0;
    const userExpertise = context.userExpertiseLevel || 0.5;

    return {
      available: true,
      modelStatus: "stub",
      expertId: "designer-expert",
      recommendations: {
        tone: userExpertise > 0.7 ? "technical_consultant" : "professional",
        detailLevel: userExpertise,
        questioningApproach: messageCount < 3 ? "clarifying" : "strategic",
        responseStructure: {
          shouldAskQuestions: messageCount < 5,
          shouldProvideExample: userExpertise < 0.6,
          shouldReferenceExperience: true,
          suggestedQuestions: [
            "What's your deployment strategy?",
            "How are you handling scalability?",
            "What's your data flow architecture?",
          ],
        },
        communicationStyle: {
          opening: "Let's explore this together.",
          phrases: [
            "Based on experience...",
            "A common pattern here is...",
            "You might consider...",
          ],
          tone_guidance: "Thoughtful, strategic, collaborative",
        },
        confidence: 0.85,
        note: "Stub recommendations - will improve with trained model",
      },
    };
  }

  /**
   * Get C# expert recommendations (stub)
   */
  private getCSharpRecommendation(context: any): any {
    return {
      available: true,
      modelStatus: "stub",
      expertId: "csharp-expert",
      recommendations: {
        codeQuality: {
          predictedCompilerSuccess: 0.95,
          riskAreas: [],
          confidence: 0.8,
        },
        patternSelection: {
          suggestedPattern: "standard",
          reasoning: "Using proven patterns from expert.behavior.json",
          alternatives: [],
        },
        validation: {
          shouldValidateIncremental: true,
          checkpoints: ["expression", "statement", "method", "class"],
        },
        confidence: 0.9,
        note: "Stub recommendations - will improve with trained model based on compiler outcomes",
      },
    };
  }

  /**
   * Log outcome for training data collection
   */
  async logOutcome(
    expertId: string,
    interaction: any,
    outcome: any
  ): Promise<void> {
    const trainingData = {
      expertId,
      timestamp: new Date().toISOString(),
      interaction,
      outcome,
      version: "1.0.0",
    };

    // Create expert-specific training data folder
    const expertPath = path.join(this.trainingDataPath, expertId);
    try {
      await fs.mkdir(expertPath, { recursive: true });

      // Save training data
      const filename = path.join(expertPath, `training-${Date.now()}.json`);
      await fs.writeFile(filename, JSON.stringify(trainingData, null, 2));

      console.log(`📊 Logged training data for ${expertId}: ${filename}`);
    } catch (error: any) {
      console.error(`❌ Failed to log outcome for ${expertId}:`, error.message);
    }
  }

  /**
   * Load expert network from trained model (placeholder for Phase 5)
   */
  async loadExpertNetwork(expertId: string): Promise<void> {
    // Read expert.neural.json configuration
    const configPath = `../../experts/${expertId}/expert.neural.json`;

    try {
      const configData = await fs.readFile(configPath, "utf-8");
      const config = JSON.parse(configData);

      if (!config.neural_network?.enabled) {
        console.log(`ℹ️  Neural network disabled for ${expertId}`);
        return;
      }

      // In Phase 5, this will load actual TensorFlow.js models
      // For now, register as stub
      this.networks.set(expertId, {
        expertId,
        modelStatus: "stub",
        config: config.neural_network,
      });

      console.log(`✅ Registered neural network stub for ${expertId}`);
    } catch (error: any) {
      console.log(`ℹ️  No neural network configuration for ${expertId}`);
    }
  }

  /**
   * Validate fact suggestion using neural model (or stub)
   * According to challenge-training-expert: Auto-approves high-confidence facts (>=90%)
   */
  async validateFactSuggestion(
    factStatement: string,
    context: {
      challengeId?: string;
      pattern?: string;
      metrics?: any;
      expertId?: string;
    },
    evidence: string[]
  ): Promise<{
    shouldAutoApprove: boolean;
    probability: number;
    modelStatus: "real" | "stub";
    threshold: number;
  }> {
    // Try to load TensorFlow.js model if available
    const tfjsModelPath = path.join(
      __dirname,
      "../../../pytorch-offline-trainer/outputs/tfjs/fact_validation"
    );
    
    try {
      // Check if model exists
      const metadataPath = path.join(tfjsModelPath, "model_metadata.json");
      const metadataExists = await fs.access(metadataPath).then(() => true).catch(() => false);
      
      if (metadataExists) {
        // TODO: Load TensorFlow.js model and run inference
        // For now, return stub
        console.log("ℹ️  Fact validation model exists but TensorFlow.js loading not yet implemented");
      }
    } catch (error) {
      // Model not available, use stub
    }
    
    // Stub implementation: Analyze fact and provide intelligent stub prediction
    const stubProbability = this.stubFactValidation(factStatement, context, evidence);
    const threshold = 0.90; // 90% threshold for auto-approval
    
    return {
      shouldAutoApprove: stubProbability >= threshold,
      probability: stubProbability,
      modelStatus: "stub",
      threshold: threshold,
    };
  }

  /**
   * Stub fact validation (intelligent analysis until model is trained)
   */
  private stubFactValidation(
    factStatement: string,
    context: any,
    evidence: string[]
  ): number {
    // Analyze fact statement quality
    const factLength = factStatement.length;
    const hasSpecificMetrics = context.metrics && Object.keys(context.metrics).length > 0;
    const evidenceCount = evidence.length;
    const hasPattern = !!context.pattern;
    
    // Base probability from evidence
    let probability = 0.70; // Start at 70%
    
    // Boost for specific metrics
    if (hasSpecificMetrics) {
      probability += 0.10;
    }
    
    // Boost for pattern evidence
    if (hasPattern) {
      probability += 0.05;
    }
    
    // Boost for multiple evidence points
    if (evidenceCount >= 3) {
      probability += 0.10;
    } else if (evidenceCount >= 2) {
      probability += 0.05;
    }
    
    // Boost for detailed fact statement
    if (factLength > 100 && factLength < 500) {
      probability += 0.05;
    }
    
    // Cap at 0.95 (stub shouldn't be too confident)
    return Math.min(probability, 0.95);
  }

  /**
   * Check pattern generalization using neural model (or stub)
   * According to unsupervised-learning-expert: Filters challenge-specific patterns
   */
  async checkPatternGeneralization(
    patternCode: string,
    challengeContext: {
      challengeId?: string;
      description?: string;
      constraints?: any;
      testCases?: any[];
    },
    crossChallengeFeatures: {
      challengeCount?: number;
      avgPerformance?: number;
      performanceConsistency?: number;
    }
  ): Promise<{
    shouldBeFact: boolean;
    generalizationProbability: number;
    modelStatus: "real" | "stub";
    minChallenges: number;
  }> {
    // Try to load TensorFlow.js model if available
    const tfjsModelPath = path.join(
      __dirname,
      "../../../pytorch-offline-trainer/outputs/tfjs/pattern_generalization"
    );
    
    try {
      const metadataPath = path.join(tfjsModelPath, "model_metadata.json");
      const metadataExists = await fs.access(metadataPath).then(() => true).catch(() => false);
      
      if (metadataExists) {
        // TODO: Load TensorFlow.js model and run inference
        console.log("ℹ️  Pattern generalization model exists but TensorFlow.js loading not yet implemented");
      }
    } catch (error) {
      // Model not available, use stub
    }
    
    // Stub implementation
    const stubProbability = this.stubPatternGeneralization(
      patternCode,
      challengeContext,
      crossChallengeFeatures
    );
    const threshold = 0.85; // 85% threshold for generalization
    const minChallenges = 5;
    
    const challengeCount = crossChallengeFeatures.challengeCount || 0;
    
    return {
      shouldBeFact: stubProbability >= threshold && challengeCount >= minChallenges,
      generalizationProbability: stubProbability,
      modelStatus: "stub",
      minChallenges: minChallenges,
    };
  }

  /**
   * Stub pattern generalization (intelligent analysis until model is trained)
   */
  private stubPatternGeneralization(
    patternCode: string,
    challengeContext: any,
    crossChallengeFeatures: any
  ): number {
    let probability = 0.60; // Start at 60%
    
    // Boost for multiple challenges
    const challengeCount = crossChallengeFeatures.challengeCount || 0;
    if (challengeCount >= 5) {
      probability += 0.25;
    } else if (challengeCount >= 3) {
      probability += 0.15;
    } else if (challengeCount >= 2) {
      probability += 0.10;
    }
    
    // Boost for consistent performance
    const consistency = crossChallengeFeatures.performanceConsistency || 0;
    if (consistency > 0.8) {
      probability += 0.10;
    } else if (consistency > 0.6) {
      probability += 0.05;
    }
    
    // Analyze pattern code for generalizability indicators
    const codeLength = patternCode.length;
    const hasGenericNames = !patternCode.match(/\b(twoSum|testCase|challenge)\b/i);
    const hasReusableStructures = patternCode.match(/\b(Map|Set|Array|function|class)\b/);
    
    if (hasGenericNames && hasReusableStructures) {
      probability += 0.10;
    }
    
    // Cap at 0.90 (stub shouldn't be too confident)
    return Math.min(probability, 0.90);
  }

  /**
   * Get service status
   */
  getStatus(): any {
    return {
      status: "operational",
      mode: "stub",
      networksLoaded: this.networks.size,
      networks: Array.from(this.networks.keys()),
      factValidationAvailable: true,
      patternGeneralizationAvailable: true,
      note: "Using stub networks until Phase 5 (real models will be trained with PyTorch and deployed as TensorFlow.js)",
    };
  }
}
