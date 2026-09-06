// src/setup/register-css.ts
import { addTemplate } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ThemeConfig } from '../app/types'
import { processTheme } from '../app/css'
import type { ModuleOptions } from '../module'

export function registerThemeCSS(nuxt: Nuxt, theme: ThemeConfig, options: ModuleOptions) {
  const css = processTheme(theme, {
    typography: options.typography !== false && theme.typography?.enabled !== false,
    customScrollbar: options.customScrollbar !== false && theme.customScrollbar?.enabled !== false,
    customCursor: options.customCursor !== false && theme.customCursor?.enabled !== false,
    colors: options.colors !== false && theme.colors?.enabled !== false,
  })

  if (css) {
    const template = addTemplate({
      filename: 'venix-theme.css',
      getContents: () => css,
      write: true,
    })
    nuxt.options.css.push(template.dst)
  }
}
