/**
 * Brand color palette
 */
export const COLORS = {
  primary: {
    DEFAULT: '#3b82f6', // blue-500
    light: '#60a5fa', // blue-400
    softer: '#bae6fd', // blue-200
  },
  magenta: {
    DEFAULT: '#ec4899', // pink-500
    light: '#f472b6', // pink-400
    softer: '#fce7f3', // pink-100
  },
  purple: {
    DEFAULT: '#8b5cf6', // purple-500
    light: '#a78bfa', // purple-400
    softer: '#e9d5ff', // purple-200
  },
  neutral: {
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    900: '#111827',
  },
  dark: '#0f172a',
  gray: '#9ca3af',
  light: '#f9fafb',
  white: '#ffffff',
} as const;

export type ColorKey = keyof typeof COLORS;

/**
 * Spacing units (used for padding/margin)
 */
export const SPACING = {
  sm: '8px',
  md: '16px',
  lg: '24px',
} as const;

export type SpacingKey = keyof typeof SPACING;

/**
 * Border radius options
 */
export const RADII = {
  sm: '4px',
  md: '8px',
  full: '9999px',
} as const;

export type RadiusKey = keyof typeof RADII;

/**
 * Shadow presets
 */
export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
} as const;

export type ShadowKey = keyof typeof SHADOWS;

/**
 * Export marker for isolatedModules (TSX support)
 */
export {};
