/**
 * @fileoverview CogniCore™ responsive breakpoint tokens.
 *
 * Breakpoints follow a mobile-first approach and align with Tailwind CSS
 * defaults so the Tailwind preset can reuse them without duplication.
 *
 * All values are in pixels and should be used as `min-width` media queries.
 */

/** Breakpoint values in pixels. */
export const breakpointValues = {
  /** Small devices – landscape phones (≥ 640 px). */
  sm: 640,
  /** Medium devices – tablets (≥ 768 px). */
  md: 768,
  /** Large devices – laptops (≥ 1024 px). */
  lg: 1024,
  /** Extra-large devices – desktops (≥ 1280 px). */
  xl: 1280,
  /** 2× extra-large devices – wide screens (≥ 1536 px). */
  '2xl': 1536,
} as const;

/** Breakpoint values as CSS `px` strings for direct use in `@media` queries. */
export const breakpoints = {
  sm: `${breakpointValues.sm}px`,
  md: `${breakpointValues.md}px`,
  lg: `${breakpointValues.lg}px`,
  xl: `${breakpointValues.xl}px`,
  '2xl': `${breakpointValues['2xl']}px`,
} as const;

/** Named breakpoint keys for type-safe usage. */
export type Breakpoint = keyof typeof breakpoints;

/**
 * Returns a `min-width` media query string for a given breakpoint.
 *
 * @example
 *   mediaQuery('md') // → '@media (min-width: 768px)'
 */
export function mediaQuery(bp: Breakpoint): string {
  return `@media (min-width: ${breakpoints[bp]})`;
}
