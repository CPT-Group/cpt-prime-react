/**
 * Theme CSS imports for CPT Prime React
 * 
 * Import one of these themes in your application to get all required PrimeReact styles:
 * - soho-dark: Dark theme with modern Soho styling
 * - soho-light: Light theme with modern Soho styling
 * 
 * Usage:
 * ```ts
 * import '@cpt-group/cpt-prime-react/themes/soho-dark.css';
 * ```
 */

export const THEME_PATHS = {
  'soho-dark': './soho-dark.css',
  'soho-light': './soho-light.css',
} as const;

export type ThemeName = keyof typeof THEME_PATHS;

