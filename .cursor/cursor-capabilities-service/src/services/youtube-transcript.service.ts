import { spawn } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

/**
 * YouTube Transcript Service (Python Integration)
 *
 * Uses Python youtube-transcript-api library to extract transcripts from YouTube videos.
 * This method works for BOTH manual and auto-generated captions WITHOUT requiring API keys.
 *
 * NO AUTHENTICATION REQUIRED. NO QUOTAS. Works for 90%+ of videos.
 *
 * Integration approach: Node.js spawns Python subprocess that uses youtube-transcript-api
 */
export class YouTubeTranscriptService {
  private pythonScriptPath: string;

  constructor() {
    // Get current directory in ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Path to Python script (relative to compiled dist directory)
    this.pythonScriptPath = path.join(
      __dirname,
      "../..",
      "scripts",
      "extract_youtube_transcript.py"
    );
  }

  /**
   * Extract video ID from various YouTube URL formats
   */
  private extractVideoId(url: string): string {
    // Handle various YouTube URL formats:
    // - https://www.youtube.com/watch?v=VIDEO_ID
    // - https://youtu.be/VIDEO_ID
    // - https://www.youtube.com/watch?v=VIDEO_ID&list=...
    // - VIDEO_ID (already extracted)

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    throw new Error(`Invalid YouTube URL format: ${url}`);
  }

  /**
   * Extract transcript from YouTube video using Python youtube-transcript-api
   */
  async extractTranscript(
    videoUrl: string,
    languages?: string[]
  ): Promise<{
    videoId: string;
    videoUrl: string;
    transcript: string;
    segments: Array<{ text: string; start: number; duration: number }>;
    metadata: {
      totalSegments: number;
      totalDuration: number;
      wordCount: number;
      characterCount: number;
      language: string;
      languageCode: string;
      isGenerated: boolean;
      method: string;
    };
  }> {
    // Extract video ID
    const videoId = this.extractVideoId(videoUrl);
    const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;

    try {
      // Build Python command
      const args = [this.pythonScriptPath, videoId, "extract"];
      if (languages && languages.length > 0) {
        args.push(languages.join(","));
      }

      // Execute Python script
      const result = await this.executePythonScript(args);

      if (!result.success) {
        throw new Error(result.message || "Unknown error from Python script");
      }

      // Combine segments into full transcript
      const transcript = result.segments.map((s: any) => s.text).join(" ");

      // Calculate character count
      const characterCount = transcript.length;

      return {
        videoId,
        videoUrl: cleanUrl,
        transcript,
        segments: result.segments,
        metadata: {
          totalSegments: result.metadata.totalSegments,
          totalDuration: result.metadata.durationSeconds,
          wordCount: result.metadata.wordCount,
          characterCount,
          language: result.metadata.language,
          languageCode: result.metadata.languageCode,
          isGenerated: result.metadata.isGenerated,
          method: result.metadata.method,
        },
      };
    } catch (error: any) {
      // Handle specific error types
      if (error.message?.includes("TranscriptsDisabled")) {
        throw new Error(
          `Transcripts are disabled for video ${videoId}. The video creator has disabled captions.`
        );
      }
      if (error.message?.includes("NoTranscriptFound")) {
        throw new Error(
          `No transcript found for video ${videoId}. This video may not have captions available.`
        );
      }
      if (error.message?.includes("VideoUnavailable")) {
        throw new Error(
          `Video ${videoId} is unavailable. It may be private, deleted, or region-restricted.`
        );
      }

      throw new Error(`Failed to extract transcript: ${error.message}`);
    }
  }

  /**
   * List available transcripts for a video
   */
  async listTranscripts(videoUrl: string): Promise<{
    videoId: string;
    transcripts: Array<{
      language: string;
      languageCode: string;
      isGenerated: boolean;
      isTranslatable: boolean;
      translationLanguages: Array<{ language: string; languageCode: string }>;
    }>;
    totalCount: number;
  }> {
    const videoId = this.extractVideoId(videoUrl);

    try {
      const args = [this.pythonScriptPath, videoId, "list"];
      const result = await this.executePythonScript(args);

      if (!result.success) {
        throw new Error(result.message || "Unknown error from Python script");
      }

      return result;
    } catch (error: any) {
      throw new Error(`Failed to list transcripts: ${error.message}`);
    }
  }

  /**
   * Execute Python script and parse JSON output
   */
  private executePythonScript(args: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const python = spawn("python", args);

      let stdout = "";
      let stderr = "";

      python.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      python.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      python.on("close", (code) => {
        if (code !== 0) {
          // Try to parse stderr as JSON (error message from Python)
          try {
            const errorData = JSON.parse(stderr || stdout);
            reject(new Error(errorData.message || errorData.error));
          } catch {
            reject(
              new Error(`Python script failed with code ${code}: ${stderr}`)
            );
          }
          return;
        }

        // Parse stdout as JSON
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${stdout}`));
        }
      });

      python.on("error", (error) => {
        reject(new Error(`Failed to spawn Python process: ${error.message}`));
      });
    });
  }

  /**
   * Format transcript as markdown for expert training
   */
  formatAsMarkdown(
    data: {
      videoId: string;
      videoUrl: string;
      transcript: string;
      segments: Array<{ text: string; start: number; duration: number }>;
      metadata: any;
    },
    options: {
      includeTimestamps?: boolean;
      includeMetadata?: boolean;
      title?: string;
    } = {}
  ): string {
    const {
      includeTimestamps = false,
      includeMetadata = true,
      title = "YouTube Video Transcript",
    } = options;

    let markdown = `# ${title}\n\n`;

    // Add metadata
    if (includeMetadata) {
      markdown += `## Video Information\n\n`;
      markdown += `- **Video URL:** ${data.videoUrl}\n`;
      markdown += `- **Video ID:** ${data.videoId}\n`;
      markdown += `- **Total Duration:** ${Math.round(
        data.metadata.totalDuration
      )} seconds (${this.formatDuration(data.metadata.totalDuration)})\n`;
      markdown += `- **Word Count:** ${data.metadata.wordCount.toLocaleString()}\n`;
      markdown += `- **Character Count:** ${data.metadata.characterCount.toLocaleString()}\n`;
      markdown += `- **Segments:** ${data.metadata.totalSegments}\n`;
      markdown += `- **Language:** ${data.metadata.language} (${data.metadata.languageCode})\n`;
      markdown += `- **Auto-Generated:** ${
        data.metadata.isGenerated ? "Yes" : "No"
      }\n`;
      markdown += `- **Method:** ${data.metadata.method}\n`;
      markdown += `- **Extracted:** ${new Date().toISOString()}\n\n`;
    }

    // Add transcript
    markdown += `## Full Transcript\n\n`;

    if (includeTimestamps) {
      // Format with timestamps
      markdown += `### Timestamped Transcript\n\n`;
      for (const segment of data.segments) {
        const timestamp = this.formatTimestamp(segment.start);
        markdown += `**[${timestamp}]** ${segment.text}\n\n`;
      }
    } else {
      // Plain transcript
      markdown += data.transcript + "\n\n";
    }

    // Add usage notes
    markdown += `---\n\n`;
    markdown += `## Usage Notes\n\n`;
    markdown += `This transcript was automatically extracted from YouTube video: ${data.videoUrl}\n\n`;
    markdown += `**For Expert Training:**\n`;
    markdown += `1. Review the content for accuracy and relevance\n`;
    markdown += `2. Extract key concepts, facts, and patterns\n`;
    markdown += `3. Organize into hierarchical knowledge structure\n`;
    markdown += `4. Add confidence scores and examples\n`;
    markdown += `5. Update expert's behavior.json file\n\n`;

    return markdown;
  }

  /**
   * Save transcript to file
   */
  async saveTranscript(
    data: any,
    outputPath: string,
    options: {
      format?: "markdown" | "json" | "text";
      includeTimestamps?: boolean;
      includeMetadata?: boolean;
      title?: string;
    } = {}
  ): Promise<void> {
    const { format = "markdown" } = options;

    // Ensure directory exists
    const directory = path.dirname(outputPath);
    await fs.mkdir(directory, { recursive: true });

    let content: string;

    switch (format) {
      case "markdown":
        content = this.formatAsMarkdown(data, options);
        break;
      case "json":
        content = JSON.stringify(data, null, 2);
        break;
      case "text":
        content = data.transcript;
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    await fs.writeFile(outputPath, content, "utf-8");
  }

  /**
   * Format duration in seconds to HH:MM:SS
   */
  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Format timestamp in seconds to MM:SS or HH:MM:SS
   */
  private formatTimestamp(seconds: number): string {
    return this.formatDuration(seconds);
  }

  /**
   * Check if service is available (Python installed and script exists)
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Check if Python is available
      const python = spawn("python", ["--version"]);

      return new Promise((resolve) => {
        python.on("close", async (code) => {
          if (code !== 0) {
            resolve(false);
            return;
          }

          // Check if script file exists
          try {
            await fs.access(this.pythonScriptPath);
            resolve(true);
          } catch {
            resolve(false);
          }
        });

        python.on("error", () => {
          resolve(false);
        });
      });
    } catch {
      return false;
    }
  }
}
