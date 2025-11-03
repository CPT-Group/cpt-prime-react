# CPT Prime React

PrimeReact components wrapped with CPT naming conventions and types for easy customization.

## Overview

This package provides TypeScript React components that wrap PrimeReact components with CPT naming conventions. This abstraction layer allows you to:

- Use consistent CPT naming across your applications
- Easily customize components in the future without changing your codebase
- Maintain compatibility with PrimeReact's API while using your own component names
- Import themes easily with a single CSS import

## Installation

```bash
npm install @cpt-group/cpt-prime-react
```

### Peer Dependencies

This package requires the following peer dependencies:

- `react` >= 16.8.0
- `react-dom` >= 16.8.0
- `primereact` >= 10.0.0

Make sure these are installed in your project:

```bash
npm install react react-dom primereact
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

| Theme | Description | Import Path |
|-------|-------------|-------------|
| `cpt-default` | Custom red, white, and blue theme with glossy styling | `@cpt-group/cpt-prime-react/themes/cpt-default.css` |
| `soho-dark` | Dark theme with modern Soho styling | `@cpt-group/cpt-prime-react/themes/soho-dark.css` |
| `soho-light` | Light theme with modern Soho styling | `@cpt-group/cpt-prime-react/themes/soho-light.css` |

### Importing Themes

Import one of the provided themes to get all required PrimeReact styles:

```tsx
// CPT Default theme (red, white, and blue with glossy styling)
import '@cpt-group/cpt-prime-react/themes/cpt-default.css';

// Dark theme
import '@cpt-group/cpt-prime-react/themes/soho-dark.css';

// Light theme
import '@cpt-group/cpt-prime-react/themes/soho-light.css';
```

### Theme Structure

Themes include:
- PrimeReact core styles
- PrimeIcons
- PrimeFlex utility classes
- Custom styling and variables

### Using Themes

Import the theme CSS once in your application entry point (e.g., `App.tsx` or `index.tsx`):

```tsx
import React from 'react';
import '@cpt-group/cpt-prime-react/themes/cpt-default.css';
import { CPTButton, CPTInputText } from '@cpt-group/cpt-prime-react';

function App() {
  return (
    <div>
      <CPTButton label="Click Me" />
      <CPTInputText placeholder="Enter text" />
    </div>
  );
}
```

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

## Support

For issues, questions, or contributions, please open an issue on the [GitHub repository](https://github.com/CPT-Group/cpt-prime-react).
