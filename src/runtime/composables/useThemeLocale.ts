// runtime/composables/useThemeLocale.ts
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useRequestHeaders } from '#app'
import type { ThemeConfig } from '../../app/types'
import { DEFAULT_LOCALE } from '../../app/constants'
import { normalizeLocale, extractFirstLocale } from '../../app/utils/normalize'

export interface UseThemeLocaleOptions {
  enabled?: boolean
  forcedLocale?: string
  defaultLocale?: string
}

export const useThemeLocale = (
  theme: ThemeConfig,
  localeCookie: Ref<string | undefined>,
  options: UseThemeLocaleOptions = {},
) => {
  const { enabled = true, forcedLocale, defaultLocale } = options
  const headers = useRequestHeaders(['accept-language'])
  const fallbackLocale = defaultLocale || DEFAULT_LOCALE

  // Detecta locale de forma consistente entre SSR e cliente
  const detectLocale = (): string => {
    // Coleta todos os locales disponíveis nas traduções
    const getAvailableLocales = (): string[] => {
      const availableLocales = new Set<string>()
      Object.values(theme.colors.themes).forEach((themeConfig) => {
        if (themeConfig.translations) {
          Object.keys(themeConfig.translations).forEach((locale) => {
            availableLocales.add(normalizeLocale(locale))
          })
        }
      })
      return Array.from(availableLocales)
    }

    // Encontra o melhor locale disponível
    const findBestLocale = (requestedLocale: string): string => {
      const availableLocales = getAvailableLocales()
      const normalized = normalizeLocale(requestedLocale)

      if (availableLocales.includes(normalized)) return normalized

      const baseLocale = normalized.split('-')[0]
      const matchingLocale = availableLocales.find(locale =>
        locale.split('-')[0] === baseLocale,
      )
      if (matchingLocale) return matchingLocale

      return fallbackLocale
    }

    // 1. Locale forçado via config
    if (forcedLocale) return findBestLocale(forcedLocale)

    // Módulo de tradução desabilitado: não detecta nem sincroniza cookie/headers
    if (!enabled) return fallbackLocale

    // 2. Cookie de idioma
    if (localeCookie.value) return findBestLocale(localeCookie.value)

    // 3. SSR: usa accept-language header
    const acceptLanguageHeader = headers['accept-language']
    if (acceptLanguageHeader) {
      const acceptLanguage = Array.isArray(acceptLanguageHeader)
        ? acceptLanguageHeader[0]
        : acceptLanguageHeader

      if (acceptLanguage) {
        const firstLocale = extractFirstLocale(acceptLanguage)
        if (firstLocale) return findBestLocale(firstLocale)
      }
    }

    // 4. Cliente: usa navigator.language
    if (import.meta.client && typeof navigator !== 'undefined') {
      return findBestLocale(navigator.language || fallbackLocale)
    }

    // 5. Fallback final
    return fallbackLocale
  }

  const currentLocale = ref<string>(detectLocale())

  // Atualiza o locale quando o cookie mudar
  watch(localeCookie, (newLocale) => {
    if (enabled && newLocale && !forcedLocale) {
      currentLocale.value = normalizeLocale(newLocale)
    }
  })

  // Função de tradução
  const translate = (translations?: Record<string, string>, fallback?: string): string => {
    if (!translations) return fallback || ''

    const locale = currentLocale.value

    if (translations[locale]) return translations[locale]

    const baseLocale = locale.split('-')[0]
    if (baseLocale && translations[baseLocale]) return translations[baseLocale]

    if (translations[fallbackLocale]) return translations[fallbackLocale]

    if (translations['en-US']) return translations['en-US']

    const firstTranslation = Object.values(translations)[0]
    if (firstTranslation) return firstTranslation

    return fallback || ''
  }

  const setLocale = (locale: string) => {
    currentLocale.value = normalizeLocale(locale)
    if (enabled && !forcedLocale) {
      localeCookie.value = normalizeLocale(locale)
    }
  }

  return {
    currentLocale,
    translate,
    setLocale,
  }
}
