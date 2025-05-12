/**
 * Font sizes in px
 */
export const FONT_SIZES = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  md: '18px',
  lg: '20px',
  xl: '24px',
  '2xl': '28px',
  '3xl': '32px',
  '4xl': '36px',
} as const;

export type FontSizeKey = keyof typeof FONT_SIZES;

/**
 * Font weight values
 */
export const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export type FontWeightKey = keyof typeof FONT_WEIGHTS;

/**
 * Line height presets
 */
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  loose: 1.75,
} as const;

export type LineHeightKey = keyof typeof LINE_HEIGHTS;

/**
 * Font family stacks
 */
export const FONT_FAMILIES = {
  body: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
  heading: `'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
} as const;

export type FontFamilyKey = keyof typeof FONT_FAMILIES;

/**
 * Export marker for isolatedModules
 */
export {};
