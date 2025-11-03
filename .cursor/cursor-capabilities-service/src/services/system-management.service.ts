/**
 * System Management Service
 *
 * Handles system-level operations:
 * - Version checking (Node, Python, npm, pip)
 * - Package installation (npm, pip)
 * - Dependency updates
 * - System information
 */

import { exec } from "child_process";
import * as os from "os";
import * as path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

interface VersionInfo {
  installed: string;
  required?: string;
  satisfies?: boolean;
  location?: string;
}

interface SystemInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  npmVersion: string;
  pythonVersion?: string;
  pipVersion?: string;
  os: {
    type: string;
    release: string;
    totalMemory: string;
    freeMemory: string;
  };
}

export class SystemManagementService {
  constructor() {
    console.log("✅ System Management Service initialized");
  }

  /**
   * Check Node.js version
   */
  async checkNodeVersion(requiredVersion?: string): Promise<VersionInfo> {
    try {
      const { stdout } = await execAsync("node --version");
      const installed = stdout.trim().replace("v", "");

      const result: VersionInfo = {
        installed,
        required: requiredVersion,
      };

      if (requiredVersion) {
        result.satisfies = this.compareVersions(installed, requiredVersion);
      }

      // Get Node location
      try {
        const { stdout: location } = await execAsync("where node", {
          shell: "cmd.exe",
        });
        result.location = location.trim().split("\n")[0];
      } catch {
        try {
          const { stdout: location } = await execAsync("which node");
          result.location = location.trim();
        } catch {
          // Ignore location errors
        }
      }

      return result;
    } catch (error: any) {
      throw new Error(`Failed to check Node version: ${error.message}`);
    }
  }

  /**
   * Check Python version
   */
  async checkPythonVersion(requiredVersion?: string): Promise<VersionInfo> {
    try {
      // Try python3 first, then python
      let stdout: string;
      try {
        const result = await execAsync("python3 --version");
        stdout = result.stdout;
      } catch {
        const result = await execAsync("python --version");
        stdout = result.stdout;
      }

      const installed = stdout.trim().replace("Python ", "");

      const result: VersionInfo = {
        installed,
        required: requiredVersion,
      };

      if (requiredVersion) {
        result.satisfies = this.compareVersions(installed, requiredVersion);
      }

      // Get Python location
      try {
        const { stdout: location } = await execAsync("where python", {
          shell: "cmd.exe",
        });
        result.location = location.trim().split("\n")[0];
      } catch {
        try {
          const { stdout: location } = await execAsync("which python3");
          result.location = location.trim();
        } catch {
          // Ignore location errors
        }
      }

      return result;
    } catch (error: any) {
      throw new Error(`Python not found or not accessible: ${error.message}`);
    }
  }

  /**
   * Check npm version
   */
  async checkNpmVersion(requiredVersion?: string): Promise<VersionInfo> {
    try {
      const { stdout } = await execAsync("npm --version");
      const installed = stdout.trim();

      const result: VersionInfo = {
        installed,
        required: requiredVersion,
      };

      if (requiredVersion) {
        result.satisfies = this.compareVersions(installed, requiredVersion);
      }

      return result;
    } catch (error: any) {
      throw new Error(`Failed to check npm version: ${error.message}`);
    }
  }

  /**
   * Check pip version
   */
  async checkPipVersion(requiredVersion?: string): Promise<VersionInfo> {
    try {
      // Try pip3 first, then pip
      let stdout: string;
      try {
        const result = await execAsync("pip3 --version");
        stdout = result.stdout;
      } catch {
        const result = await execAsync("pip --version");
        stdout = result.stdout;
      }

      const match = stdout.match(/pip ([\d.]+)/);
      const installed = match ? match[1] : "unknown";

      const result: VersionInfo = {
        installed,
        required: requiredVersion,
      };

      if (requiredVersion) {
        result.satisfies = this.compareVersions(installed, requiredVersion);
      }

      return result;
    } catch (error: any) {
      throw new Error(`pip not found or not accessible: ${error.message}`);
    }
  }

  /**
   * Check if a specific npm package is installed
   */
  async checkNpmPackage(
    packageName: string,
    directory?: string
  ): Promise<{
    installed: boolean;
    version?: string;
    location?: string;
  }> {
    try {
      const cwd = directory || process.cwd();
      const { stdout } = await execAsync(
        `npm list ${packageName} --depth=0 --json`,
        { cwd }
      );
      const data = JSON.parse(stdout);

      if (data.dependencies && data.dependencies[packageName]) {
        return {
          installed: true,
          version: data.dependencies[packageName].version,
          location: path.join(cwd, "node_modules", packageName),
        };
      }

      return { installed: false };
    } catch (error: any) {
      // Package not installed
      return { installed: false };
    }
  }

  /**
   * Check if a specific Python package is installed
   */
  async checkPythonPackage(packageName: string): Promise<{
    installed: boolean;
    version?: string;
    location?: string;
  }> {
    try {
      // Try pip3 first, then pip
      let stdout: string;
      try {
        const result = await execAsync(`pip3 show ${packageName}`);
        stdout = result.stdout;
      } catch {
        const result = await execAsync(`pip show ${packageName}`);
        stdout = result.stdout;
      }

      const versionMatch = stdout.match(/Version: ([\d.]+)/);
      const locationMatch = stdout.match(/Location: (.+)/);

      return {
        installed: true,
        version: versionMatch ? versionMatch[1] : "unknown",
        location: locationMatch ? locationMatch[1] : undefined,
      };
    } catch (error: any) {
      return { installed: false };
    }
  }

  /**
   * Install npm package (requires security approval)
   */
  async installNpmPackage(args: {
    package_name: string;
    version?: string;
    save_dev?: boolean;
    directory?: string;
  }): Promise<{ success: boolean; output: string; error?: string }> {
    try {
      const packageSpec = args.version
        ? `${args.package_name}@${args.version}`
        : args.package_name;

      const devFlag = args.save_dev ? "--save-dev" : "";
      const cwd = args.directory || process.cwd();

      const command = `npm install ${packageSpec} ${devFlag}`.trim();

      const { stdout, stderr } = await execAsync(command, {
        cwd,
        timeout: 300000, // 5 minute timeout
      });

      return {
        success: true,
        output: stdout + (stderr ? "\n\nWarnings:\n" + stderr : ""),
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout || "",
        error: error.message,
      };
    }
  }

  /**
   * Install Python package (requires security approval)
   */
  async installPythonPackage(args: {
    package_name: string;
    version?: string;
    user_install?: boolean;
  }): Promise<{ success: boolean; output: string; error?: string }> {
    try {
      const packageSpec = args.version
        ? `${args.package_name}==${args.version}`
        : args.package_name;

      const userFlag = args.user_install ? "--user" : "";

      // Try pip3 first, then pip
      let command = `pip3 install ${packageSpec} ${userFlag}`.trim();

      try {
        const { stdout, stderr } = await execAsync(command, {
          timeout: 300000,
        });
        return {
          success: true,
          output: stdout + (stderr ? "\n\nWarnings:\n" + stderr : ""),
        };
      } catch {
        // Try pip if pip3 fails
        command = `pip install ${packageSpec} ${userFlag}`.trim();
        const { stdout, stderr } = await execAsync(command, {
          timeout: 300000,
        });
        return {
          success: true,
          output: stdout + (stderr ? "\n\nWarnings:\n" + stderr : ""),
        };
      }
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout || "",
        error: error.message,
      };
    }
  }

  /**
   * Update npm dependencies (requires security approval)
   */
  async updateNpmDependencies(directory?: string): Promise<{
    success: boolean;
    output: string;
    error?: string;
  }> {
    try {
      const cwd = directory || process.cwd();
      const { stdout, stderr } = await execAsync("npm update", {
        cwd,
        timeout: 600000, // 10 minute timeout
      });

      return {
        success: true,
        output: stdout + (stderr ? "\n\nWarnings:\n" + stderr : ""),
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout || "",
        error: error.message,
      };
    }
  }

  /**
   * Update Python dependencies (requires security approval)
   */
  async updatePythonDependencies(): Promise<{
    success: boolean;
    output: string;
    error?: string;
  }> {
    try {
      // Get list of outdated packages
      let outdated: string;
      try {
        const result = await execAsync("pip3 list --outdated --format=freeze");
        outdated = result.stdout;
      } catch {
        const result = await execAsync("pip list --outdated --format=freeze");
        outdated = result.stdout;
      }

      if (!outdated.trim()) {
        return {
          success: true,
          output: "All packages are up to date.",
        };
      }

      // Update each package
      const packages = outdated
        .trim()
        .split("\n")
        .map((line) => line.split("==")[0]);
      const command =
        packages.length > 0
          ? `pip3 install --upgrade ${packages.join(" ")}`
          : "";

      const { stdout, stderr } = await execAsync(command, { timeout: 600000 });

      return {
        success: true,
        output: stdout + (stderr ? "\n\nWarnings:\n" + stderr : ""),
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout || "",
        error: error.message,
      };
    }
  }

  /**
   * Run arbitrary system command (requires security approval)
   * WARNING: This is extremely dangerous and should be used with extreme caution
   */
  async runSystemCommand(args: {
    command: string;
    cwd?: string;
  }): Promise<{ success: boolean; output: string; error?: string }> {
    try {
      const { stdout, stderr } = await execAsync(args.command, {
        cwd: args.cwd || process.cwd(),
        timeout: 300000,
      });

      return {
        success: true,
        output: stdout + (stderr ? "\n\nWarnings:\n" + stderr : ""),
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout || "",
        error: error.message,
      };
    }
  }

  /**
   * Get complete system information
   */
  async getSystemInfo(): Promise<SystemInfo> {
    const nodeVersion = await this.checkNodeVersion();
    const npmVersion = await this.checkNpmVersion();

    let pythonVersion: VersionInfo | undefined;
    let pipVersion: VersionInfo | undefined;

    try {
      pythonVersion = await this.checkPythonVersion();
      pipVersion = await this.checkPipVersion();
    } catch {
      // Python not installed
    }

    return {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: nodeVersion.installed,
      npmVersion: npmVersion.installed,
      pythonVersion: pythonVersion?.installed,
      pipVersion: pipVersion?.installed,
      os: {
        type: os.type(),
        release: os.release(),
        totalMemory: this.formatBytes(os.totalmem()),
        freeMemory: this.formatBytes(os.freemem()),
      },
    };
  }

  /**
   * Compare two semantic versions
   */
  private compareVersions(v1: string, v2: string): boolean {
    const parts1 = v1.split(".").map((p) => parseInt(p) || 0);
    const parts2 = v2.split(".").map((p) => parseInt(p) || 0);

    // Pad arrays to same length
    while (parts1.length < parts2.length) parts1.push(0);
    while (parts2.length < parts1.length) parts2.push(0);

    for (let i = 0; i < parts1.length; i++) {
      if (parts1[i] > parts2[i]) return true;
      if (parts1[i] < parts2[i]) return false;
    }

    return true; // Equal
  }

  /**
   * Format bytes to human-readable string
   */
  private formatBytes(bytes: number): string {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Get service status
   */
  getStatus(): any {
    return {
      initialized: true,
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
    };
  }
}
