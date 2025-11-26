# CPT PrimeReact Theming Guide

This comprehensive guide covers everything you need to know about theming in CPT PrimeReact, including how to use our custom American-themed light and dark themes, and how to create your own custom themes.

## Table of Contents

1. [Overview](#overview)
2. [Available Themes](#available-themes)
3. [Using Themes](#using-themes)
4. [Theme Architecture](#theme-architecture)
5. [CSS Variables Reference](#css-variables-reference)
6. [Creating Custom Themes](#creating-custom-themes)
7. [Dynamic Theme Switching](#dynamic-theme-switching)
8. [Theme Customization](#theme-customization)
9. [Best Practices](#best-practices)

## Overview

PrimeReact uses a two-layer theming architecture:

- **Core Layer**: Handles component structure, positioning, and layout (resides in PrimeReact)
- **Theme Layer**: Defines colors, spacing, typography, and visual styling (customizable)

This separation allows you to customize the look and feel of components without affecting their functionality.

### CPT Theme Design

Our CPT themes are designed for consistency across all CPT applications and feature:

- **Consistent styling** across light and dark variants
- **Professional appearance** suitable for enterprise applications
- **Full PrimeReact compatibility** with all components
- **Customizable** via CSS variables

## Available Themes

CPT PrimeReact provides two official themes:

| Theme | Description | Import Path |
|-------|-------------|-------------|
| `cpt-light` | Light theme with CPT styling | `@cpt-group/cpt-prime-react/cpt/light-theme.css` |
| `cpt-dark` | Dark theme with CPT styling | `@cpt-group/cpt-prime-react/cpt/dark-theme.css` |

## Using Themes

### Basic Import

**Important**: Import the theme CSS **ONCE** at your application's root/layout level (not in individual components). This is the same pattern as standard PrimeReact themes. The theme will apply globally to all CPT components throughout your application.

#### React (Create React App / Vite)

```tsx
// src/index.tsx or src/main.tsx
import '@cpt-group/cpt-prime-react/cpt/light-theme.css';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

#### Next.js (App Router)

```tsx
// app/layout.tsx
import '@cpt-group/cpt-prime-react/cpt/light-theme.css';
import type { Metadata } from 'next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

#### Next.js (Pages Router)

```tsx
// pages/_app.tsx
import '@cpt-group/cpt-prime-react/cpt/light-theme.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

#### React Router / Other Frameworks

```tsx
// Your root App component
import '@cpt-group/cpt-prime-react/cpt/light-theme.css';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      {/* Your routes */}
    </BrowserRouter>
  );
}
```

#### Component Usage (Anywhere in Your App)

Once the theme is imported at the root, use components anywhere without importing the theme again:

```tsx
// src/components/MyComponent.tsx
import { CPTButton, CPTInputText } from '@cpt-group/cpt-prime-react';

function MyComponent() {
  return (
    <div>
      <CPTButton label="Click Me" />
      <CPTInputText placeholder="Enter text" />
    </div>
  );
}
```

### Recommended: Light Theme

```tsx
import '@cpt-group/cpt-prime-react/cpt/light-theme.css';
```

### Recommended: Dark Theme

```tsx
import '@cpt-group/cpt-prime-react/cpt/dark-theme.css';
```

### What's Included

Each theme automatically includes:
- PrimeReact core styles
- PrimeIcons (icon font)
- PrimeFlex utility classes
- Custom CPT American-themed styling
- All CSS variables for customization

## Theme Architecture

### File Structure

```
@cpt-group/cpt-prime-react/
├── cpt/
│   ├── light-theme.css    # Light theme
│   ├── dark-theme.css     # Dark theme
│   └── fonts/             # Theme fonts
│       ├── lato-*.woff
│       └── lato-*.woff2
```

### Theme Components

Each theme file contains:

1. **Core Imports**: PrimeReact core, PrimeIcons, PrimeFlex
2. **CSS Variables**: All theme variables defined in `:root`
3. **Component Overrides**: Custom styling for specific components
4. **Gradients**: American-themed gradient definitions
5. **Shadows**: Consistent shadow system

## CSS Variables Reference

### Primary Colors

```css
--p-primary-color: #1e3a8a;              /* Deep patriotic blue */
--p-primary-contrast-color: #ffffff;      /* White text on primary */
--p-primary-color-text: #ffffff;         /* Primary text color */
```

### Secondary Colors (Heroic Red)

```css
--p-secondary-color: #f87171;             /* Heroic pastel red */
--p-secondary-contrast-color: #ffffff;    /* White text on secondary */
--p-secondary-color-text: #ffffff;       /* Secondary text color */
```

### Surface Colors

Light theme surfaces:
```css
--p-surface-0: #ffffff;                  /* Pure white */
--p-surface-50: #f8fafc;                  /* Lightest gray */
--p-surface-100: #f1f5f9;                 /* Very light gray */
--p-surface-200: #e2e8f0;                /* Light gray */
--p-surface-300: #cbd5e1;                /* Medium light gray */
--p-surface-400: #94a3b8;                /* Medium gray */
--p-surface-500: #64748b;                /* Base gray */
--p-surface-600: #475569;                /* Dark gray */
--p-surface-700: #334155;                /* Darker gray */
--p-surface-800: #1e293b;                /* Very dark gray */
--p-surface-900: #0f172a;                /* Darkest gray */
```

### Ground Colors

```css
--p-surface-ground: #ffffff;             /* Main background */
--p-surface-section: #f8fafc;            /* Section background */
--p-surface-card: #ffffff;               /* Card background */
--p-surface-overlay: #ffffff;            /* Overlay background */
--p-surface-border: #e2e8f0;             /* Border color */
--p-surface-hover: #eff6ff;              /* Hover state background */
```

### Text Colors

```css
--p-text-color: #1e293b;                 /* Primary text */
--p-text-muted-color: #64748b;           /* Muted text */
--p-text-hover-color: #1e3a8a;           /* Hover text */
--p-text-disabled-color: #cbd5e1;        /* Disabled text */
```

### Focus and Selection

```css
--p-focus-ring: 0 0 0 0.2rem rgba(30, 58, 138, 0.2);
--p-focus-ring-offset: 0;
--p-focus-ring-width: 0.2rem;
--p-highlight-bg: #dbeafe;               /* Highlight background */
--p-highlight-text-color: #1e3a8a;       /* Highlight text */
--p-selected-color: #1e3a8a;             /* Selected item color */
--p-selected-color-text: #ffffff;        /* Selected text */
```

### Shadows

```css
--p-shadow-1: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--p-shadow-2: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--p-shadow-3: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--p-shadow-4: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
```

### Border Radius

```css
--p-border-radius: 0.375rem;             /* Default radius */
--p-border-radius-sm: 0.25rem;          /* Small radius */
--p-border-radius-lg: 0.5rem;            /* Large radius */
```

### Semantic Colors

```css
--p-red-500: #f87171;                    /* Heroic red */
--p-red-600: #ef4444;                    /* Red variant */
--p-blue-500: #1e3a8a;                  /* Patriotic blue */
--p-blue-600: #1e40af;                   /* Blue variant */
--p-blue-700: #1e3a8a;                   /* Darker blue */
```

## Creating Custom Themes

### Method 1: Override CSS Variables

Create a new CSS file that imports a base theme and overrides variables:

```css
/* my-custom-theme.css */
@import '@cpt-group/cpt-prime-react/cpt/light-theme.css';

:root {
  /* Override primary color */
  --p-primary-color: #your-color;
  
  /* Override secondary color */
  --p-secondary-color: #your-color;
  
  /* Add more overrides as needed */
}
```

### Method 2: Create a Complete Theme

1. **Start with a base theme structure**:

```css
/* my-theme.css */
/* Import PrimeReact core */
@import 'primereact/resources/primereact.min.css';
@import 'primeicons/primeicons.css';
@import 'primeflex/primeflex.css';

/* Define your CSS variables */
:root {
  --p-primary-color: #your-primary;
  --p-secondary-color: #your-secondary;
  /* ... define all variables ... */
}

/* Add component-specific overrides */
.p-button {
  /* Custom button styles */
}
```

2. **Reference the CSS Variables Reference section** above to ensure you define all necessary variables.

3. **Test your theme** with all components to ensure consistency.

## Dynamic Theme Switching

**Important**: For dynamic theme switching (changing themes at runtime), the theme CSS files **must be available in your `public` folder**. This is required because PrimeReact's `changeTheme` function needs to swap the stylesheet link dynamically. If you're only using a single theme, you can import the CSS directly in your code.

### Prerequisites

According to [PrimeReact's theming documentation](https://primereact.org/theming/), there are two prerequisites for dynamic theme switching:

1. **Themes must be publicly available** under the `public` folder in your project
2. **Theme CSS must be accessible via a link element** so that the id of the link can be provided to the `changeTheme` function

### Setup

1. **Copy theme files to your public folder**:

```bash
# Copy themes from node_modules to public
mkdir -p public/themes
cp node_modules/@cpt-group/cpt-prime-react/dist/cpt/light-theme.css public/themes/
cp node_modules/@cpt-group/cpt-prime-react/dist/cpt/dark-theme.css public/themes/
cp -r node_modules/@cpt-group/cpt-prime-react/dist/cpt/fonts public/themes/
```

**Windows (PowerShell):**
```powershell
# Create themes directory
New-Item -ItemType Directory -Force -Path public\themes

# Copy theme files
Copy-Item node_modules\@cpt-group\cpt-prime-react\dist\cpt\light-theme.css public\themes\
Copy-Item node_modules\@cpt-group\cpt-prime-react\dist\cpt\dark-theme.css public\themes\
Copy-Item -Recurse node_modules\@cpt-group\cpt-prime-react\dist\cpt\fonts public\themes\
```

2. **Add theme link in your HTML**:

**React (index.html):**
```html
<!-- public/index.html -->
<link id="theme-link" rel="stylesheet" href="/themes/light-theme.css">
```

**Next.js (App Router - app/layout.tsx):**
```tsx
import Head from 'next/head';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link id="theme-link" rel="stylesheet" href="/themes/light-theme.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Next.js (Pages Router - pages/_document.tsx):**
```tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link id="theme-link" rel="stylesheet" href="/themes/light-theme.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### Implementation

```tsx
import React, { useContext, useState } from 'react';
import { PrimeReactContext } from 'primereact/api';
import { CPTButton } from '@cpt-group/cpt-prime-react';

function ThemeSwitcher() {
  const { changeTheme } = useContext(PrimeReactContext);
  const [currentTheme, setCurrentTheme] = React.useState('light-theme');

  const switchTheme = (newTheme: string) => {
    const themeMap = {
      'light': 'light-theme',
      'dark': 'dark-theme'
    };
    
    const themeName = themeMap[newTheme as keyof typeof themeMap] || newTheme;
    changeTheme(currentTheme, themeName, 'theme-link', () => {
      setCurrentTheme(themeName);
    });
  };

  return (
    <div>
      <CPTButton 
        label="Light Theme" 
        onClick={() => switchTheme('light')}
      />
      <CPTButton 
        label="Dark Theme" 
        onClick={() => switchTheme('dark')}
      />
    </div>
  );
}
```

### Next.js Implementation

For Next.js, use `next/head` or a custom `_document.tsx`:

```tsx
// _document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link id="theme-link" rel="stylesheet" href="/themes/light-theme.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

## Theme Customization

### Scoped Styling

You can customize individual components using scoped CSS:

#### Named Classes

```css
/* custom-panel.css */
.mypanel .p-panel-header {
  background-color: #07c4e8;
  color: #ffffff;
}
```

```tsx
import { CPTPanel } from '@cpt-group/cpt-prime-react';
import './custom-panel.css';

<CPTPanel header="Custom Panel" className="mypanel">
  Content here
</CPTPanel>
```

#### CSS Modules

```css
/* paneldemo.module.css */
.mypanel :global(.p-panel-header) {
  background-color: #07c4e8;
  color: #ffffff;
}
```

```tsx
import panelDemoModule from './paneldemo.module.css';

<CPTPanel header="CSS Module" className={panelDemoModule.mypanel}>
  Content here
</CPTPanel>
```

### Override Component Styles

Use CSS specificity to override theme styles:

```css
/* Override button gradient */
.my-app .p-button {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

### Scale Components

PrimeReact uses `rem` units, so you can scale all components by changing the root font size:

```css
html {
  font-size: 14px; /* Default */
  /* font-size: 16px; */ /* Larger components */
  /* font-size: 12px; */ /* Smaller components */
}
```

## Best Practices

### 1. Import Theme Once

Import the theme CSS file only once in your application entry point, not in individual components.

### 2. Use CSS Variables

Prefer overriding CSS variables over direct component class overrides for better maintainability.

### 3. Test Both Themes

If supporting both light and dark themes, test all components in both modes.

### 4. Maintain Color Contrast

Ensure sufficient contrast ratios for accessibility (WCAG AA minimum).

### 5. Use Semantic Colors

Use semantic color variables (`--p-primary-color`, `--p-secondary-color`) rather than hardcoded colors.

### 6. Leverage PrimeFlex

Use PrimeFlex utility classes for spacing, layout, and responsive design:

```tsx
<div className="flex flex-column md:flex-row justify-content-between">
  <CPTButton label="Button 1" />
  <CPTButton label="Button 2" />
</div>
```

### 7. Document Customizations

If creating a custom theme, document all variable overrides and component-specific changes.

## Additional Resources

- [PrimeReact Theming Documentation](https://primereact.org/theming/)
- [PrimeReact Colors Reference](https://primereact.org/theming/colors/)
- [PrimeReact SASS API](https://primereact.org/theming/sass-api/)
- [PrimeFlex Documentation](https://primeflex.org/)
- [PrimeIcons](https://primereact.org/icons/)

## Troubleshooting

### Theme Not Applying

1. Ensure the theme CSS is imported before component usage
2. Check that the import path is correct
3. Verify no other CSS is overriding theme variables
4. Clear browser cache and rebuild

### Variables Not Working

1. Ensure variables are defined in `:root` selector
2. Check variable names match PrimeReact conventions (`--p-*`)
3. Verify CSS specificity isn't being overridden

### Dark Theme Issues

1. Ensure all surface colors are properly defined
2. Check text contrast ratios
3. Verify overlay and modal backgrounds are dark

## Support

For theme-related issues or questions:
- Open an issue on [GitHub](https://github.com/CPT-Group/cpt-prime-react)
- Check existing issues for similar problems
- Review PrimeReact theming documentation

