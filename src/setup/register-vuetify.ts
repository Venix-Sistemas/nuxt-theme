// src/setup/register-vuetify.ts
import { addPlugin } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ThemeConfig, ColorsConfig } from '../shared/types'
import { NON_COLOR_PROPERTIES } from '../shared/constants'

interface VuetifyThemeDefinition {
  dark: boolean
  colors: Record<string, string>
}

interface VuetifyRegisterModuleConfig {
  vuetifyOptions?: {
    theme?: {
      defaultTheme?: string
      themes?: Record<string, VuetifyThemeDefinition>
    }
  }
}

type RegisterModuleFn = (config: VuetifyRegisterModuleConfig) => void

/**
 * Converte os temas de cor do módulo (hex reais, não CSS vars) para o formato
 * que o Vuetify espera, já que o Vuetify calcula contraste/on-colors em JS e
 * precisa dos valores concretos, não de `var(--color-x)`.
 */
function buildVuetifyThemes(colors: ColorsConfig): Record<string, VuetifyThemeDefinition> {
  const themes: Record<string, VuetifyThemeDefinition> = {}

  for (const [name, themeColors] of Object.entries(colors.themes)) {
    if (!themeColors.primary && !themeColors.background) continue // ex.: placeholder 'system', sem cores reais

    const isDark = themeColors.dark === true
    const vuetifyColors: Record<string, string> = {}

    for (const [key, value] of Object.entries(themeColors)) {
      if (NON_COLOR_PROPERTIES.includes(key as typeof NON_COLOR_PROPERTIES[number])) continue
      if (typeof value !== 'string' || !value.startsWith('#')) continue
      vuetifyColors[key] = value
    }

    // 'surface' é o slot semântico do Vuetify para cards/toolbars/etc;
    // usamos background2 como o equivalente mais próximo do nosso sistema.
    if (themeColors.background2) vuetifyColors.surface = themeColors.background2
    vuetifyColors.inverse = isDark ? '#FFFFFF' : '#000000'

    themes[name] = { dark: isDark, colors: vuetifyColors }
  }

  return themes
}

/**
 * Registra os temas de cor no Vuetify (`vuetify-nuxt-module`) via o hook de build
 * `vuetify:registerModule`, e adiciona um plugin de runtime que resolve o tema
 * ativo (cookie) para manter o Vuetify em sincronia com o resto do módulo.
 * É um no-op seguro se o vuetify-nuxt-module não estiver instalado.
 *
 * Requer que `@venix-sistemas/nuxt-theme` apareça ANTES do módulo do Vuetify
 * em `modules`, já que o registro precisa acontecer antes do Vuetify resolver
 * sua configuração de tema.
 */
export function registerThemeVuetify(nuxt: Nuxt, resolver: Resolver, theme: ThemeConfig, defaultColor: string, enabled: boolean) {
  if (!enabled || theme.colors?.enabled === false) return

  const themes = buildVuetifyThemes(theme.colors)
  if (Object.keys(themes).length === 0) return

  const hookRegisterModule = nuxt.hook as unknown as (
    name: 'vuetify:registerModule',
    fn: (register: RegisterModuleFn) => void,
  ) => void

  hookRegisterModule('vuetify:registerModule', (register) => {
    register({
      vuetifyOptions: {
        theme: {
          defaultTheme: defaultColor,
          themes,
        },
      },
    })
  })

  addPlugin(resolver.resolve('./runtime/plugins/vuetify-theme'))
}
