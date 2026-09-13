// src/shared/constants.ts

// ===== COOKIES =====
export const THEME_PREFERENCE_COOKIE = 'venix-theme-preference'
export const THEME_RESOLVED_COOKIE = 'venix-theme-resolved'
export const THEME_LOCALE_COOKIE = 'venix-theme-locale'

// ===== EVENTS =====
export const COOKIE_PREFERENCES_UPDATED_EVENT = 'venix-cookie-preferences-updated'

// ===== LOCAL STORAGE =====
/** Lido (nunca escrito) por este módulo — a UI de consentimento de cookies do app consumidor grava aqui. */
export const COOKIE_CONSENT_STORAGE_KEY = 'venix-cookie-consent'

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
