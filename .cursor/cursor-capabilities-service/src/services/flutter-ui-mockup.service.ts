/**
 * Flutter UI Mockup Generation Service
 *
 * Generates Flutter widget code for UI mockups based on descriptions.
 * Supports Material Design and Cupertino (iOS) patterns.
 *
 * Created: 2025-10-21
 */

export interface FlutterMockupOptions {
  name: string; // Screen/Widget name (e.g., 'LoginScreen')
  description: string; // Description of UI (e.g., 'Login screen with email/password fields and submit button')
  designSystem: "material" | "cupertino" | "adaptive"; // Design system
  components?: string[]; // Optional: specific components to include
  layout?: "column" | "row" | "stack" | "list" | "grid" | "form"; // Layout type
  colorScheme?: "light" | "dark" | "auto"; // Color scheme
  includeState?: boolean; // Include state management (StatefulWidget)
  includeComments?: boolean; // Include explanatory comments
}

export interface FlutterMockupResult {
  name: string;
  code: string; // Generated Dart/Flutter code
  designSystem: string;
  imports: string[]; // Required imports
  hasState: boolean;
  description: string;
  usage: string; // Usage instructions
}

export class FlutterUIMockupService {
  /**
   * Generate Flutter UI mockup from description
   */
  async generateMockup(
    options: FlutterMockupOptions
  ): Promise<FlutterMockupResult> {
    const {
      name,
      description,
      designSystem = "material",
      layout = "column",
      colorScheme = "light",
      includeState = false,
      includeComments = true,
    } = options;

    // Validate name
    if (!this.isValidClassName(name)) {
      throw new Error(
        `Invalid class name: ${name}. Must be UpperCamelCase and end with 'Screen', 'Page', or 'Widget'.`
      );
    }

    // Determine components from description
    const components = this.extractComponents(description);

    // Generate imports
    const imports = this.generateImports(designSystem);

    // Generate widget code
    const code = includeState
      ? this.generateStatefulWidget(
          name,
          description,
          designSystem,
          components,
          layout,
          includeComments
        )
      : this.generateStatelessWidget(
          name,
          description,
          designSystem,
          components,
          layout,
          includeComments
        );

    // Generate usage instructions
    const usage = this.generateUsageInstructions(name, designSystem);

    return {
      name,
      code: this.formatCode(imports, code),
      designSystem,
      imports,
      hasState: includeState,
      description,
      usage,
    };
  }

  /**
   * Generate common UI patterns
   */
  async generatePattern(
    pattern: string,
    options?: Partial<FlutterMockupOptions>
  ): Promise<FlutterMockupResult> {
    const patterns: Record<string, FlutterMockupOptions> = {
      login: {
        name: "LoginScreen",
        description:
          "Login screen with email and password text fields, login button, and forgot password link",
        designSystem: "material",
        layout: "form",
        includeState: true,
        includeComments: true,
      },
      signup: {
        name: "SignupScreen",
        description:
          "Signup screen with name, email, password, confirm password fields, and signup button",
        designSystem: "material",
        layout: "form",
        includeState: true,
        includeComments: true,
      },
      profile: {
        name: "ProfileScreen",
        description:
          "Profile screen with avatar, name, email, bio, and edit button",
        designSystem: "material",
        layout: "column",
        includeState: false,
        includeComments: true,
      },
      list: {
        name: "ItemListScreen",
        description:
          "List screen with items in ListView, each with title, subtitle, and trailing icon",
        designSystem: "material",
        layout: "list",
        includeState: false,
        includeComments: true,
      },
      detail: {
        name: "DetailScreen",
        description:
          "Detail screen with header image, title, description, and action buttons",
        designSystem: "material",
        layout: "column",
        includeState: false,
        includeComments: true,
      },
      settings: {
        name: "SettingsScreen",
        description:
          "Settings screen with sections: Account, Notifications, Privacy, each with switches and navigation",
        designSystem: "material",
        layout: "list",
        includeState: true,
        includeComments: true,
      },
    };

    const patternConfig = patterns[pattern.toLowerCase()];
    if (!patternConfig) {
      throw new Error(
        `Unknown pattern: ${pattern}. Available: ${Object.keys(patterns).join(
          ", "
        )}`
      );
    }

    // Merge with user options
    const mergedOptions = { ...patternConfig, ...options };

    return this.generateMockup(mergedOptions);
  }

  /**
   * List available UI patterns
   */
  listPatterns(): string[] {
    return ["login", "signup", "profile", "list", "detail", "settings"];
  }

  /**
   * Generate complete app structure with navigation
   */
  async generateAppStructure(
    appName: string,
    screens: string[]
  ): Promise<Record<string, string>> {
    const structure: Record<string, string> = {};

    // Generate main.dart
    structure["main.dart"] = this.generateMainDart(appName, screens);

    // Generate each screen
    for (const screen of screens) {
      const mockup = await this.generatePattern(screen);
      structure[`screens/${screen}_screen.dart`] = mockup.code;
    }

    // Generate routes
    structure["config/routes.dart"] = this.generateRoutes(screens);

    return structure;
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private isValidClassName(name: string): boolean {
    // Must be UpperCamelCase and end with Screen, Page, or Widget
    return /^[A-Z][a-zA-Z0-9]*(Screen|Page|Widget)$/.test(name);
  }

  private extractComponents(description: string): string[] {
    const components: string[] = [];
    const lower = description.toLowerCase();

    // Input components
    if (
      lower.includes("text field") ||
      lower.includes("input") ||
      lower.includes("email") ||
      lower.includes("password")
    ) {
      components.push("TextField");
    }
    if (
      lower.includes("button") ||
      lower.includes("submit") ||
      lower.includes("login")
    ) {
      components.push("ElevatedButton");
    }
    if (lower.includes("checkbox")) components.push("Checkbox");
    if (lower.includes("switch")) components.push("Switch");
    if (lower.includes("slider")) components.push("Slider");

    // Display components
    if (lower.includes("list") || lower.includes("items"))
      components.push("ListView");
    if (lower.includes("grid")) components.push("GridView");
    if (lower.includes("card")) components.push("Card");
    if (
      lower.includes("image") ||
      lower.includes("avatar") ||
      lower.includes("photo")
    )
      components.push("Image");
    if (lower.includes("icon")) components.push("Icon");

    // Layout
    if (lower.includes("tabs")) components.push("TabBar");
    if (lower.includes("drawer") || lower.includes("menu"))
      components.push("Drawer");
    if (lower.includes("bottom navigation") || lower.includes("bottom nav"))
      components.push("BottomNavigationBar");
    if (
      lower.includes("app bar") ||
      lower.includes("appbar") ||
      lower.includes("toolbar")
    )
      components.push("AppBar");

    return [...new Set(components)]; // Remove duplicates
  }

  private generateImports(designSystem: string): string[] {
    const imports = ["import 'package:flutter/material.dart';"];

    if (designSystem === "cupertino" || designSystem === "adaptive") {
      imports.push("import 'package:flutter/cupertino.dart';");
    }

    return imports;
  }

  private generateStatelessWidget(
    name: string,
    description: string,
    designSystem: string,
    components: string[],
    layout: string,
    includeComments: boolean
  ): string {
    const comment = includeComments ? `/// ${description}\n` : "";

    return `${comment}class ${name} extends StatelessWidget {
  const ${name}({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${this.titleFromName(name)}'),
      ),
      body: ${this.generateBody(
        layout,
        components,
        designSystem,
        includeComments
      )},
    );
  }
}`;
  }

  private generateStatefulWidget(
    name: string,
    description: string,
    designSystem: string,
    components: string[],
    layout: string,
    includeComments: boolean
  ): string {
    const comment = includeComments ? `/// ${description}\n` : "";
    const stateName = `_${name}State`;

    return `${comment}class ${name} extends StatefulWidget {
  const ${name}({super.key});

  @override
  State<${name}> createState() => ${stateName}();
}

class ${stateName} extends State<${name}> {
  ${this.generateStateFields(components, includeComments)}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${this.titleFromName(name)}'),
      ),
      body: ${this.generateBody(
        layout,
        components,
        designSystem,
        includeComments
      )},
    );
  }
}`;
  }

  private generateStateFields(
    components: string[],
    includeComments: boolean
  ): string {
    const fields: string[] = [];

    if (components.includes("TextField")) {
      fields.push(
        includeComments ? "// Text controllers for form fields" : "",
        "final _emailController = TextEditingController();",
        "final _passwordController = TextEditingController();",
        "",
        "@override",
        "void dispose() {",
        "  _emailController.dispose();",
        "  _passwordController.dispose();",
        "  super.dispose();",
        "}",
        ""
      );
    }

    if (components.includes("Checkbox") || components.includes("Switch")) {
      fields.push(
        includeComments ? "// State for toggles" : "",
        "bool _isChecked = false;",
        ""
      );
    }

    return fields.filter((line) => line !== null).join("\n  ");
  }

  private generateBody(
    layout: string,
    components: string[],
    designSystem: string,
    includeComments: boolean
  ): string {
    switch (layout) {
      case "form":
        return this.generateFormLayout(components, includeComments);
      case "list":
        return this.generateListLayout(includeComments);
      case "grid":
        return this.generateGridLayout(includeComments);
      case "column":
      default:
        return this.generateColumnLayout(components, includeComments);
    }
  }

  private generateFormLayout(
    components: string[],
    includeComments: boolean
  ): string {
    const comment = includeComments ? "\n        // Form content" : "";

    return `Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [${comment}
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Email',
                prefixIcon: Icon(Icons.email),
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(
                labelText: 'Password',
                prefixIcon: Icon(Icons.lock),
                border: OutlineInputBorder(),
              ),
              obscureText: true,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                // TODO: Implement action
                print('Button pressed');
              },
              child: const Padding(
                padding: EdgeInsets.all(16.0),
                child: Text('Submit'),
              ),
            ),
          ],
        ),
      )`;
  }

  private generateListLayout(includeComments: boolean): string {
    const comment = includeComments ? "\n      // List of items" : "";

    return `ListView.builder(${comment}
        itemCount: 20,
        itemBuilder: (context, index) {
          return ListTile(
            leading: const CircleAvatar(
              child: Icon(Icons.person),
            ),
            title: Text('Item \${index + 1}'),
            subtitle: const Text('Subtitle text'),
            trailing: const Icon(Icons.arrow_forward_ios),
            onTap: () {
              // TODO: Handle item tap
              print('Tapped item \${index + 1}');
            },
          );
        },
      )`;
  }

  private generateGridLayout(includeComments: boolean): string {
    const comment = includeComments ? "\n      // Grid of items" : "";

    return `GridView.builder(${comment}
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 1.0,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: 20,
        itemBuilder: (context, index) {
          return Card(
            elevation: 2,
            child: InkWell(
              onTap: () {
                // TODO: Handle card tap
                print('Tapped card \${index + 1}');
              },
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.image, size: 48),
                    const SizedBox(height: 8),
                    Text('Item \${index + 1}'),
                  ],
                ),
              ),
            ),
          );
        },
      )`;
  }

  private generateColumnLayout(
    components: string[],
    includeComments: boolean
  ): string {
    const comment = includeComments ? "\n        // Content" : "";

    return `Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [${comment}
              const Icon(Icons.flutter_dash, size: 100),
              const SizedBox(height: 24),
              const Text(
                'UI Mockup',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              const Text(
                'This is a Flutter UI mockup generated by Cursor AI',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () {
                  // TODO: Implement action
                  print('Button pressed');
                },
                child: const Text('Get Started'),
              ),
            ],
          ),
        ),
      )`;
  }

  private titleFromName(name: string): string {
    // Convert "LoginScreen" to "Login"
    return name
      .replace(/(Screen|Page|Widget)$/, "")
      .replace(/([A-Z])/g, " $1")
      .trim();
  }

  private formatCode(imports: string[], code: string): string {
    return `${imports.join("\n")}\n\n${code}\n`;
  }

  private generateUsageInstructions(
    name: string,
    designSystem: string
  ): string {
    return `To use this widget:

1. Create a new file: lib/screens/${name
      .toLowerCase()
      .replace(/([A-Z])/g, "_$1")
      .slice(1)}.dart
2. Copy the generated code into the file
3. Import in your app: import 'screens/${name
      .toLowerCase()
      .replace(/([A-Z])/g, "_$1")
      .slice(1)}.dart';
4. Navigate to it: Navigator.push(context, MaterialPageRoute(builder: (context) => const ${name}()));
5. Or add to routes in MaterialApp

Design System: ${
      designSystem === "material"
        ? "Material Design (Android)"
        : designSystem === "cupertino"
        ? "Cupertino (iOS)"
        : "Adaptive"
    }

Customize:
- Modify colors, padding, and spacing as needed
- Replace placeholder text and icons
- Implement TODO actions (button onPressed, navigation, etc.)
- Add validation for form fields
- Connect to your state management solution (Provider, BLoC, etc.)`;
  }

  private generateMainDart(appName: string, screens: string[]): string {
    const title = appName.replace(/([A-Z])/g, " $1").trim();
    const imports = screens
      .map((s) => `import 'screens/${s}_screen.dart';`)
      .join("\n");

    return `import 'package:flutter/material.dart';
${imports}
import 'config/routes.dart';

void main() {
  runApp(const ${appName}App());
}

class ${appName}App extends StatelessWidget {
  const ${appName}App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${title}',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      routes: appRoutes,
      home: const ${
        screens[0].charAt(0).toUpperCase() + screens[0].slice(1)
      }Screen(),
    );
  }
}
`;
  }

  private generateRoutes(screens: string[]): string {
    const routes = screens
      .map((s) => {
        const className = `${s.charAt(0).toUpperCase() + s.slice(1)}Screen`;
        return `  '/${s}': (context) => const ${className}(),`;
      })
      .join("\n");

    const imports = screens
      .map((s) => `import '../screens/${s}_screen.dart';`)
      .join("\n");

    return `import 'package:flutter/material.dart';
${imports}

final Map<String, WidgetBuilder> appRoutes = {
${routes}
};
`;
  }
}

// Export singleton instance
export const flutterUIService = new FlutterUIMockupService();
