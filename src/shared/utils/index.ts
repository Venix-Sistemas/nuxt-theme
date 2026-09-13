// src/shared/utils/index.ts
export {
  normalizeLocale,
  extractFirstLocale,
  normalizeColor,
  normalizeThemeName,
} from './normalize'
export { resolveFeatureOption } from './options'
export { resolveIcon, resolveThemeIcon } from './icon'
export type { IconKind, ResolvedIcon, ThemeIconFormat, ResolvedThemeIcon } from './icon'
export { hasCookieConsent } from './consent'
