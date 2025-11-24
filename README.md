# CPT Prime React

PrimeReact components wrapped with CPT naming conventions and types for easy customization.

## Overview

This package provides TypeScript React components that wrap PrimeReact components with CPT naming conventions. This abstraction layer allows you to:

- Use consistent CPT naming across your applications
- Easily customize components in the future without changing your codebase
- Maintain compatibility with PrimeReact's API while using your own component names
- Import themes easily with a single CSS import

## Installation

Install the latest version:

```bash
npm install @cpt-group/cpt-prime-react
# or explicitly
npm install @cpt-group/cpt-prime-react@latest
```

Install a specific version:

```bash
npm install @cpt-group/cpt-prime-react@1.9.0
```

Install with version range:

```bash
npm install @cpt-group/cpt-prime-react@^1.9.0
```

### Peer Dependencies

This package requires the following peer dependencies:

**Required:**
- `react` >= 16.8.0
- `react-dom` >= 16.8.0
- `primereact` >= 10.0.0

**Optional (for specific components):**
- `chart.js` >= 4.0.0 (required for `CPTChart` component)
- `quill` >= 2.0.0 (required for `CPTEditor` component)
- `lodash-es` >= 4.17.0 (required by `quill`)

Make sure these are installed in your project:

```bash
# Required dependencies
npm install react react-dom primereact

# Optional dependencies (if using Chart or Editor components)
npm install chart.js quill lodash-es
```

## Usage

### Basic Component Usage

Import components from the main package:

```tsx
import { CPTButton, CPTInputText, CPTDataTable } from '@cpt-group/cpt-prime-react';

function MyComponent() {
  return (
    <div>
      <CPTInputText value="Hello" onChange={(e) => console.log(e.target.value)} />
      <CPTButton label="Click Me" />
      <CPTDataTable value={data} />
    </div>
  );
}
```

### Component Props

All components maintain the same props interface as their PrimeReact counterparts, prefixed with `CPT`:

```tsx
import { CPTButton, CPTButtonProps } from '@cpt-group/cpt-prime-react';

// CPTButtonProps is the same as ButtonProps from PrimeReact
const buttonProps: CPTButtonProps = {
  label: 'Submit',
  icon: 'pi pi-check',
  onClick: () => console.log('Clicked'),
};
```

### TypeScript Types

All component props are exported with `CPT` prefix:

```tsx
import type {
  CPTButtonProps,
  CPTInputTextProps,
  CPTDataTableProps,
  // ... all other component types
} from '@cpt-group/cpt-prime-react';
```

### Generic Components

Some components like `CPTDataTable` support generics:

```tsx
import { CPTDataTable, CPTDataTableProps } from '@cpt-group/cpt-prime-react';

interface MyDataType {
  id: number;
  name: string;
}

const data: MyDataType[] = [{ id: 1, name: 'Item 1' }];

<CPTDataTable<MyDataType> value={data} />
```

### Components with Refs

Some components use `forwardRef` and can accept refs:

```tsx
import { useRef } from 'react';
import { CPTToast } from '@cpt-group/cpt-prime-react';
import type { Toast } from 'primereact/toast';

function MyComponent() {
  const toastRef = useRef<Toast>(null);
  
  return (
    <>
      <CPTToast ref={toastRef} />
      <button onClick={() => toastRef.current?.show({ severity: 'success', summary: 'Success' })}>
        Show Toast
      </button>
    </>
  );
}
```

## Theming

### Available Themes

#### Recommended CPT American Themes

| Theme | Description | Import Path |
|-------|-------------|-------------|
| `cpt-light` | Light theme with American red, white, and blue colors | `@cpt-group/cpt-prime-react/cpt/light-theme.css` |
| `cpt-dark` | Dark theme with American red, white, and blue colors | `@cpt-group/cpt-prime-react/cpt/dark-theme.css` |

#### Legacy Themes

| Theme | Description | Import Path |
|-------|-------------|-------------|
| `cpt-default` | Legacy default theme (same as light) | `@cpt-group/cpt-prime-react/themes/cpt-default.css` |
| `soho-dark` | Dark theme with modern Soho styling | `@cpt-group/cpt-prime-react/themes/soho-dark.css` |
| `soho-light` | Light theme with modern Soho styling | `@cpt-group/cpt-prime-react/themes/soho-light.css` |

### Importing Themes

**Important**: Import the theme CSS **ONCE** at your application's root/layout level (not in individual components), just like standard PrimeReact themes. The theme will apply globally to all CPT components.

#### Import Paths

```tsx
// Recommended: CPT Light theme (American red, white, and blue)
import '@cpt-group/cpt-prime-react/cpt/light-theme.css';

// Recommended: CPT Dark theme (American red, white, and blue)
import '@cpt-group/cpt-prime-react/cpt/dark-theme.css';

// Legacy themes
import '@cpt-group/cpt-prime-react/themes/cpt-default.css';
import '@cpt-group/cpt-prime-react/themes/soho-dark.css';
import '@cpt-group/cpt-prime-react/themes/soho-light.css';
```

#### Where to Import

**React (Create React App / Vite):**
```tsx
// src/index.tsx or src/main.tsx
import '@cpt-group/cpt-prime-react/cpt/light-theme.css';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

**Next.js:**
```tsx
// app/layout.tsx (App Router) or pages/_app.tsx (Pages Router)
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

**React Router / Other Frameworks:**
```tsx
// Your root App component or layout component
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

### Theme Features

The CPT American themes feature:
- **Primary Colors**: Deep patriotic blue (#1e3a8a, #1e40af) for primary actions and headers
- **Secondary Colors**: Heroic pastel red (#f87171, #ef4444) - not emergency red, but a softer, more approachable red
- **Accent Colors**: White and light grays for backgrounds and surfaces
- **Gradients**: Blue gradients for banners, headers, and primary elements
- **Dark Theme**: Darker variants maintaining the same color relationships

For comprehensive theming documentation, see [docs/THEMING.md](./docs/THEMING.md).

### Theme Structure

Themes include:
- PrimeReact core styles
- PrimeIcons
- PrimeFlex utility classes
- Custom styling and variables

### Using Themes

#### Basic Usage Example

**Step 1**: Import the theme once at your app root (e.g., `src/index.tsx`, `app/layout.tsx`, or `pages/_app.tsx`):

```tsx
// src/index.tsx (or your root file)
import '@cpt-group/cpt-prime-react/cpt/light-theme.css';
```

**Step 2**: Use components anywhere in your app - they'll automatically use the theme:

```tsx
// src/components/MyComponent.tsx
import { CPTButton, CPTInputText, CPTCard, CPTPanel } from '@cpt-group/cpt-prime-react';

function MyComponent() {
  return (
    <div>
      <CPTCard title="Welcome">
        <p>This is using the CPT Light theme with American colors!</p>
        <CPTButton label="Primary Button" />
        <CPTButton label="Secondary Button" className="p-button-secondary" />
        <CPTInputText placeholder="Enter text here" />
      </CPTCard>
      
      <CPTPanel header="Panel with Blue Gradient Header">
        <p>Panels and cards feature blue gradient banners with American colors.</p>
      </CPTPanel>
    </div>
  );
}
```

#### Dark Theme Example

**Import once at root:**
```tsx
// src/index.tsx
import '@cpt-group/cpt-prime-react/cpt/dark-theme.css';
```

**Use components anywhere:**
```tsx
// src/components/DataTableExample.tsx
import { CPTButton, CPTDataTable, CPTColumn } from '@cpt-group/cpt-prime-react';

function DataTableExample() {
  const data = [
    { id: 1, name: 'Item 1', status: 'Active' },
    { id: 2, name: 'Item 2', status: 'Inactive' },
  ];

  return (
    <div>
      <CPTButton label="Click Me" />
      <CPTDataTable 
        value={data} 
        header="Data Table with Blue Gradient Header"
      >
        <CPTColumn field="name" header="Name" />
        <CPTColumn field="status" header="Status" />
      </CPTDataTable>
    </div>
  );
}
```

#### Complete Example with Multiple Components

**Theme import (once at root):**
```tsx
// src/index.tsx
import '@cpt-group/cpt-prime-react/cpt/light-theme.css';
```

**Component usage (anywhere in your app):**
```tsx
// src/components/Demo.tsx
import React, { useState } from 'react';
import {
  CPTButton,
  CPTInputText,
  CPTCard,
  CPTPanel,
  CPTDataTable,
  CPTColumn,
  CPTDialog,
  CPTToast,
  CPTTabView,
  CPTTabPanel,
} from '@cpt-group/cpt-prime-react';

function Demo() {
  const [visible, setVisible] = useState(false);
  const toast = React.useRef(null);

  const showToast = () => {
    toast.current?.show({
      severity: 'info',
      summary: 'Success',
      detail: 'Theme is working perfectly!',
    });
  };

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return (
    <div className="p-4">
      <CPTCard title="CPT American Theme Demo">
        <div className="flex flex-column gap-3">
          <CPTButton 
            label="Primary Button (Blue Gradient)" 
            onClick={showToast}
          />
          <CPTButton 
            label="Secondary Button (Heroic Red)" 
            className="p-button-secondary"
          />
          
          <CPTInputText placeholder="Enter your name" />
          
          <CPTButton 
            label="Open Dialog" 
            onClick={() => setVisible(true)}
          />
        </div>
      </CPTCard>

      <CPTPanel header="Panel with Blue Gradient Banner" className="mt-4">
        <p>This panel header features a beautiful blue gradient banner.</p>
      </CPTPanel>

      <CPTDataTable 
        value={data} 
        header="Data Table with Blue Gradient Header"
        className="mt-4"
      >
        <CPTColumn field="name" header="Name" />
        <CPTColumn field="email" header="Email" />
      </CPTDataTable>

      <CPTTabView className="mt-4">
        <CPTTabPanel header="Tab 1">
          <p>Active tabs have blue gradient backgrounds.</p>
        </CPTTabPanel>
        <CPTTabPanel header="Tab 2">
          <p>Content for tab 2</p>
        </CPTTabPanel>
      </CPTTabView>

      <CPTDialog
        header="Dialog with Blue Gradient Header"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: '50vw' }}
      >
        <p>Dialogs feature blue gradient headers matching the American theme.</p>
      </CPTDialog>

      <CPTToast ref={toast} />
    </div>
  );
}

export default Demo;
```

### Comprehensive Theming Guide

For detailed information about:
- Creating custom themes
- Dynamic theme switching
- CSS variables reference
- Theme customization
- Best practices

See the [Complete Theming Guide](./docs/THEMING.md).

### Quick Start Example

**Step 1**: Import the theme **once** at your application root (e.g., `src/index.tsx`, `app/layout.tsx`):

```tsx
// src/index.tsx (or your root file)
import '@cpt-group/cpt-prime-react/cpt/light-theme.css';
```

**Step 2**: Import and use components anywhere in your app:

```tsx
// src/components/MyComponent.tsx
import { CPTButton, CPTInputText } from '@cpt-group/cpt-prime-react';

function MyComponent() {
  return (
    <>
      <CPTButton label="Click Me" />
      <CPTInputText placeholder="Enter text" />
    </>
  );
}
```

That's it! The theme automatically styles all CPT components globally with the American color scheme. You only need to import the theme once at the root level, just like standard PrimeReact themes.

## Components

All major PrimeReact components are available with CPT naming:

### Form Components
- `CPTInputText` - Text input
- `CPTInputTextarea` - Textarea
- `CPTInputNumber` - Number input
- `CPTInputMask` - Masked input
- `CPTInputSwitch` - Toggle switch
- `CPTButton` - Button
- `CPTButtonGroup` - Button group
- `CPTSplitButton` - Split button
- `CPTToggleButton` - Toggle button
- `CPTCheckbox` - Checkbox
- `CPTTriStateCheckbox` - Tri-state checkbox
- `CPTRadioButton` - Radio button
- `CPTDropdown` - Dropdown
- `CPTMultiSelect` - Multi-select dropdown
- `CPTAutoComplete` - Autocomplete
- `CPTCalendar` - Calendar/Date picker
- `CPTChips` - Chips input
- `CPTColorPicker` - Color picker
- `CPTEditor` - Rich text editor
- `CPTFileUpload` - File upload
- `CPTKnob` - Knob control
- `CPTPassword` - Password input
- `CPTRating` - Rating
- `CPTSelectButton` - Select button
- `CPTSlider` - Slider
- `CPTTreeSelect` - Tree select

### Data Display
- `CPTDataTable` - Data table
- `CPTDataView` - Data view
- `CPTDataViewLayoutOptions` - Data view layout options
- `CPTTreeTable` - Tree table
- `CPTColumn` - Table column
- `CPTColumnGroup` - Table column group
- `CPTChart` - Chart
- `CPTProgressBar` - Progress bar
- `CPTProgressSpinner` - Progress spinner
- `CPTSkeleton` - Loading skeleton
- `CPTTag` - Tag
- `CPTChip` - Chip
- `CPTCard` - Card
- `CPTPanel` - Panel
- `CPTFieldset` - Fieldset
- `CPTDivider` - Divider
- `CPTAccordion` - Accordion
- `CPTAccordionTab` - Accordion tab
- `CPTTabView` - Tab view
- `CPTTabPanel` - Tab panel
- `CPTTimeline` - Timeline
- `CPTOrganizationChart` - Organization chart

### Overlay Components
- `CPTDialog` - Dialog/Modal
- `CPTSidebar` - Sidebar
- `CPTOverlayPanel` - Overlay panel
- `CPTConfirmDialog` - Confirm dialog
- `CPTConfirmPopup` - Confirm popup
- `CPTTooltip` - Tooltip
- `CPTBlockUI` - Block UI overlay

### Menu Components
- `CPTMenu` - Context menu
- `CPTContextMenu` - Context menu
- `CPTTieredMenu` - Tiered menu
- `CPTSlideMenu` - Slide menu
- `CPTMegaMenu` - Mega menu
- `CPTMenubar` - Menubar
- `CPTPanelMenu` - Panel menu
- `CPTDock` - Dock menu

### Navigation
- `CPTBreadcrumb` - Breadcrumb
- `CPTSteps` - Steps indicator

### Media
- `CPTImage` - Image
- `CPTGalleria` - Gallery
- `CPTCarousel` - Carousel

### Messages
- `CPTMessage` - Message
- `CPTToast` - Toast notifications

### Misc
- `CPTTerminal` - Terminal component
- `CPTSplitter` - Splitter
- `CPTSplitterPanel` - Splitter panel
- `CPTVirtualScroller` - Virtual scroller
- `CPTSpeedDial` - Speed dial
- `CPTMeterGroup` - Meter group
- `CPTInplace` - Inplace editor
- `CPTInplaceDisplay` - Inplace display
- `CPTInplaceContent` - Inplace content

### Layout
- `CPTRow` - Row
- `CPTAvatar` - Avatar
- `CPTAvatarGroup` - Avatar group
- `CPTSkeleton` - Skeleton loader

## PrimeReact Version Compatibility

This package is compatible with PrimeReact `^10.0.0`. When updating PrimeReact, check the [PrimeReact changelog](https://github.com/primefaces/primereact/blob/master/CHANGELOG.md) for breaking changes.

### Updating PrimeReact

1. Update PrimeReact in your project:
   ```bash
   npm install primereact@latest
   ```

2. Test your application thoroughly
3. Check this package's CHANGELOG for any component updates

## Customization

Since all components are simple wrappers around PrimeReact components, you can customize them by:

1. Modifying the component files in this package
2. Extending components in your own codebase
3. Using PrimeReact's theming system to customize styles

## Development

### Building the Package

```bash
npm run build
```

This will:
- Clean the dist folder
- Build CommonJS output (`dist/cjs/`)
- Build ES Modules output (`dist/esm/`)
- Generate TypeScript declarations (`dist/types/`)

### Development Mode

Watch mode for development:

```bash
npm run watch
```

### Type Checking

```bash
npm run typecheck
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT

## Known Issues

Some components with nested parent-child relationships (like Accordion/AccordionTab and TabView/TabPanel) may not work correctly when wrapped. See [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) for details and workarounds.

## Support

For issues, questions, or contributions, please open an issue on the [GitHub repository](https://github.com/CPT-Group/cpt-prime-react).
