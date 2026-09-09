import defaultTheme from '../../app/theme.json' with { type: 'json' }
import type { ThemeConfig } from '../types'
import { DEFAULT_LOCALE } from '../constants'
import { normalizeLocale } from './normalize'

export function loadTheme(_path?: string): ThemeConfig {
  // TODO: Implementar carregamento de tema customizado
  return defaultTheme as ThemeConfig
}

export function extractLocales(theme: ThemeConfig): string[] {
  const locales = new Set<string>()

  Object.values(theme.colors?.themes || {}).forEach((themeConfig) => {
    if (themeConfig.translations) {
      Object.keys(themeConfig.translations).forEach((locale) => {
        locales.add(normalizeLocale(locale))
      })
    }
  })

  return Array.from(locales)
}

export function getDefaultLocale(theme: ThemeConfig): string {
  const locales = extractLocales(theme)

  if (locales.includes('en-US')) return 'en-US'

  const firstLocale = locales[0]
  if (firstLocale) return firstLocale

  return DEFAULT_LOCALE
}
