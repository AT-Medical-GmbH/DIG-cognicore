/**
 * @fileoverview CogniCore™ branding package public API.
 *
 * @example
 *   import { brand, PRODUCT_NAME, copyrightNotice } from '@cognicore/branding';
 *   import type { BrandColorName } from '@cognicore/branding';
 */

export {
  PRODUCT_NAME,
  PRODUCT_NAME_SHORT,
  PRODUCT_SLOGAN,
  COGNISELL_BRAND,
  PRODUCT_VERSION_LABEL,
  COMPANY_NAME,
  COMPANY_NAME_SHORT,
  COMPANY_WEBSITE,
  PRODUCT_WEBSITE,
  SUPPORT_EMAIL,
  PRIVACY_URL,
  TERMS_URL,
  IMPRINT_URL,
  BRAND_COLORS,
  POWERED_BY,
  SOCIAL_LINKS,
  copyrightNotice,
  brand,
} from './brand.js';

export type { BrandColorName, SocialPlatform, Brand } from './brand.js';
