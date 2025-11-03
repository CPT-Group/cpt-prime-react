/**
 * Flutter Management Service
 *
 * Handles Flutter SDK installation, configuration, and UI mockup generation:
 * - Check Flutter installation status
 * - Download and install Flutter SDK
 * - Run flutter doctor diagnostics
 * - Configure Flutter for development
 * - Generate Flutter UI mockup code from descriptions
 */

import { exec } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

interface FlutterStatus {
  installed: boolean;
  version?: string;
  location?: string;
  inPath?: boolean;
}

interface FlutterDoctorResult {
  success: boolean;
  output: string;
  issues?: string[];
  warnings?: string[];
}

interface FlutterMockupOptions {
  name: string;
  description: string;
  designSystem?: "material" | "cupertino" | "adaptive";
  layout?: "column" | "row" | "stack" | "list" | "grid" | "form";
  includeState?: boolean;
  includeComments?: boolean;
}

export class FlutterManagementService {
  private readonly FLUTTER_VERSION = "3.24.0";
  private readonly WINDOWS_FLUTTER_PATH = "C:\\src\\flutter";
  private readonly FLUTTER_DOWNLOAD_URL =
    "https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.24.0-stable.zip";

  constructor() {
    console.log("✅ Flutter Management Service initialized");
  }

  /**
   * Check Flutter installation status
   */
  async checkFlutterStatus(): Promise<FlutterStatus> {
    try {
      const { stdout } = await execAsync("flutter --version");
      const versionMatch = stdout.match(/Flutter ([\d.]+)/);
      const version = versionMatch ? versionMatch[1] : "unknown";

      // Get Flutter location
      let location: string | undefined;
      try {
        const { stdout: locationOutput } = await execAsync("where flutter", {
          shell: "cmd.exe",
        });
        location = locationOutput.trim().split("\n")[0];
      } catch {
        // Ignore location errors
      }

      return {
        installed: true,
        version,
        location,
        inPath: true,
      };
    } catch (error) {
      // Flutter not in PATH or not installed
      // Check if Flutter exists in default location
      const defaultPath = path.join(
        this.WINDOWS_FLUTTER_PATH,
        "bin",
        "flutter.bat"
      );

      if (fs.existsSync(defaultPath)) {
        return {
          installed: true,
          location: this.WINDOWS_FLUTTER_PATH,
          inPath: false,
        };
      }

      return {
        installed: false,
        inPath: false,
      };
    }
  }

  /**
   * Install Flutter SDK (requires security approval)
   * Downloads Flutter, extracts to C:\src\flutter, and adds to PATH
   */
  async installFlutter(): Promise<{
    success: boolean;
    output: string;
    error?: string;
  }> {
    try {
      let output = "🚀 Starting Flutter SDK installation...\n\n";

      // 1. Create C:\src directory if it doesn't exist
      const srcDir = "C:\\src";
      if (!fs.existsSync(srcDir)) {
        fs.mkdirSync(srcDir, { recursive: true });
        output += `✅ Created directory: ${srcDir}\n`;
      }

      // 2. Check if Flutter already exists
      if (fs.existsSync(this.WINDOWS_FLUTTER_PATH)) {
        output += `⚠️  Flutter directory already exists at ${this.WINDOWS_FLUTTER_PATH}\n`;
        output += `   To reinstall, manually delete this directory first.\n`;
        return {
          success: false,
          output,
          error: "Flutter directory already exists",
        };
      }

      // 3. Download Flutter SDK using PowerShell
      output += `\n📥 Downloading Flutter SDK ${this.FLUTTER_VERSION}...\n`;
      output += `   Source: ${this.FLUTTER_DOWNLOAD_URL}\n`;
      output += `   Destination: C:\\src\\flutter.zip\n\n`;
      output += `   This will take several minutes (approximately 1.5 GB)...\n\n`;

      const downloadCommand = `
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri "${this.FLUTTER_DOWNLOAD_URL}" -OutFile "C:\\src\\flutter.zip"
      `;

      await execAsync(downloadCommand, {
        shell: "powershell.exe",
        timeout: 1800000, // 30 minute timeout for download
      });

      output += `✅ Download complete!\n\n`;

      // 4. Extract Flutter SDK
      output += `📦 Extracting Flutter SDK...\n`;

      const extractCommand = `
        Expand-Archive -Path "C:\\src\\flutter.zip" -DestinationPath "C:\\src" -Force
      `;

      await execAsync(extractCommand, {
        shell: "powershell.exe",
        timeout: 600000, // 10 minute timeout for extraction
      });

      output += `✅ Extraction complete!\n\n`;

      // 5. Clean up zip file
      fs.unlinkSync("C:\\src\\flutter.zip");
      output += `🧹 Cleaned up installation files\n\n`;

      // 6. Add Flutter to PATH (user environment variable)
      output += `⚙️  Adding Flutter to PATH...\n`;

      const addPathCommand = `
        $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
        if ($currentPath -notlike "*flutter\\bin*") {
          [Environment]::SetEnvironmentVariable("Path", "$currentPath;C:\\src\\flutter\\bin", "User")
          Write-Output "PATH updated"
        } else {
          Write-Output "Flutter already in PATH"
        }
      `;

      const { stdout: pathOutput } = await execAsync(addPathCommand, {
        shell: "powershell.exe",
      });

      output += `${pathOutput}\n`;
      output += `✅ Flutter added to PATH\n\n`;

      // 7. Run flutter doctor
      output += `🔍 Running flutter doctor...\n\n`;

      try {
        const flutterBin = path.join(
          this.WINDOWS_FLUTTER_PATH,
          "bin",
          "flutter.bat"
        );
        const { stdout: doctorOutput } = await execAsync(
          `"${flutterBin}" doctor`,
          {
            timeout: 300000, // 5 minute timeout
          }
        );
        output += doctorOutput + "\n";
      } catch (error: any) {
        output += error.stdout || error.message;
      }

      output += `\n═══════════════════════════════════════════════\n\n`;
      output += `✅ Flutter SDK ${this.FLUTTER_VERSION} installed successfully!\n\n`;
      output += `📝 **Next Steps:**\n\n`;
      output += `1. **Restart your terminal/IDE** to refresh PATH\n`;
      output += `2. Run \`flutter doctor\` to check setup\n`;
      output += `3. Install any missing dependencies (Android Studio, Visual Studio, etc.)\n`;
      output += `4. Run \`flutter doctor --android-licenses\` to accept Android licenses\n\n`;
      output += `🎯 **Flutter Location:** ${this.WINDOWS_FLUTTER_PATH}\n`;
      output += `🎯 **Flutter Binary:** ${this.WINDOWS_FLUTTER_PATH}\\bin\\flutter.bat\n\n`;

      return {
        success: true,
        output,
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout || "",
        error: `Flutter installation failed: ${error.message}`,
      };
    }
  }

  /**
   * Run flutter doctor to check setup
   */
  async runFlutterDoctor(): Promise<FlutterDoctorResult> {
    try {
      const status = await this.checkFlutterStatus();

      if (!status.installed) {
        return {
          success: false,
          output: "Flutter is not installed. Please install Flutter first.",
          issues: ["Flutter not installed"],
        };
      }

      // Run flutter doctor
      const flutterCommand = status.inPath
        ? "flutter"
        : path.join(this.WINDOWS_FLUTTER_PATH, "bin", "flutter.bat");

      const { stdout, stderr } = await execAsync(`"${flutterCommand}" doctor`, {
        timeout: 300000, // 5 minute timeout
      });

      const output = stdout + (stderr ? "\n" + stderr : "");

      // Parse issues and warnings
      const issues: string[] = [];
      const warnings: string[] = [];

      const lines = output.split("\n");
      for (const line of lines) {
        if (line.includes("✗") || line.includes("[!]")) {
          issues.push(line.trim());
        } else if (line.includes("!") && !line.includes("[✓]")) {
          warnings.push(line.trim());
        }
      }

      return {
        success: true,
        output,
        issues: issues.length > 0 ? issues : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout || error.message,
        issues: ["Failed to run flutter doctor"],
      };
    }
  }

  /**
   * Generate Flutter UI mockup code from description
   */
  async generateFlutterMockup(
    options: FlutterMockupOptions
  ): Promise<{ success: boolean; code: string; error?: string }> {
    try {
      // Validate widget name
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(options.name)) {
        return {
          success: false,
          code: "",
          error:
            "Widget name must start with uppercase letter and contain only letters and numbers",
        };
      }

      // Set defaults
      const designSystem = options.designSystem || "material";
      const layout = options.layout || "column";
      const includeState = options.includeState ?? false;
      const includeComments = options.includeComments ?? true;

      // Generate code
      let code = "";

      // Add comments
      if (includeComments) {
        code += `// ${options.name} - ${options.description}\n`;
        code += `// Generated by Flutter Management Service\n`;
        code += `// Design System: ${designSystem}\n`;
        code += `// Layout: ${layout}\n\n`;
      }

      // Add imports
      code += `import 'package:flutter/material.dart';\n`;
      if (designSystem === "cupertino" || designSystem === "adaptive") {
        code += `import 'package:flutter/cupertino.dart';\n`;
      }
      code += `\n`;

      // Generate widget class
      const widgetType = includeState ? "StatefulWidget" : "StatelessWidget";
      code += `class ${options.name} extends ${widgetType} {\n`;

      if (includeComments) {
        code += `  /// ${options.description}\n`;
      }

      code += `  const ${options.name}({super.key});\n\n`;

      if (includeState) {
        code += `  @override\n`;
        code += `  State<${options.name}> createState() => _${options.name}State();\n`;
        code += `}\n\n`;
        code += `class _${options.name}State extends State<${options.name}> {\n`;
      }

      // Generate build method
      code += `  @override\n`;
      code += `  Widget build(BuildContext context) {\n`;

      // Generate layout based on type
      code += this.generateLayout(layout, designSystem, options.description);

      code += `  }\n`;
      code += `}\n`;

      return {
        success: true,
        code,
      };
    } catch (error: any) {
      return {
        success: false,
        code: "",
        error: `Failed to generate Flutter mockup: ${error.message}`,
      };
    }
  }

  /**
   * Generate layout code based on type
   */
  private generateLayout(
    layout: string,
    designSystem: string,
    description: string
  ): string {
    const isMaterial =
      designSystem === "material" || designSystem === "adaptive";
    const scaffoldType = isMaterial ? "Scaffold" : "CupertinoPageScaffold";
    const appBarType = isMaterial ? "AppBar" : "CupertinoNavigationBar";
    const buttonType = isMaterial ? "ElevatedButton" : "CupertinoButton";

    let code = `    return ${scaffoldType}(\n`;
    code += `      ${
      isMaterial ? "appBar" : "navigationBar"
    }: ${appBarType}(\n`;
    code += `        ${
      isMaterial ? "title" : "middle"
    }: const Text('${this.toTitleCase(description)}'),\n`;
    code += `      ),\n`;
    code += `      body: `;

    switch (layout) {
      case "column":
        code += `Column(\n`;
        code += `        mainAxisAlignment: MainAxisAlignment.center,\n`;
        code += `        crossAxisAlignment: CrossAxisAlignment.stretch,\n`;
        code += `        children: [\n`;
        code += `          const Padding(\n`;
        code += `            padding: EdgeInsets.all(16.0),\n`;
        code += `            child: Text(\n`;
        code += `              '${description}',\n`;
        code += `              style: TextStyle(fontSize: 18),\n`;
        code += `              textAlign: TextAlign.center,\n`;
        code += `            ),\n`;
        code += `          ),\n`;
        code += `          Padding(\n`;
        code += `            padding: const EdgeInsets.all(16.0),\n`;
        code += `            child: ${buttonType}(\n`;
        code += `              onPressed: () {},\n`;
        code += `              child: const Text('Action'),\n`;
        code += `            ),\n`;
        code += `          ),\n`;
        code += `        ],\n`;
        code += `      ),\n`;
        break;

      case "row":
        code += `Row(\n`;
        code += `        mainAxisAlignment: MainAxisAlignment.spaceEvenly,\n`;
        code += `        children: [\n`;
        code += `          ${buttonType}(\n`;
        code += `            onPressed: () {},\n`;
        code += `            child: const Text('Option 1'),\n`;
        code += `          ),\n`;
        code += `          ${buttonType}(\n`;
        code += `            onPressed: () {},\n`;
        code += `            child: const Text('Option 2'),\n`;
        code += `          ),\n`;
        code += `        ],\n`;
        code += `      ),\n`;
        break;

      case "list":
        code += `ListView.builder(\n`;
        code += `        itemCount: 10,\n`;
        code += `        itemBuilder: (context, index) {\n`;
        code += `          return ListTile(\n`;
        code += `            leading: const Icon(Icons.inbox),\n`;
        code += `            title: Text('Item \${index + 1}'),\n`;
        code += `            subtitle: const Text('${description}'),\n`;
        code += `            onTap: () {},\n`;
        code += `          );\n`;
        code += `        },\n`;
        code += `      ),\n`;
        break;

      case "grid":
        code += `GridView.builder(\n`;
        code += `        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(\n`;
        code += `          crossAxisCount: 2,\n`;
        code += `          crossAxisSpacing: 10,\n`;
        code += `          mainAxisSpacing: 10,\n`;
        code += `          childAspectRatio: 1.0,\n`;
        code += `        ),\n`;
        code += `        padding: const EdgeInsets.all(10),\n`;
        code += `        itemCount: 6,\n`;
        code += `        itemBuilder: (context, index) {\n`;
        code += `          return Card(\n`;
        code += `            child: Center(\n`;
        code += `              child: Text('Item \${index + 1}'),\n`;
        code += `            ),\n`;
        code += `          );\n`;
        code += `        },\n`;
        code += `      ),\n`;
        break;

      case "form":
        code += `Padding(\n`;
        code += `        padding: const EdgeInsets.all(16.0),\n`;
        code += `        child: Column(\n`;
        code += `          crossAxisAlignment: CrossAxisAlignment.stretch,\n`;
        code += `          children: [\n`;
        code += `            ${
          isMaterial ? "TextField" : "CupertinoTextField"
        }(\n`;
        code += `              ${
          isMaterial
            ? "decoration: const InputDecoration(labelText: 'Field 1')"
            : "placeholder: 'Field 1'"
        },\n`;
        code += `            ),\n`;
        code += `            const SizedBox(height: 16),\n`;
        code += `            ${
          isMaterial ? "TextField" : "CupertinoTextField"
        }(\n`;
        code += `              ${
          isMaterial
            ? "decoration: const InputDecoration(labelText: 'Field 2')"
            : "placeholder: 'Field 2'"
        },\n`;
        code += `            ),\n`;
        code += `            const SizedBox(height: 24),\n`;
        code += `            ${buttonType}(\n`;
        code += `              onPressed: () {},\n`;
        code += `              child: const Text('Submit'),\n`;
        code += `            ),\n`;
        code += `          ],\n`;
        code += `        ),\n`;
        code += `      ),\n`;
        break;

      case "stack":
        code += `Stack(\n`;
        code += `        children: [\n`;
        code += `          Container(\n`;
        code += `            color: Colors.blue,\n`;
        code += `          ),\n`;
        code += `          Center(\n`;
        code += `            child: ${buttonType}(\n`;
        code += `              onPressed: () {},\n`;
        code += `              child: const Text('Action'),\n`;
        code += `            ),\n`;
        code += `          ),\n`;
        code += `        ],\n`;
        code += `      ),\n`;
        break;

      default:
        code += `const Center(\n`;
        code += `        child: Text('${description}'),\n`;
        code += `      ),\n`;
    }

    code += `    );\n`;

    return code;
  }

  /**
   * Convert string to title case
   */
  private toTitleCase(str: string): string {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  /**
   * Get service status
   */
  getStatus(): any {
    return {
      initialized: true,
      platform: os.platform(),
      flutterVersion: this.FLUTTER_VERSION,
      installPath: this.WINDOWS_FLUTTER_PATH,
    };
  }
}
