/**
 * Security Checkpoint Service
 *
 * Manages security sequences for sensitive operations requiring user approval.
 * Generates random sequences and validates them with strict rules.
 */

interface PendingOperation {
  sequence: string;
  operation: string;
  args: any;
  timestamp: number;
  messageId: string;
  validated: boolean;
}

export class SecurityCheckpointService {
  private pendingOperations: Map<string, PendingOperation> = new Map();
  private readonly SEQUENCE_LENGTH = 12;
  private readonly SEQUENCE_TIMEOUT = 3600000; // 1 hour timeout

  constructor() {
    // Clean up expired sequences every 5 minutes
    setInterval(() => this.cleanupExpiredSequences(), 300000);
  }

  /**
   * Generate a random security sequence
   */
  private generateSequence(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Avoid ambiguous chars (0,O,1,I)
    const parts: string[] = [];

    // Generate 3 groups of 4 characters (e.g., ABCD-EFGH-JKLM)
    for (let i = 0; i < 3; i++) {
      let part = "";
      for (let j = 0; j < 4; j++) {
        part += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      parts.push(part);
    }

    return parts.join("-");
  }

  /**
   * Request approval for a sensitive operation
   * Returns a security sequence that must be validated
   */
  requestApproval(operation: string, args: any): string {
    const sequence = this.generateSequence();
    const operationId = `op_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    this.pendingOperations.set(operationId, {
      sequence,
      operation,
      args,
      timestamp: Date.now(),
      messageId: operationId,
      validated: false,
    });

    return JSON.stringify(
      {
        status: "approval_required",
        operationId,
        sequence,
        operation,
        args: this.sanitizeArgsForDisplay(args),
        message: this.formatApprovalMessage(operation, args, sequence),
      },
      null,
      2
    );
  }

  /**
   * Validate a security sequence
   *
   * Rules:
   * 1. Sequence must match exactly
   * 2. Sequence must be the ONLY content in the message
   * 3. Must be submitted as direct reply
   * 4. Cannot add any other text (invalidates sequence)
   * 5. Sequence expires after timeout
   */
  validateSequence(
    operationId: string,
    submittedContent: string
  ): {
    valid: boolean;
    reason?: string;
    operation?: PendingOperation;
  } {
    const pending = this.pendingOperations.get(operationId);

    if (!pending) {
      return {
        valid: false,
        reason:
          "Operation not found or expired. Please restart the operation to get a new security sequence.",
      };
    }

    // Check if expired
    if (Date.now() - pending.timestamp > this.SEQUENCE_TIMEOUT) {
      this.pendingOperations.delete(operationId);
      return {
        valid: false,
        reason:
          "Security sequence has expired. Please restart the operation to get a new security sequence.",
      };
    }

    // Check if already validated
    if (pending.validated) {
      return {
        valid: false,
        reason:
          "This security sequence has already been used. Please restart the operation to get a new security sequence.",
      };
    }

    // CRITICAL VALIDATION: Content must be EXACTLY the sequence, nothing else
    const trimmedContent = submittedContent.trim();

    // Check for exact match
    if (trimmedContent !== pending.sequence) {
      // Check if sequence is present but with extra text
      if (trimmedContent.includes(pending.sequence)) {
        // SECURITY VIOLATION: Sequence provided with extra text
        this.pendingOperations.delete(operationId); // Invalidate immediately
        return {
          valid: false,
          reason:
            "❌ SECURITY VIOLATION: Security sequence must be submitted alone with no additional text. This sequence has been invalidated. Please restart the operation to get a new security sequence.",
        };
      }

      return {
        valid: false,
        reason:
          "Invalid security sequence. Please copy and paste the exact sequence shown above, with no additional text.",
      };
    }

    // Mark as validated
    pending.validated = true;

    return {
      valid: true,
      operation: pending,
    };
  }

  /**
   * Complete an approved operation
   */
  completeOperation(operationId: string): void {
    this.pendingOperations.delete(operationId);
  }

  /**
   * Cancel a pending operation
   */
  cancelOperation(operationId: string): void {
    this.pendingOperations.delete(operationId);
  }

  /**
   * Get pending operation status
   */
  getOperationStatus(operationId: string): any {
    const pending = this.pendingOperations.get(operationId);

    if (!pending) {
      return {
        status: "not_found",
        message: "Operation not found or expired",
      };
    }

    const age = Date.now() - pending.timestamp;
    const remaining = this.SEQUENCE_TIMEOUT - age;

    return {
      status: pending.validated ? "validated" : "pending",
      operation: pending.operation,
      age: Math.floor(age / 1000),
      expiresIn: Math.floor(remaining / 1000),
      validated: pending.validated,
    };
  }

  /**
   * Clean up expired sequences
   */
  private cleanupExpiredSequences(): void {
    const now = Date.now();
    const expired: string[] = [];

    for (const [id, op] of this.pendingOperations.entries()) {
      if (now - op.timestamp > this.SEQUENCE_TIMEOUT) {
        expired.push(id);
      }
    }

    expired.forEach((id) => this.pendingOperations.delete(id));

    if (expired.length > 0) {
      console.log(`🧹 Cleaned up ${expired.length} expired security sequences`);
    }
  }

  /**
   * Format approval message for user
   */
  private formatApprovalMessage(
    operation: string,
    args: any,
    sequence: string
  ): string {
    let message = "🔒 SECURITY APPROVAL REQUIRED\n\n";
    message += "═══════════════════════════════════════════════\n\n";
    message += `**Operation:** ${this.getOperationDescription(
      operation,
      args
    )}\n\n`;
    message += this.getOperationDetails(operation, args);
    message += "\n═══════════════════════════════════════════════\n\n";
    message += "⚠️  **SECURITY SEQUENCE**\n\n";
    message += `\`\`\`\n${sequence}\n\`\`\`\n\n`;
    message += "═══════════════════════════════════════════════\n\n";
    message += "📋 **INSTRUCTIONS:**\n\n";
    message += "1. **Review** the operation details above carefully\n";
    message += "2. **Copy** the security sequence (shown above)\n";
    message += "3. **Submit** the sequence as your NEXT message\n";
    message += "4. **IMPORTANT:** Send ONLY the sequence, no other text\n";
    message += "5. Do NOT add explanations, questions, or comments\n\n";
    message += "⚠️  **SECURITY RULES:**\n\n";
    message += "- ❌ Adding ANY text invalidates the sequence\n";
    message += "- ❌ Sequences expire after 1 hour\n";
    message += "- ❌ Each sequence can only be used once\n";
    message += "- ✅ Submit sequence alone to approve operation\n\n";
    message += "═══════════════════════════════════════════════\n\n";
    message +=
      "The operation will wait indefinitely until you submit the sequence or cancel.\n";

    return message;
  }

  /**
   * Get human-readable operation description
   */
  private getOperationDescription(operation: string, args: any): string {
    switch (operation) {
      case "install_npm_package":
        return `Install npm package: ${args.package_name}${
          args.version ? "@" + args.version : ""
        }`;
      case "install_python_package":
        return `Install Python package: ${args.package_name}${
          args.version ? "==" + args.version : ""
        }`;
      case "run_system_command":
        return `Execute system command: ${args.command}`;
      case "update_npm_dependencies":
        return "Update all npm dependencies";
      case "update_python_dependencies":
        return "Update all Python dependencies";
      case "install_node_version":
        return `Install Node.js version: ${args.version}`;
      case "install_flutter":
        return "Install Flutter SDK 3.24.0";
      default:
        return operation;
    }
  }

  /**
   * Get detailed operation information
   */
  private getOperationDetails(operation: string, args: any): string {
    let details = "**Details:**\n\n";

    switch (operation) {
      case "install_npm_package":
        details += `- Package: \`${args.package_name}\`\n`;
        if (args.version) details += `- Version: \`${args.version}\`\n`;
        details += `- Type: ${
          args.save_dev ? "Development dependency" : "Production dependency"
        }\n`;
        if (args.directory) details += `- Directory: \`${args.directory}\`\n`;
        break;

      case "install_python_package":
        details += `- Package: \`${args.package_name}\`\n`;
        if (args.version) details += `- Version: \`${args.version}\`\n`;
        if (args.user_install) details += `- Scope: User install (--user)\n`;
        break;

      case "run_system_command":
        details += `- Command: \`${args.command}\`\n`;
        if (args.cwd) details += `- Working Directory: \`${args.cwd}\`\n`;
        details +=
          "\n⚠️  **WARNING:** This command will execute with your system permissions!\n";
        break;

      case "install_flutter":
        details += `- Flutter Version: 3.24.0 (stable)\n`;
        details += `- Installation Path: C:\\src\\flutter\n`;
        details += `- Download Size: ~1.5 GB\n`;
        details += `- Will be added to PATH\n`;
        details +=
          "\n⚠️  **WARNING:** This will download and install Flutter SDK to your system!\n";
        break;

      default:
        details += JSON.stringify(args, null, 2);
    }

    return details;
  }

  /**
   * Sanitize arguments for display (remove sensitive data)
   */
  private sanitizeArgsForDisplay(args: any): any {
    const sanitized = { ...args };

    // Remove sensitive fields
    const sensitiveFields = [
      "password",
      "token",
      "secret",
      "key",
      "credential",
    ];
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = "***REDACTED***";
      }
    }

    return sanitized;
  }

  /**
   * Get service status
   */
  getStatus(): any {
    return {
      initialized: true,
      pendingOperations: this.pendingOperations.size,
      sequenceLength: this.SEQUENCE_LENGTH,
      timeout: this.SEQUENCE_TIMEOUT / 1000 / 60 + " minutes",
    };
  }
}
