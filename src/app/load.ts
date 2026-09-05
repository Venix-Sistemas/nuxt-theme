// src/app/load.ts
import defaultTheme from './theme.json'
import type { ThemeConfig } from './types'

export function loadTheme(path?: string): ThemeConfig {
    if (path) {
        // Tenta carregar o tema customizado do playground
        try {
            // O path pode ser relativo ao playground
            const customTheme = require(path) as ThemeConfig
            return customTheme
        } catch (e) {
            console.warn(`Could not load custom theme from ${path}, using default theme`)
            return defaultTheme as ThemeConfig
        }
    }

    return defaultTheme as ThemeConfig
}
export function extractLocales(theme: ThemeConfig): string[] {
    const locales = new Set<string>()

    Object.values(theme.colors?.themes || {}).forEach(themeConfig => {
        if (themeConfig.translations) {
            Object.keys(themeConfig.translations).forEach(locale => {
                locales.add(locale)
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

    return 'en-US'
}