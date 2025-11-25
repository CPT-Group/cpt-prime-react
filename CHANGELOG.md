# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.5] - 2025-11-24

### Fixed
- **CRITICAL FIX**: Added `!important` flags to all CSS variable overrides to ensure they take precedence
- Used both `html:root` and `:root` selectors for maximum compatibility
- This forces the American color scheme to override Soho theme defaults
- If colors still appear purple, user may need to clear browser cache or rebuild their project

## [1.9.4] - 2025-11-24

### Fixed
- **CRITICAL FIX**: Added full color scale overrides (--p-primary-50 through --p-primary-950)
- PrimeReact themes use a full color scale system, not just base variables
- Buttons and components now properly use American colors (blue primary, red secondary)
- Overrides now include all scale values: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- Light theme: Deep patriotic blue (#1e3a8a) for primary, heroic pastel red (#f87171) for secondary
- Dark theme: Brighter blue (#3b82f6) for primary, same heroic red (#f87171) for secondary

## [1.9.3] - 2025-11-24

### Fixed
- **MAJOR FIX**: Completely rewrote themes to match PrimeReact Soho themes exactly
- Themes now import `soho-light` and `soho-dark` themes directly
- **ONLY color variables are overridden** - no custom styling, sizing, borders, transitions, or behavior changes
- Removed all custom component styling (gradients, shadows, transforms, etc.)
- Removed legacy themes (cpt-default, soho-light, soho-dark) from themes folder
- Themes now look exactly like Soho but with American colors (blue primary, heroic red secondary)

### Removed
- Legacy theme files: `cpt-default.css`, `soho-light.css`, `soho-dark.css`
- All custom component styling that changed appearance beyond colors
- Legacy theme exports from package.json

## [1.9.2] - 2025-11-24

### Fixed
- Added explicit exports for all CSS theme files to fix module resolution issues
- Some bundlers (Webpack, Vite, etc.) have trouble with wildcard patterns in exports field
- Explicit paths ensure CSS files are always resolvable: `./cpt/light-theme.css`, `./cpt/dark-theme.css`, etc.
- Wildcard patterns kept as fallback for future themes

## [1.9.1] - 2025-11-24

### Fixed
- Fixed CSS theme files not being accessible in published npm package
- CSS files are now copied to `dist/cpt/` and `dist/themes/` during build
- Updated package exports to point to `dist/cpt/*.css` and `dist/themes/*.css`
- Themes are now properly included and accessible when installing from npm

## [1.9.0] - 2025-11-24

### Added
- **New CPT American Themes**: Created dedicated light and dark themes with American patriotic color scheme
  - `cpt-light`: Light theme with heroic pastel red (#f87171), deep patriotic blue (#1e3a8a), and white
  - `cpt-dark`: Dark theme variant maintaining American color relationships
  - Import paths: `@cpt-group/cpt-prime-react/cpt/light-theme.css` and `@cpt-group/cpt-prime-react/cpt/dark-theme.css`
- **Comprehensive Theming Documentation**: Added `docs/THEMING.md` with complete theming guide including:
  - Theme architecture overview
  - CSS variables reference
  - Creating custom themes
  - Dynamic theme switching
  - Theme customization techniques
  - Best practices and troubleshooting
- **Theme Design Philosophy**: 
  - Heroic but not emergency red - softer, more approachable pastel red (#f87171)
  - Blue gradients for banners, headers, and primary elements
  - Consistent American patriotic color scheme across both themes

### Changed
- Updated `package.json` exports to support new `cpt/*` theme import paths
- Updated README with new theme documentation, usage examples, and links to comprehensive theming guide
- Enhanced theme structure with better organization (themes in `src/cpt/` directory)

### Documentation
- Added comprehensive usage examples in README showing:
  - Basic theme import and usage
  - Dark theme example
  - Complete example with multiple components (buttons, cards, panels, data tables, dialogs, tabs)
  - Quick start guide

### Technical Details
- Themes include all PrimeReact core styles, PrimeIcons, and PrimeFlex
- Comprehensive CSS variable definitions for full customization
- Blue gradient banners for headers, panels, and data tables
- Consistent styling across all components with American color scheme

## [1.0.0] - 2025-11-03

### Added
- Initial release
- 83 wrapped PrimeReact components with CPT naming
- TypeScript definitions
- Theme support:
  - `cpt-default`: Custom red, white, and blue theme with glossy styling
  - `soho-dark`: Dark theme with modern Soho styling
  - `soho-light`: Light theme with modern Soho styling
- Dual build output (CJS + ESM)

## [1.1.0] - 2025-11-03

### Added
- Custom `cpt-default` theme with red, white, and blue color scheme
- Glossy styling effects (gradients, shadows, shine animations)
- American patriotic color palette

## [1.0.0] - 2025-11-03

### Added
- Initial release
- 83 wrapped PrimeReact components with CPT naming
- TypeScript definitions
- Theme support:
  - `soho-dark`: Dark theme with modern Soho styling
  - `soho-light`: Light theme with modern Soho styling
- Dual build output (CJS + ESM)

## [1.1.1] - 2025-11-19

### Fixed
- Updated React peer dependencies to support React 17, 18, and 19 (matching PrimeReact 10.9.7 requirements)
- Changed from `>=17.0.0` to `^17.0.0 || ^18.0.0 || ^19.0.0` for better compatibility

### Added
- Comprehensive component API reference documentation (`COMPONENT_API_REFERENCE.md`)
  - Complete props documentation for all 84 components
  - Type information for each prop
  - Default values and descriptions
  - Table format for easy reference

## [Unreleased]

### Changed
- Updated peer dependencies to latest versions:
  - `primereact`: ^10.0.0 → ^10.9.7
  - `chart.js`: ^4.0.0 → ^4.5.1
  - `react`: >=16.8.0 → ^17.0.0 || ^18.0.0 || ^19.0.0 (supports React 17, 18, and 19)
  - `react-dom`: >=16.8.0 → ^17.0.0 || ^18.0.0 || ^19.0.0 (supports React 17, 18, and 19)
- Added required peer dependencies:
  - `primeicons`: ^7.0.0 (required for icon support in themes)
  - `primeflex`: ^4.0.0 (required for utility classes in themes)

### Added
- Optional peer dependencies for Chart and Editor components:
  - `chart.js` >= 4.5.1 (required for `CPTChart`)
  - `quill` >= 2.0.0 (required for `CPTEditor`)
  - `lodash-es` >= 4.17.0 (required by `quill`)
- Updated README with documentation for optional peer dependencies

### Planned
- Additional theme variants
- Component customization examples
- Migration guide for PrimeReact updates

