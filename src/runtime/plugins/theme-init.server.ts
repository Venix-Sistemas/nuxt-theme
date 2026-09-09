// runtime/plugins/theme-init.server.ts
import { defineNuxtPlugin, useRuntimeConfig, useCookie, useHead } from '#app'
import themeData from '../../app/theme.json' with { type: 'json' }
import type { ThemeConfig } from '../../app/types'

export default defineNuxtPlugin({
  name: 'venix-theme-init-server',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig()
    const themeConfig = config.public.venixTheme

    const resolvedCookie = useCookie<string>('theme-resolved')
    const preferenceCookie = useCookie<string>('theme-preference')

    const theme: ThemeConfig = {
      ...themeData as ThemeConfig,
      colors: {
        ...(themeData.colors as ThemeConfig['colors']),
        defaultColor: themeConfig?.defaultTheme || (themeData.colors as ThemeConfig['colors']).defaultColor,
        themes: {
          ...(themeData.colors as ThemeConfig['colors']).themes,
          ...(themeConfig?.colorThemes || {}),
        },
      },
    }

    const defaultTheme = theme.colors.defaultColor || 'dark'
    let resolvedTheme = defaultTheme

    if (resolvedCookie.value && theme.colors.themes[resolvedCookie.value]) {
      resolvedTheme = resolvedCookie.value
    }
    else if (preferenceCookie.value && theme.colors.themes[preferenceCookie.value]) {
      resolvedTheme = preferenceCookie.value
    }

    // Aplica no SSR diretamente
    useHead({
      htmlAttrs: {
        'data-theme': resolvedTheme,
        'class': resolvedTheme,
      },
    })
  },
})
