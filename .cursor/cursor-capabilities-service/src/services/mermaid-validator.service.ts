/**
 * Mermaid Diagram Validator Service
 * Validates Mermaid diagram syntax before inserting into documents
 */

export interface MermaidValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  diagram: string;
  sanitized?: string;
}

export class MermaidValidatorService {
  /**
   * Validate a Mermaid diagram for common syntax errors
   */
  validateDiagram(diagram: string, type?: string): MermaidValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitized = diagram;

    // Check for empty diagram
    if (!diagram || diagram.trim().length === 0) {
      errors.push('Diagram is empty');
      return { valid: false, errors, warnings, diagram };
    }

    // Check for diagram type declaration
    const firstLine = diagram.trim().split('\n')[0];
    const validTypes = ['graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram', 'journey', 'gantt', 'pie', 'gitGraph', 'C4Context'];
    
    if (!validTypes.some(t => firstLine.startsWith(t))) {
      errors.push(`First line must declare diagram type. Found: "${firstLine.substring(0, 50)}..."`);
    }

    // Check for Unicode characters that may cause rendering issues
    const problematicChars = /[✅✓✗✖❌⚠️⚡🚀🎯📊📈📉💡🔧🔥⭐]/g;
    const matches = diagram.match(problematicChars);
    if (matches) {
      warnings.push(`Found ${matches.length} emoji/Unicode characters that may not render in all Mermaid parsers: ${[...new Set(matches)].join(', ')}`);
      warnings.push('Consider replacing with text equivalents or removing for better compatibility');
      
      // Create sanitized version without emojis
      sanitized = diagram.replace(/✅/g, '[OK]')
                        .replace(/⚠️/g, '[WARN]')
                        .replace(/❌/g, '[X]')
                        .replace(/✓/g, '[check]')
                        .replace(/✗/g, '[x]')
                        .replace(/⚡/g, '[fast]')
                        .replace(/🚀/g, '[rocket]')
                        .replace(/🎯/g, '[target]')
                        .replace(/📊/g, '[chart]')
                        .replace(/📈/g, '[up]')
                        .replace(/📉/g, '[down]')
                        .replace(/💡/g, '[idea]')
                        .replace(/🔧/g, '[tool]')
                        .replace(/🔥/g, '[fire]')
                        .replace(/⭐/g, '[star]');
    }

    // Check for unmatched brackets
    const openBrackets = (diagram.match(/\[/g) || []).length;
    const closeBrackets = (diagram.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push(`Unmatched brackets: ${openBrackets} open '[', ${closeBrackets} close ']'`);
    }

    const openCurly = (diagram.match(/\{/g) || []).length;
    const closeCurly = (diagram.match(/\}/g) || []).length;
    if (openCurly !== closeCurly) {
      errors.push(`Unmatched braces: ${openCurly} open '{', ${closeCurly} close '}'`);
    }

    const openParen = (diagram.match(/\(/g) || []).length;
    const closeParen = (diagram.match(/\)/g) || []).length;
    if (openParen !== closeParen) {
      errors.push(`Unmatched parentheses: ${openParen} open '(', ${closeParen} close ')'`);
    }

    // Check for graph/flowchart specific syntax
    if (firstLine.startsWith('graph') || firstLine.startsWith('flowchart')) {
      // Check for valid direction
      const direction = firstLine.split(/\s+/)[1];
      const validDirections = ['TD', 'TB', 'BT', 'RL', 'LR'];
      if (direction && !validDirections.includes(direction)) {
        warnings.push(`Unknown direction "${direction}". Valid: ${validDirections.join(', ')}`);
      }

      // Check for arrow syntax issues
      const arrowPatterns = [/-->/g, /---/g, /==>/g, /-\.->/g, /\|.*\|/g];
      let hasArrows = false;
      for (const pattern of arrowPatterns) {
        if (pattern.test(diagram)) {
          hasArrows = true;
          break;
        }
      }
      
      if (!hasArrows && diagram.split('\n').length > 2) {
        warnings.push('No connection arrows found (-->, ==>, etc.). Nodes may not be connected.');
      }

      // Check for style definitions
      const styleLines = diagram.match(/style\s+\w+\s+fill:/g);
      if (styleLines) {
        warnings.push(`Found ${styleLines.length} style definitions. Ensure color values are valid CSS colors.`);
      }
    }

    // Check for subgraph syntax
    const subgraphCount = (diagram.match(/subgraph/gi) || []).length;
    const endCount = (diagram.match(/^\s*end\s*$/gm) || []).length;
    if (subgraphCount !== endCount) {
      errors.push(`Unmatched subgraph blocks: ${subgraphCount} 'subgraph', ${endCount} 'end'`);
    }

    // Check for common syntax errors
    const lines = diagram.split('\n');
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      
      // Skip empty lines and comments
      if (trimmed === '' || trimmed.startsWith('%%')) return;
      
      // Check for invalid characters in node IDs
      const nodeIdPattern = /^(\w+)[\[\(\{]/;
      const match = trimmed.match(nodeIdPattern);
      if (match) {
        const nodeId = match[1];
        if (/^\d/.test(nodeId)) {
          warnings.push(`Line ${idx + 1}: Node ID "${nodeId}" starts with digit, may cause issues`);
        }
      }
      
      // Check for missing spaces around arrows
      if (/(-->|===|---|->)/.test(trimmed) && !/\s+(-->|===|---|->)\s+/.test(trimmed)) {
        warnings.push(`Line ${idx + 1}: Missing spaces around arrow. Add spaces for better readability.`);
      }
    });

    // Check for line breaks in labels (should use <br/> not \n)
    if (/\[.*\n.*\]/.test(diagram)) {
      warnings.push('Found newlines inside node labels. Use <br/> for line breaks in Mermaid.');
    }

    const valid = errors.length === 0;

    return {
      valid,
      errors,
      warnings,
      diagram,
      sanitized: matches ? sanitized : undefined
    };
  }

  /**
   * Generate a test HTML file to visually render the diagram
   */
  generateTestHTML(diagram: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mermaid Diagram Test</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      background: #f5f5f5;
    }
    h1 {
      color: #333;
      border-bottom: 2px solid #007acc;
      padding-bottom: 10px;
    }
    .diagram-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin: 20px 0;
    }
    .mermaid {
      text-align: center;
    }
    pre {
      background: #282c34;
      color: #abb2bf;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    .success {
      color: #28a745;
      background: #d4edda;
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <h1>Mermaid Diagram Test</h1>
  <p class="success">✓ If you see a rendered diagram below, the Mermaid syntax is valid!</p>
  
  <div class="diagram-container">
    <h2>Rendered Diagram</h2>
    <div class="mermaid">
${diagram}
    </div>
  </div>

  <div class="diagram-container">
    <h2>Source Code</h2>
    <pre>${diagram.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </div>

  <script>
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    });
  </script>
</body>
</html>`;
  }

  /**
   * Get examples of common Mermaid diagram types
   */
  getExamples(): Record<string, string> {
    return {
      flowchart: `graph TD
    Start[Start] --> Decision{Is it working?}
    Decision -->|Yes| Success[Great!]
    Decision -->|No| Debug[Debug Issue]
    Debug --> Decision
    Success --> End[End]
    
    style Start fill:#e3f2fd,stroke:#1976d2
    style Success fill:#c8e6c9,stroke:#388e3c
    style Debug fill:#fff3cd,stroke:#ffc107`,

      sequence: `sequenceDiagram
    participant User
    participant API
    participant Database
    
    User->>API: Request Data
    API->>Database: Query
    Database-->>API: Results
    API-->>User: Response`,

      class: `classDiagram
    class Animal {
      +String name
      +int age
      +makeSound()
    }
    class Dog {
      +String breed
      +bark()
    }
    Animal <|-- Dog`,

      architecture: `graph LR
    User[User] -->|HTTPS| Gateway[API Gateway]
    Gateway -->|Internal| API[REST API]
    API -->|Query| DB[(Database)]
    
    style User fill:#e3f2fd
    style Gateway fill:#f3e5f5
    style API fill:#e8f5e9
    style DB fill:#fff3e0`
    };
  }
}

