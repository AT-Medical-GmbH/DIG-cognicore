/**
 * @fileoverview CogniCore™ Tailwind CSS preset.
 *
 * Extend your `tailwind.config.ts` with this preset to automatically gain
 * access to all brand colors, the Montserrat font, and custom utilities.
 *
 * @example
 *   // tailwind.config.ts
 *   import { cognicorePreset } from '@cognicore/design-tokens/tailwind-preset';
 *   export default { presets: [cognicorePreset] };
 */

import { brand, brandLight, brandDark, neutral, semantic } from './colors.js';
import { fontFamily, fontWeight, fontSize, lineHeight, letterSpacing } from './typography.js';
import { breakpointValues } from './breakpoints.js';
import { spacing } from './spacing.js';

// We use `object` here because Tailwind's Config type lives in the consumer's
// project; importing it would create a hard dependency on tailwindcss.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TailwindPreset = Record<string, any>;

/** CogniCore™ Tailwind CSS preset. */
export const cognicorePreset: TailwindPreset = {
  theme: {
    extend: {
      colors: {
        brand: {
          blue: brand.blue,
          'blue-light': brandLight.blue,
          'blue-dark': brandDark.blue,

          purple: brand.purple,
          'purple-light': brandLight.purple,
          'purple-dark': brandDark.purple,

          green: brand.green,
          'green-light': brandLight.green,
          'green-dark': brandDark.green,

          black: brand.black,
          'black-light': brandLight.black,

          gold: brand.gold,
          'gold-light': brandLight.gold,
          'gold-dark': brandDark.gold,
        },
        neutral,
        success: {
          DEFAULT: semantic.success,
          light: semantic.successLight,
          dark: semantic.successDark,
        },
        warning: {
          DEFAULT: semantic.warning,
          light: semantic.warningLight,
          dark: semantic.warningDark,
        },
        error: {
          DEFAULT: semantic.error,
          light: semantic.errorLight,
          dark: semantic.errorDark,
        },
        info: {
          DEFAULT: semantic.info,
          light: semantic.infoLight,
          dark: semantic.infoDark,
        },
      },

      fontFamily: {
        sans: fontFamily.sans.split(',').map((f) => f.trim()),
        mono: fontFamily.mono.split(',').map((f) => f.trim()),
      },

      fontWeight: {
        regular: String(fontWeight.regular),
        medium: String(fontWeight.medium),
        semibold: String(fontWeight.semiBold),
        bold: String(fontWeight.bold),
        extrabold: String(fontWeight.extraBold),
      },

      fontSize: {
        '2xs': fontSize['2xs'],
        xs: fontSize.xs,
        sm: fontSize.sm,
        base: fontSize.base,
        lg: fontSize.lg,
        xl: fontSize.xl,
        '2xl': fontSize['2xl'],
        '3xl': fontSize['3xl'],
        '4xl': fontSize['4xl'],
        '5xl': fontSize['5xl'],
        '6xl': fontSize['6xl'],
      },

      lineHeight,

      letterSpacing,

      spacing,

      screens: {
        sm: `${breakpointValues.sm}px`,
        md: `${breakpointValues.md}px`,
        lg: `${breakpointValues.lg}px`,
        xl: `${breakpointValues.xl}px`,
        '2xl': `${breakpointValues['2xl']}px`,
      },

      borderRadius: {
        none: '0px',
        sm: '0.125rem',
        DEFAULT: '0.375rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },

      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        /** Branded glow for primary interactive elements. */
        brand: `0 0 0 3px ${brandLight.blue}`,
      },

      animation: {
        /** Subtle pulse for loading states. */
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        /** Slide-in from bottom for toasts/modals. */
        'slide-up': 'slideUp 0.2s ease-out',
        /** Fade-in for overlays. */
        'fade-in': 'fadeIn 0.15s ease-out',
      },

      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },

  plugins: [],
} satisfies TailwindPreset;

export default cognicorePreset;
