/**
 * @fileoverview CogniCore™ brand identity constants.
 *
 * Single source of truth for all brand strings, URLs, and color hex codes
 * referenced across apps and marketing materials.
 *
 * Import this module wherever you need to render the product name, company
 * details, or brand colors without depending on the full design-tokens package.
 */

// ---------------------------------------------------------------------------
// Product identity
// ---------------------------------------------------------------------------

/** The registered product name, including the trademark symbol. */
export const PRODUCT_NAME = 'CogniCore™' as const;

/** Short product name without the trademark symbol (for `<title>` tags etc.). */
export const PRODUCT_NAME_SHORT = 'CogniCore' as const;

/** The product's marketing tagline. */
export const PRODUCT_SLOGAN = 'Intelligence in Every Session.' as const;

/** Sub-brand for the AI assistant feature. */
export const COGNISELL_BRAND = 'CogniCell™' as const;

/** Current major product version for marketing copy (not semver). */
export const PRODUCT_VERSION_LABEL = '1.0' as const;

// ---------------------------------------------------------------------------
// Company identity
// ---------------------------------------------------------------------------

/** Legal company name. */
export const COMPANY_NAME = 'AT Medical GmbH®' as const;

/** Short form used in UI footers. */
export const COMPANY_NAME_SHORT = 'AT Medical' as const;

/** Primary company website. */
export const COMPANY_WEBSITE = 'https://atmedical.de' as const;

/** Product-specific landing page. */
export const PRODUCT_WEBSITE = 'https://cognicore.app' as const;

/** General support e-mail address. */
export const SUPPORT_EMAIL = 'support@atmedical.de' as const;

/** Privacy policy URL. */
export const PRIVACY_URL = 'https://cognicore.app/privacy' as const;

/** Terms of service URL. */
export const TERMS_URL = 'https://cognicore.app/terms' as const;

/** Imprint / legal notice URL (required under German law). */
export const IMPRINT_URL = 'https://cognicore.app/imprint' as const;

// ---------------------------------------------------------------------------
// Brand colors (hex) – mirrors design-tokens for zero-dependency usage
// ---------------------------------------------------------------------------

/**
 * Core CogniCore™ brand colors as hex strings.
 *
 * Use `@cognicore/design-tokens` for the full token set including shades,
 * semantic aliases, and Tailwind integration.
 */
export const BRAND_COLORS = {
  /** Primary blue – main CTAs and navigation. */
  blue: '#1E3A8A',
  /** Accent purple – AI / CogniCell highlights. */
  purple: '#6B3FA0',
  /** Confirmation green – positive actions. */
  green: '#3FA34D',
  /** Rich black – body text and dark surfaces. */
  black: '#1A1A1A',
  /** Gold – premium features and badges. */
  gold: '#F2B705',
  /** White – background and reversed text. */
  white: '#FFFFFF',
} as const;

export type BrandColorName = keyof typeof BRAND_COLORS;

// ---------------------------------------------------------------------------
// Copyright and legal
// ---------------------------------------------------------------------------

/** Returns the current year's copyright notice string. */
export function copyrightNotice(): string {
  return `© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.`;
}

/** Full product attribution line used in footers. */
export const POWERED_BY = `Powered by ${PRODUCT_NAME} – ${COMPANY_NAME}` as const;

// ---------------------------------------------------------------------------
// Social / external links
// ---------------------------------------------------------------------------

/** Social and external link catalogue for the product. */
export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/company/at-medical-gmbh',
  github: 'https://github.com/at-medical',
} as const;

export type SocialPlatform = keyof typeof SOCIAL_LINKS;

// ---------------------------------------------------------------------------
// Aggregated brand object
// ---------------------------------------------------------------------------

/** Aggregated brand constants for convenience imports. */
export const brand = {
  productName: PRODUCT_NAME,
  productNameShort: PRODUCT_NAME_SHORT,
  slogan: PRODUCT_SLOGAN,
  companyName: COMPANY_NAME,
  companyNameShort: COMPANY_NAME_SHORT,
  companyWebsite: COMPANY_WEBSITE,
  productWebsite: PRODUCT_WEBSITE,
  supportEmail: SUPPORT_EMAIL,
  colors: BRAND_COLORS,
  links: {
    privacy: PRIVACY_URL,
    terms: TERMS_URL,
    imprint: IMPRINT_URL,
    ...SOCIAL_LINKS,
  },
} as const;

export type Brand = typeof brand;
