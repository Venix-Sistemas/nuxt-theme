// runtime/plugins/theme-init.client.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import themeData from '../../app/theme.json'
import type { ThemeConfig } from '../../app/types'

declare global {
    interface Window {
        __INITIAL_THEME__?: string
        __INITIAL_LOCALE__?: string
    }
}

export default defineNuxtPlugin({
    name: 'venix-theme-init',
    enforce: 'pre',
    setup() {
        const config = useRuntimeConfig()
        const themeConfig = config.public.venixTheme

        const theme: ThemeConfig = {
            ...themeData as ThemeConfig,
            colors: {
                ...(themeData.colors as ThemeConfig['colors']),
                defaultColor: themeConfig?.defaultTheme || (themeData.colors as ThemeConfig['colors']).defaultColor,
                themes: {
                    ...(themeData.colors as ThemeConfig['colors']).themes,
                    ...(themeConfig?.colorThemes || {})
                }
            }
        }

        const html = document.documentElement
        const defaultTheme = theme.colors.defaultColor || 'dark'
        let resolvedTheme = defaultTheme

        // Tenta pegar tema salvo
        try {
            const savedTheme = localStorage.getItem('theme-preference')
            if (savedTheme && theme.colors.themes[savedTheme]) {
                resolvedTheme = savedTheme
            }
        } catch (e) {
            // localStorage indisponível
        }

        // Aplica o tema ANTES da hidratação
        html.setAttribute('data-theme', resolvedTheme)
        html.classList.add(resolvedTheme)
        window.__INITIAL_THEME__ = resolvedTheme
    }
})