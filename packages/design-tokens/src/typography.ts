/**
 * @fileoverview CogniCore™ typography tokens.
 *
 * Primary typeface: Montserrat (Google Fonts).
 * Fallback stack ensures readability when the web font is unavailable.
 */

/** Font family stacks. */
export const fontFamily = {
  /** Primary UI font – Montserrat. */
  sans: [
    'Montserrat',
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(', '),

  /** Monospace – used for session codes and technical output. */
  mono: [
    '"JetBrains Mono"',
    '"Fira Code"',
    '"Fira Mono"',
    '"Roboto Mono"',
    'Menlo',
    'Monaco',
    '"Courier New"',
    'monospace',
  ].join(', '),
} as const;

/** Named font weights following Montserrat's available variants. */
export const fontWeight = {
  /** Regular body text. */
  regular: 400,
  /** Slightly emphasized text. */
  medium: 500,
  /** UI labels and subheadings. */
  semiBold: 600,
  /** Headings and strong emphasis. */
  bold: 700,
  /** Display and hero text. */
  extraBold: 800,
} as const;

/** Modular type scale – values in `rem` (base 16 px). */
export const fontSize = {
  /** 10 px – legal / micro labels. */
  '2xs': '0.625rem',
  /** 12 px – captions and helper text. */
  xs: '0.75rem',
  /** 14 px – secondary body text. */
  sm: '0.875rem',
  /** 16 px – primary body text. */
  base: '1rem',
  /** 18 px – lead / intro paragraphs. */
  lg: '1.125rem',
  /** 20 px – section subheadings. */
  xl: '1.25rem',
  /** 24 px – card headings. */
  '2xl': '1.5rem',
  /** 30 px – page subheadings. */
  '3xl': '1.875rem',
  /** 36 px – page headings. */
  '4xl': '2.25rem',
  /** 48 px – hero section headings. */
  '5xl': '3rem',
  /** 60 px – display headings. */
  '6xl': '3.75rem',
} as const;

/** Line height scale. */
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

/** Letter spacing scale. */
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

/** Aggregated typography tokens. */
export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
} as const;

export type Typography = typeof typography;
