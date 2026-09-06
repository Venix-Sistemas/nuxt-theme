import { defineNuxtModule, createResolver, addImports } from '@nuxt/kit'
import { loadTheme } from './app/utils/load'
import type { ThemeColors, TypographyConfig, ScrollbarConfig, CursorConfig } from './app/types'
import { customizeTheme } from './setup/customize-theme'
import { registerPublicAssets } from './setup/register-assets'
import { registerThemePlugins } from './setup/register-plugins'
import { registerThemeCSS } from './setup/register-css'

export interface ModuleOptions {
  theme?: string
  typography?: boolean | Partial<TypographyConfig>
  customScrollbar?: boolean | Partial<ScrollbarConfig>
  customCursor?: boolean | Partial<CursorConfig>
  colors?: boolean
  applyColors?: boolean
  colorThemes?: {
    [themeName: string]: Partial<ThemeColors>
  }
  localeCookie?: string
  defaultLocale?: string
  locale?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@venix/nuxt-theme',
    configKey: 'venixTheme',
  },
  defaults: {
    typography: true,
    customScrollbar: true,
    customCursor: true,
    colors: true,
    applyColors: true,
    localeCookie: 'i18n_redirected',
    defaultLocale: 'en-US',
    locale: '',
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // 1. Registra assets públicos
    registerPublicAssets(nuxt)

    // 2. Carrega e customiza o tema
    const baseTheme = loadTheme(options.theme)
    const theme = customizeTheme(baseTheme, options)

    // 3. Registra o composable
    addImports({
      name: 'useTheme',
      from: resolver.resolve('./runtime/composables/useTheme'),
    })

    // 4. Verifica se deve aplicar cores
    const shouldApplyColors = options.applyColors !== false
      && theme.colors?.enabled !== false
      && theme.colors?.defaults !== false

    // 5. Registra CSS
    registerThemeCSS(nuxt, theme, options)

    // 6. Registra plugins
    registerThemePlugins(nuxt, shouldApplyColors)

    // 7. Configura runtimeConfig
    nuxt.options.runtimeConfig.public.venixTheme = {
      defaultTheme: theme.colors?.defaultColor || 'dark',
      colorThemes: options.colorThemes || {},
      applyColors: shouldApplyColors,
      localeCookie: options.localeCookie || 'i18n_redirected',
      defaultLocale: options.defaultLocale || 'en-US',
      locale: options.locale || '',
      enabled: {
        typography: options.typography !== false && theme.typography?.enabled !== false,
        customScrollbar: options.customScrollbar !== false && theme.customScrollbar?.enabled !== false,
        customCursor: options.customCursor !== false && theme.customCursor?.enabled !== false,
        colors: options.colors !== false && theme.colors?.enabled !== false,
      },
    }
  },
})
