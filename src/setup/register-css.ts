// src/setup/register-css.ts
import { addTemplate } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ThemeConfig } from '../shared/types'
import { processTheme } from '../shared/css'

export function registerThemeCSS(nuxt: Nuxt, theme: ThemeConfig) {
  const css = processTheme(theme)

  if (css) {
    const template = addTemplate({
      filename: 'venix-theme.css',
      getContents: () => css,
      write: true,
    })
    nuxt.options.css.push(template.dst)
  }
}
