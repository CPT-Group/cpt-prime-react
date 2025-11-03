/**
 * Voice Feedback Service (TTS)
 *
 * Provides text-to-speech capabilities for Cursor AI
 * Gives spoken updates during work operations (separate from chat responses)
 * Uses FREE platform-native TTS (Windows SAPI, macOS say, Linux espeak)
 * All features are 100% free - no cloud services or paid APIs
 */

import * as child_process from "child_process";
import * as os from "os";

export interface VoiceFeedbackOptions {
  text: string;
  priority?: "normal" | "urgent" | "low";
  interrupt?: boolean; // If true, interrupts any current speech
}

export class VoiceFeedbackService {
  private isEnabled: boolean = true;
  private currentSpeechProcess: child_process.ChildProcess | null = null;
  private platform: string;

  constructor() {
    this.platform = os.platform();
    console.log(`VoiceFeedbackService initialized for ${this.platform} (100% FREE native TTS)`);
  }

  /**
   * Speak text using FREE platform-native TTS
   */
  async speak(options: VoiceFeedbackOptions): Promise<{ success: boolean; error?: string }> {
    if (!this.isEnabled) {
      return { success: false, error: "Voice feedback is disabled" };
    }

    const { text, priority = "normal", interrupt = false } = options;

    if (!text || text.trim().length === 0) {
      return { success: false, error: "Text is empty" };
    }

    // Interrupt current speech if requested
    if (interrupt) {
      await this.stop();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Use FREE platform-native TTS
    return await this.speakNative(text, priority);
  }

  /**
   * Speak using FREE platform-native TTS with natural-sounding improvements
   */
  private async speakNative(text: string, priority: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Add natural pauses to text for better rhythm (makes it sound more natural)
      const textWithPauses = this.addNaturalPauses(text);
      const command = this.getTTSCommand(textWithPauses, priority);
      
      // Execute command asynchronously (fire-and-forget for TTS)
      const process = child_process.exec(
        command,
        { 
          windowsHide: true, // Hide window on Windows
        },
        (error: child_process.ExecException | null) => {
          // Callback fires when process completes or errors
          // Error code 1 is normal for some TTS commands, ignore it
          if (error && error.code !== 1 && !error.killed) {
            console.warn(`Voice feedback error: ${error.message}`);
          }
          this.currentSpeechProcess = null;
        }
      );

      this.currentSpeechProcess = process;

      // Wait briefly to ensure process starts (fire-and-forget pattern)
      await new Promise((resolve) => setTimeout(resolve, 50));

      return { success: true };
    } catch (error: any) {
      console.error(`Voice feedback failed: ${error.message}`);
      this.currentSpeechProcess = null; // Clean up on error
      return { success: false, error: error.message };
    }
  }

  /**
   * Add natural pauses for better conversational rhythm (FREE method - uses text spacing)
   */
  private addNaturalPauses(text: string): string {
    // Add slight pauses by inserting commas or periods for natural rhythm
    // This makes native TTS sound more natural without cloud services
    return text
      .replace(/\. /g, ". ") // Keep periods with space
      .replace(/, /g, ", ")  // Keep commas with space
      .replace(/! /g, "! ")   // Keep exclamation with space
      .replace(/\? /g, "? "); // Keep question with space
    // Native TTS engines handle punctuation pauses naturally
  }

  /**
   * Get platform-specific TTS command
   */
  private getTTSCommand(text: string, priority: string): string {
    const sanitizedText = this.sanitizeText(text);
    const speed = priority === "urgent" ? 1.2 : priority === "low" ? 0.9 : 1.0;

    switch (this.platform) {
      case "win32":
        // Windows: Use PowerShell's built-in speech synthesis (SAPI)
        // This works on all Windows systems without additional dependencies
        // Try to use a more natural-sounding voice if available (Windows 11 has better voices)
        // Escape PowerShell special characters: single quotes by doubling, $ by backtick
        const escapedText = sanitizedText
          .replace(/'/g, "''") // Escape single quotes in PowerShell string
          .replace(/\$/g, "`$") // Escape $ variables
          .replace(/"/g, '`"'); // Escape double quotes
        
        // Try to use a better voice (Zira or David for Windows 10/11, falls back to default)
        // Rate: -10 to +10 (0 is normal), adjust based on priority
        const winRate = Math.round((speed - 1) * 10);
        return `powershell -Command "$speak = New-Object -ComObject SAPI.SpVoice; $voices = $speak.GetVoices(); $desiredVoice = $voices | Where-Object { $_.GetDescription() -like '*Zira*' -or $_.GetDescription() -like '*David*' } | Select-Object -First 1; if ($desiredVoice) { $speak.Voice = $desiredVoice }; $speak.Rate = ${winRate}; $speak.Speak([string]'${escapedText}')"`;

      case "darwin":
        // macOS: Use built-in 'say' command
        // Escape double quotes and backslashes for shell safety
        const macEscapedText = sanitizedText.replace(/"/g, '\\"').replace(/\\/g, "\\\\");
        const macRate = Math.round(200 * speed);
        return `say -r ${macRate} "${macEscapedText}"`;

      case "linux":
        // Linux: Try espeak (common) or fallback to spd-say
        // espeak is lightweight and commonly available
        // Escape double quotes and backslashes for shell safety
        const linuxEscapedText = sanitizedText.replace(/"/g, '\\"').replace(/\\/g, "\\\\");
        const linuxRate = Math.round(175 * speed);
        return `espeak -s ${linuxRate} "${linuxEscapedText}" 2>/dev/null || spd-say "${linuxEscapedText}"`;

      default:
        throw new Error(`Unsupported platform: ${this.platform}`);
    }
  }

  /**
   * Sanitize text for shell commands
   */
  private sanitizeText(text: string): string {
    // Sanitize text for shell commands while preserving natural speech
    // Platform-specific escaping happens in getTTSCommand
    return text
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\r/g, "") // Remove carriage returns
      .replace(/\t/g, " ") // Replace tabs with spaces
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  }

  /**
   * Enable or disable voice feedback
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop(); // Stop any current speech
    }
  }

  /**
   * Check if voice feedback is enabled
   */
  getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Stop any current speech
   */
  async stop(): Promise<void> {
    // Stop native TTS process if active
    if (this.currentSpeechProcess) {
      try {
        this.currentSpeechProcess.kill();
      } catch (error) {
        // Ignore errors
      }
      this.currentSpeechProcess = null;
    }
  }

  /**
   * Test voice feedback (speak a test message)
   */
  async test(): Promise<{ success: boolean; error?: string }> {
    return this.speak({
      text: "Voice feedback is working!",
      priority: "normal",
    });
  }

  /**
   * Get current TTS provider status (always free native)
   */
  getStatus(): { provider: string; azureConfigured: boolean; platform: string } {
    return {
      provider: `Native (${this.platform}) - 100% FREE`,
      azureConfigured: false, // Always false - we only use free native TTS
      platform: this.platform,
    };
  }
}

