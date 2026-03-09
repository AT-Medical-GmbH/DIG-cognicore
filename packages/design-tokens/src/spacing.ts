/**
 * @fileoverview CogniCore™ spacing tokens.
 *
 * Based on a 4 px base unit. Each step is named and expressed in `rem`
 * (assuming 16 px root font-size) so values remain accessible-friendly.
 *
 * Usage:
 *   padding: spacing[4]   // → '1rem' (16 px)
 *   gap:     spacing[2]   // → '0.5rem' (8 px)
 */

/** Spacing scale keyed by numeric step (1 step = 4 px). */
export const spacing = {
  /** 0 px */
  0: '0px',
  /** 1 px – hairline borders */
  px: '1px',
  /** 2 px */
  0.5: '0.125rem',
  /** 4 px */
  1: '0.25rem',
  /** 6 px */
  1.5: '0.375rem',
  /** 8 px */
  2: '0.5rem',
  /** 10 px */
  2.5: '0.625rem',
  /** 12 px */
  3: '0.75rem',
  /** 14 px */
  3.5: '0.875rem',
  /** 16 px – base unit */
  4: '1rem',
  /** 20 px */
  5: '1.25rem',
  /** 24 px */
  6: '1.5rem',
  /** 28 px */
  7: '1.75rem',
  /** 32 px */
  8: '2rem',
  /** 36 px */
  9: '2.25rem',
  /** 40 px */
  10: '2.5rem',
  /** 44 px */
  11: '2.75rem',
  /** 48 px */
  12: '3rem',
  /** 56 px */
  14: '3.5rem',
  /** 64 px */
  16: '4rem',
  /** 80 px */
  20: '5rem',
  /** 96 px */
  24: '6rem',
  /** 112 px */
  28: '7rem',
  /** 128 px */
  32: '8rem',
  /** 144 px */
  36: '9rem',
  /** 160 px */
  40: '10rem',
  /** 192 px */
  48: '12rem',
  /** 224 px */
  56: '14rem',
  /** 256 px */
  64: '16rem',
  /** 288 px */
  72: '18rem',
  /** 320 px */
  80: '20rem',
  /** 384 px */
  96: '24rem',
} as const;

/** Component-specific semantic spacing aliases. */
export const componentSpacing = {
  /** Internal padding for compact buttons/tags. */
  buttonSm: spacing[2],
  /** Internal padding for default buttons. */
  buttonMd: spacing[4],
  /** Internal padding for large buttons. */
  buttonLg: spacing[6],

  /** Card internal padding. */
  cardPadding: spacing[6],
  /** Gap between cards in a grid. */
  cardGap: spacing[4],

  /** Section vertical rhythm. */
  sectionGap: spacing[16],
  /** Outer page margin on mobile. */
  pagePaddingMobile: spacing[4],
  /** Outer page margin on desktop. */
  pagePaddingDesktop: spacing[8],
} as const;

export type Spacing = typeof spacing;
