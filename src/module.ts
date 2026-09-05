import { defineNuxtModule, addPlugin, createResolver, addTemplate, addImports, addComponent } from '@nuxt/kit'
import { loadTheme } from './app/load'
import { processTheme } from './app/css'
import type { ThemeConfig, ThemeColors, TypographyConfig, ScrollbarConfig, CursorConfig } from './app/types'

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
  },

  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    // ===== COPIAR ASSETS PÚBLICOS DO MÓDULO =====
    // Isso faz com que as imagens do cursor fiquem disponíveis no app
    _nuxt.options.nitro = _nuxt.options.nitro || {}
    _nuxt.options.nitro.publicAssets = _nuxt.options.nitro.publicAssets || []

    _nuxt.options.nitro.publicAssets.push({
      dir: resolver.resolve('./runtime/public'),
      maxAge: 60 * 60 * 24 * 365, // 1 ano de cache
      baseURL: '/'
    })

    // Carrega o tema padrão
    const baseTheme = loadTheme(_options.theme)

    // Aplica customizações do playground
    const theme = customizeTheme(baseTheme, _options)

    addImports({
      name: 'useTheme',
      from: resolver.resolve('./runtime/composables/useTheme')
    })

    const shouldApplyColors = _options.applyColors !== false &&
      theme.colors?.enabled !== false &&
      theme.colors?.defaults !== false

    const css = processTheme(theme, {
      typography: _options.typography !== false && theme.typography?.enabled !== false,
      customScrollbar: _options.customScrollbar !== false && theme.customScrollbar?.enabled !== false,
      customCursor: _options.customCursor !== false && theme.customCursor?.enabled !== false,
      colors: _options.colors !== false && theme.colors?.enabled !== false,
    })

    if (css) {
      const template = addTemplate({
        filename: 'venix-theme.css',
        getContents: () => css,
        write: true
      })
      _nuxt.options.css.push(template.dst)
    }

    if (shouldApplyColors) {

      // Adiciona o @nuxt/icon automaticamente
      _nuxt.options.modules = _nuxt.options.modules || []
      if (!_nuxt.options.modules.includes('@nuxt/icon')) {
        _nuxt.options.modules.push('@nuxt/icon')
      }

      addComponent({
        name: 'ThemeIcon',
        filePath: resolver.resolve('./runtime/components/ThemeIcon.vue')
      })

      addPlugin({
        src: resolver.resolve('./runtime/plugins/theme-init.client'),
        mode: 'client'
      })
    }

    addPlugin(resolver.resolve('./runtime/plugin'))

    _nuxt.options.runtimeConfig.public.venixTheme = {
      defaultTheme: theme.colors?.defaultColor || 'dark',
      colorThemes: _options.colorThemes || {},
      applyColors: shouldApplyColors,
      enabled: {
        typography: _options.typography !== false && theme.typography?.enabled !== false,
        customScrollbar: _options.customScrollbar !== false && theme.customScrollbar?.enabled !== false,
        customCursor: _options.customCursor !== false && theme.customCursor?.enabled !== false,
        colors: _options.colors !== false && theme.colors?.enabled !== false,
      }
    }
  },
})

function customizeTheme(baseTheme: ThemeConfig, options: ModuleOptions): ThemeConfig {
  const customized = JSON.parse(JSON.stringify(baseTheme)) as ThemeConfig

  // ===== TIPOGRAFIA =====
  if (typeof options.typography === 'object') {
    customized.typography = {
      ...customized.typography,
      ...options.typography,
      enabled: true
    }
  } else if (options.typography === false) {
    customized.typography.enabled = false
  }

  // ===== SCROLLBAR =====
  if (typeof options.customScrollbar === 'object') {
    customized.customScrollbar = {
      ...customized.customScrollbar,
      ...options.customScrollbar,
      enabled: true
    }
  } else if (options.customScrollbar === false) {
    customized.customScrollbar.enabled = false
  }

  // ===== CURSOR =====
  if (typeof options.customCursor === 'object') {
    customized.customCursor = {
      ...customized.customCursor,
      ...options.customCursor,
      enabled: true
    }
  } else if (options.customCursor === false) {
    customized.customCursor.enabled = false
  }

  // ===== CORES =====
  if (options.colorThemes) {
    Object.entries(options.colorThemes).forEach(([themeName, customColors]) => {
      if (customized.colors.themes[themeName]) {
        customized.colors.themes[themeName] = {
          ...customized.colors.themes[themeName],
          ...customColors
        }
      } else {
        customized.colors.themes[themeName] = {
          dark: true,
          ...customColors
        } as ThemeColors
      }
    })
  }

  return customized
}