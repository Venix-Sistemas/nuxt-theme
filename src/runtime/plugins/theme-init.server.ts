// runtime/plugins/theme-init.server.ts
import { defineNuxtPlugin, useRuntimeConfig, useCookie, useHead } from '#app'
import themeData from '../../shared/theme.json' with { type: 'json' }
import type { ThemeConfig } from '../../shared/types'
import { THEME_PREFERENCE_COOKIE, THEME_RESOLVED_COOKIE, DEFAULT_LOCALE_COOKIE_NAME, DEFAULT_LOCALE } from '../../shared/constants'
import { useThemeLocale } from '../composables/useThemeLocale'

export default defineNuxtPlugin({
  name: 'venix-theme-init-server',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig()
    const themeConfig = config.public.venixTheme

    const resolvedCookie = useCookie<string>(THEME_RESOLVED_COOKIE)
    const preferenceCookie = useCookie<string>(THEME_PREFERENCE_COOKIE)

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

    const htmlAttrs: Record<string, string> = {
      'data-theme': resolvedTheme,
      'class': resolvedTheme,
    }

    // `lang` precisa refletir o locale resolvido (WCAG 3.1.1) — mas só quando
    // habilitado explicitamente (ver `translation.manageHtmlLang` e o mesmo
    // comentário em useVenixTheme.ts): se o projeto já usa um módulo de i18n
    // de rotas, é ele quem deve ser o dono desse atributo.
    if (themeConfig?.enabled?.manageHtmlLang) {
      const localeCookie = useCookie<string>(themeConfig?.localeCookie || DEFAULT_LOCALE_COOKIE_NAME)
      const locale = useThemeLocale(theme, localeCookie, {
        enabled: themeConfig?.enabled?.translation !== false,
        forcedLocale: themeConfig?.locale,
        defaultLocale: themeConfig?.defaultLocale || DEFAULT_LOCALE,
      })
      htmlAttrs.lang = locale.currentLocale.value
    }

    // Aplica no SSR diretamente
    useHead({ htmlAttrs })
  },
})
