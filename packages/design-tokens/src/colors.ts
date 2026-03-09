/**
 * @fileoverview CogniCore™ brand color palette and semantic color tokens.
 *
 * Colors are defined as hex strings and organized into:
 * - `brand`   – core identity colors
 * - `neutral` – grays used for UI surfaces and text
 * - `semantic` – contextual meaning (success, warning, error, info)
 * - `dark`    – dark-mode variants for brand colors
 */

/** Core CogniCore™ brand palette. */
export const brand = {
  /** Primary brand blue – used for main CTAs and navigation. */
  blue: '#1E3A8A',
  /** Accent purple – AI / intelligence feature highlights. */
  purple: '#6B3FA0',
  /** Confirmation green – positive actions and success states. */
  green: '#3FA34D',
  /** Rich black – body text and high-contrast surfaces. */
  black: '#1A1A1A',
  /** Gold accent – premium features and highlight badges. */
  gold: '#F2B705',
} as const;

/** Tinted light shades of each brand color (10 % opacity on white). */
export const brandLight = {
  blue: '#E8EDF8',
  purple: '#F0EAF7',
  green: '#E8F5EA',
  black: '#F0F0F0',
  gold: '#FEF8E0',
} as const;

/** Darkened variants for hover/active states. */
export const brandDark = {
  blue: '#152C6B',
  purple: '#4E2E78',
  green: '#2D7A38',
  black: '#000000',
  gold: '#C99304',
} as const;

/** Neutral gray scale – 50 (lightest) → 950 (darkest). */
export const neutral = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  950: '#030712',
} as const;

/** Semantic status colors. */
export const semantic = {
  success: '#22C55E',
  successLight: '#DCFCE7',
  successDark: '#15803D',

  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#B45309',

  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorDark: '#B91C1C',

  info: '#3B82F6',
  infoLight: '#DBEAFE',
  infoDark: '#1D4ED8',
} as const;

/** Aggregated color token map. */
export const colors = {
  brand,
  brandLight,
  brandDark,
  neutral,
  semantic,
} as const;

export type Colors = typeof colors;
