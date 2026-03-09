/**
 * @fileoverview Aggregated CogniCore™ design token map.
 *
 * Import this single object when you need all tokens in one place,
 * or import individual token files for tree-shaking.
 */

import { colors } from './colors.js';
import { typography } from './typography.js';
import { spacing, componentSpacing } from './spacing.js';
import { breakpoints, breakpointValues } from './breakpoints.js';

/** Complete CogniCore™ token set. */
export const tokens = {
  colors,
  typography,
  spacing,
  componentSpacing,
  breakpoints,
  breakpointValues,
} as const;

export type Tokens = typeof tokens;

// Re-export constituent token modules for convenience.
export { colors } from './colors.js';
export { typography } from './typography.js';
export { spacing, componentSpacing } from './spacing.js';
export { breakpoints, breakpointValues, mediaQuery } from './breakpoints.js';
export type { Breakpoint } from './breakpoints.js';
export type { Colors } from './colors.js';
export type { Typography } from './typography.js';
export type { Spacing } from './spacing.js';
