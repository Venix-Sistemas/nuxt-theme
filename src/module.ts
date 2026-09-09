import { defineNuxtModule, createResolver, addImports } from '@nuxt/kit'
import { loadTheme } from './app/utils/load'
import type { TypographyConfig, ScrollbarConfig, CursorConfig, ColorOptions, TranslationConfig } from './app/types'
import { DEFAULT_LOCALE, DEFAULT_LOCALE_COOKIE_NAME } from './app/constants'
import { resolveFeatureOption } from './app/utils/options'
import { customizeTheme } from './setup/customize-theme'
import { registerPublicAssets } from './setup/register-assets'
import { registerThemePlugins } from './setup/register-plugins'
import { registerThemeCSS } from './setup/register-css'

export interface ModuleOptions {
  theme?: string
  translation?: boolean | Partial<TranslationConfig>
  color?: boolean | Partial<ColorOptions>
  scrollbar?: boolean | Partial<ScrollbarConfig>
  cursor?: boolean | Partial<CursorConfig>
  typography?: boolean | Partial<TypographyConfig>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@venix-sistemas/nuxt-theme',
    configKey: 'venixTheme',
  },
  defaults: {
    translation: true,
    color: true,
    scrollbar: true,
    cursor: true,
    typography: true,
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // 1. Registra assets públicos
    registerPublicAssets(nuxt, resolver)

    // 2. Carrega e customiza o tema
    const baseTheme = loadTheme(options.theme)
    const theme = customizeTheme(baseTheme, options)

    // 3. Registra o composable
    addImports({
      name: 'useTheme',
      from: resolver.resolve('./runtime/composables/useTheme'),
    })

    // 4. Resolve as opções de cor e tradução
    const colorOptions = resolveFeatureOption<ColorOptions>(options.color, {
      enabled: theme.colors?.enabled !== false,
      apply: true,
      defaultColor: theme.colors?.defaultColor || 'dark',
      themes: {},
    })
    const shouldApplyColors = colorOptions.enabled && colorOptions.apply && theme.colors?.defaults !== false

    const translationOptions = resolveFeatureOption<TranslationConfig>(options.translation, {
      enabled: true,
      locale: '',
      defaultLocale: DEFAULT_LOCALE,
      cookieSync: DEFAULT_LOCALE_COOKIE_NAME,
    })

    // 5. Registra CSS
    registerThemeCSS(nuxt, theme)

    // 6. Registra plugins
    registerThemePlugins(nuxt, resolver, shouldApplyColors)

    // 7. Configura runtimeConfig
    nuxt.options.runtimeConfig.public.venixTheme = {
      defaultTheme: theme.colors?.defaultColor || 'dark',
      colorThemes: colorOptions.themes,
      applyColors: shouldApplyColors,
      localeCookie: translationOptions.cookieSync,
      defaultLocale: translationOptions.defaultLocale,
      locale: translationOptions.locale,
      enabled: {
        typography: theme.typography?.enabled !== false,
        scrollbar: theme.customScrollbar?.enabled !== false,
        cursor: theme.customCursor?.enabled !== false,
        color: colorOptions.enabled,
        translation: translationOptions.enabled,
      },
    }
  },
})
