// src/app/constants.ts

// ===== COOKIES =====
export const THEME_PREFERENCE_COOKIE = 'theme-preference'
export const THEME_RESOLVED_COOKIE = 'theme-resolved'
export const THEME_LOCALE_COOKIE = 'theme-locale'

// ===== LOCALE =====
export const DEFAULT_LOCALE = 'en-US'
export const DEFAULT_LOCALE_COOKIE_NAME = 'i18n_redirected'
export const LOCALE_MAP: Record<string, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
}

// ===== THEME =====
export const DEFAULT_THEME = 'dark'
export const SYSTEM_THEME = 'system'

// ===== COLOR PROPERTIES =====
export const COLOR_PROPERTIES = [
  'primary',
  'secondary',
  'accent',
  'error',
  'info',
  'success',
  'warning',
  'background',
  'background2',
  'background3',
] as const

// ===== NON_COLOR_PROPERTIES =====
export const NON_COLOR_PROPERTIES = [
  'dark',
  'seasonal',
  'dateRange',
  'translations',
  'icon',
] as const

// ===== CSS =====
export const CSS_HEADER = '/* ============================================ */'
