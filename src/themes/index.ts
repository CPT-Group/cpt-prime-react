/**
 * Theme CSS imports for CPT Prime React
 * 
 * Import one of these themes in your application to get all required PrimeReact styles:
 * - cpt-default: Custom red, white, and blue theme with glossy styling
 * - soho-dark: Dark theme with modern Soho styling
 * - soho-light: Light theme with modern Soho styling
 * 
 * Usage:
 * ```ts
 * import '@cpt-group/cpt-prime-react/themes/cpt-default.css';
 * ```
 */

export const THEME_PATHS = {
  'cpt-default': './cpt-default.css',
  'soho-dark': './soho-dark.css',
  'soho-light': './soho-light.css',
} as const;

export type ThemeName = keyof typeof THEME_PATHS;

