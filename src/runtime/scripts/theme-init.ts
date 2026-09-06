// runtime/scripts/theme-init.ts
import type { ThemeConfig, ThemeColors } from '../../app/types'

declare global {
  interface Window {
    __INITIAL_THEME__?: string
    __INITIAL_LOCALE__?: string
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'))
  const cookieValue = match?.[2]

  return cookieValue ? decodeURIComponent(cookieValue) : null
}

function hasConsent(): boolean {
  const consentData = localStorage.getItem('cookie-consent')
  if (!consentData) return false

  try {
    const consent = JSON.parse(consentData)
    return consent.functionality === true
  }
  catch {
    return false
  }
}

function setCookieIfConsented(name: string, value: string): void {
  if (hasConsent()) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`
  }
}

function isSeasonalTheme(themeConfig: ThemeColors): boolean {
  return themeConfig.seasonal === true && !!themeConfig.dateRange
}

function isColorTheme(themeConfig: ThemeColors | undefined): boolean {
  if (!themeConfig) return false
  return !!themeConfig.primary || !!themeConfig.background
}

// Detecta o locale do navegador
function detectLocale(): string {
  if (typeof navigator !== 'undefined') {
    return navigator.language || 'en-US'
  }
  return 'en-US'
}

export default function initTheme(themeData: ThemeConfig): void {
  const html = document.documentElement

  // Detecta e salva o locale
  const savedLocale = getCookie('theme-locale')
  const locale = savedLocale || detectLocale()
  window.__INITIAL_LOCALE__ = locale

  // Só salva cookie se tiver consentimento e não existir cookie
  if (!savedLocale) {
    setCookieIfConsented('theme-locale', locale)
  }

  const defaultTheme: string = themeData.colors?.defaultColor || 'dark'
  const preference = getCookie('theme-preference')
  const resolved = getCookie('theme-resolved')
  let theme: string

  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

  if (resolved && isColorTheme(themeData.colors?.themes?.[resolved])) {
    theme = resolved
  }
  else if (preference === 'system') {
    theme = systemPrefersDark ? 'dark' : 'light'

    if (themeData?.colors?.themes) {
      const now = new Date()
      const month = now.getMonth() + 1
      const day = now.getDate()
      const current = month * 100 + day

      for (const [themeName, config] of Object.entries(themeData.colors.themes)) {
        if (themeName === 'system') continue
        if (!isColorTheme(config)) continue
        if (!isSeasonalTheme(config) || !config.dateRange) continue

        const startParts = config.dateRange.start.split('-').map(Number)
        const endParts = config.dateRange.end.split('-').map(Number)

        if (startParts.length !== 2 || endParts.length !== 2) continue

        const startMonth = startParts[0]
        const startDay = startParts[1]
        const endMonth = endParts[0]
        const endDay = endParts[1]

        if (startMonth === undefined || startDay === undefined
          || endMonth === undefined || endDay === undefined) continue

        const startNum = startMonth * 100 + startDay
        const endNum = endMonth * 100 + endDay

        const inRange = startNum <= endNum
          ? current >= startNum && current <= endNum
          : current >= startNum || current <= endNum

        if (inRange && config.dark === systemPrefersDark) {
          theme = themeName
          break
        }
      }
    }
  }
  else if (preference && isColorTheme(themeData.colors?.themes?.[preference])) {
    theme = preference
  }
  else {
    theme = defaultTheme
  }

  if (!isColorTheme(themeData.colors?.themes?.[theme])) {
    theme = defaultTheme
  }

  if (!isColorTheme(themeData.colors?.themes?.[theme])) {
    theme = 'dark'
  }

  html.classList.add(theme)
  html.setAttribute('data-theme', theme)
  window.__INITIAL_THEME__ = theme

  if (!resolved || resolved !== theme) {
    setCookieIfConsented('theme-resolved', theme)
  }

  if (!preference) {
    setCookieIfConsented('theme-preference', theme)
  }
}
