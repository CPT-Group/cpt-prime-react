# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

