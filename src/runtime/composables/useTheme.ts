// runtime/composables/useTheme.ts
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig } from '#app'
import themeData from '../../app/theme.json'
import type { ThemeConfig } from '../../app/types'
import { DEFAULT_THEME, DEFAULT_LOCALE } from '../../app/constants'
import { useThemeCookies } from './useThemeCookies'
import { useThemeLocale } from './useThemeLocale'
import { useThemeSeasonal } from './useThemeSeasonal'
import { useThemeColors } from './useThemeColors'

export const useTheme = () => {
  const config = useRuntimeConfig()
  const themeConfig = config.public.venixTheme

  // Garantir que colors e themes existem
  const defaultColors: ThemeConfig['colors'] = {
    enabled: true,
    defaults: true,
    defaultColor: 'dark',
    themes: {},
  }

  const theme: ThemeConfig = {
    ...themeData as ThemeConfig,
    colors: {
      ...(themeData.colors || defaultColors),
      defaultColor: themeConfig?.defaultTheme || themeData.colors?.defaultColor || DEFAULT_THEME,
      themes: {
        ...(themeData.colors?.themes || {}),
        ...(themeConfig?.colorThemes || {}),
      },
    },
  }

  const defaultTheme = theme.colors.defaultColor || DEFAULT_THEME
  const shouldApplyColors = themeConfig?.applyColors !== false && theme.colors.defaults !== false

  // Cookies
  const cookies = useThemeCookies()

  // Locale
  const locale = useThemeLocale(
    theme,
    cookies.localeCookie,
    themeConfig?.locale,
    themeConfig?.defaultLocale || DEFAULT_LOCALE,
  )

  // Temas sazonais
  const seasonal = useThemeSeasonal(theme)

  // Cores e temas
  const colors = useThemeColors(theme, locale.translate)

  // Estado de preferência
  const initialPreference = cookies.preferenceCookie.value || defaultTheme
  const preference = ref<string>(initialPreference || 'system')

  const getResolvedTheme = (pref: string): string => {
    if (pref === 'system') {
      const prefersDark = typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : true

      const seasonalTheme = seasonal.getActiveSeasonalTheme(prefersDark)
      if (seasonalTheme) return seasonalTheme

      return prefersDark ? 'dark' : 'light'
    }

    if (pref && theme.colors.themes[pref]) {
      return pref
    }

    return defaultTheme
  }

  const apply = (pref: string) => {
    if (!shouldApplyColors) return

    const resolved = getResolvedTheme(pref)

    if (typeof document !== 'undefined') {
      const html = document.documentElement
      html.classList.remove(...colors.themeValues.value)
      html.classList.add(resolved)
      html.setAttribute('data-theme', resolved)
      window.__INITIAL_THEME__ = resolved
    }
  }

  if (typeof document !== 'undefined' && shouldApplyColors) {
    const currentTheme = document.documentElement.getAttribute('data-theme')
    if (currentTheme) {
      if (!cookies.preferenceCookie.value) {
        preference.value = currentTheme
      }
    }
    else {
      apply(preference.value)
    }
  }

  onMounted(() => {
    if (!shouldApplyColors) return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (preference.value === 'system') apply('system')
    }
    mq.addEventListener('change', handleSystemThemeChange)

    const checkSeasonalChange = () => {
      const now = new Date()
      const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()

      return setTimeout(() => {
        if (preference.value === 'system') apply('system')
        checkSeasonalChange()
      }, msToMidnight + 1000)
    }

    const midnightTimeout = checkSeasonalChange()

    const handleConsentUpdate = () => {
      cookies.enablePersistence(preference.value, getResolvedTheme(preference.value))
    }
    window.addEventListener('cookie-preferences-updated', handleConsentUpdate)

    onUnmounted(() => {
      mq.removeEventListener('change', handleSystemThemeChange)
      clearTimeout(midnightTimeout)
      window.removeEventListener('cookie-preferences-updated', handleConsentUpdate)
    })
  })

  watch(preference, (newPref) => {
    if (!shouldApplyColors) return

    apply(newPref)
    cookies.enablePersistence(newPref, getResolvedTheme(newPref))
  })

  const theme_toggle = (forceTheme?: string) => {
    const newTheme = forceTheme ?? (preference.value === 'light' ? 'dark' : 'light')
    preference.value = newTheme
    cookies.enablePersistence(newTheme, getResolvedTheme(newTheme))
  }

  const theme_data = computed(() =>
    colors.themes.value.find(t => t.value === preference.value) ?? colors.themes.value[0],
  )

  const isSeasonalActive = computed(() => {
    if (preference.value !== 'system') return false
    return seasonal.getActiveSeasonalTheme() !== null
  })

  const activeSeasonalTheme = computed(() => {
    if (preference.value !== 'system') return null
    return seasonal.getActiveSeasonalTheme()
  })

  return {
    theme: {
      preference,
      value: computed(() => getResolvedTheme(preference.value)),
      isSeasonalActive,
      activeSeasonalTheme,
      shouldApplyColors,
      colors: theme.colors,
      themes: theme.colors.themes,
    },
    theme_data,
    theme_toggle,
    themes: colors.themes,
    updateThemeColors: colors.updateThemeColors,
    addTheme: colors.addTheme,
    removeTheme: colors.removeTheme,
    enablePersistence: () => cookies.enablePersistence(preference.value, getResolvedTheme(preference.value)),
    disablePersistence: cookies.disablePersistence,
    currentLocale: locale.currentLocale,
    setLocale: locale.setLocale,
  }
}
