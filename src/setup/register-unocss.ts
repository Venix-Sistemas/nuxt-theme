// src/setup/register-unocss.ts
import type { Nuxt } from '@nuxt/schema'
import type { ThemeConfig } from '../shared/types'
import { COLOR_PROPERTIES } from '../shared/constants'

interface UnoCSSConfigLike {
  theme?: {
    colors?: Record<string, unknown>
  }
}

/**
 * Injeta as cores do tema como variáveis CSS no `theme.colors` do UnoCSS,
 * usando o hook `unocss:config` exposto pelo `@unocss/nuxt`. Se o módulo
 * UnoCSS não estiver instalado, o hook nunca é disparado e isso é um no-op.
 * Cores já definidas pelo usuário no próprio `uno.config.ts` têm prioridade.
 */
export function registerThemeUnoCSS(nuxt: Nuxt, theme: ThemeConfig, enabled: boolean) {
  if (!enabled || theme.colors?.enabled === false) return

  const colorVars: Record<string, string> = {
    inverse: 'var(--color-inverse)',
  }

  for (const property of COLOR_PROPERTIES) {
    colorVars[property] = `var(--color-${property})`
  }

  // 'unocss:config' só é tipado quando @unocss/nuxt está instalado (peer opcional),
  // por isso o cast — o hook em si é seguro de chamar mesmo sem o pacote presente.
  const hookUnoCSSConfig = nuxt.hook as unknown as (
    name: 'unocss:config',
    fn: (config: UnoCSSConfigLike) => void,
  ) => void

  hookUnoCSSConfig('unocss:config', (config) => {
    config.theme = config.theme || {}
    config.theme.colors = {
      ...colorVars,
      ...config.theme.colors,
    }
  })
}
