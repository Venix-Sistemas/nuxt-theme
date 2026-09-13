// runtime/plugins/vuetify-theme.ts
import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#app'
import { THEME_PREFERENCE_COOKIE, THEME_RESOLVED_COOKIE } from '../../shared/constants'

interface VuetifyBeforeCreateContext {
  vuetifyOptions?: {
    theme?: {
      defaultTheme?: string
      themes?: Record<string, unknown>
    }
  }
}

export default defineNuxtPlugin({
  name: 'venix-theme-vuetify-sync',
  enforce: 'pre',
  setup(nuxtApp) {
    const config = useRuntimeConfig()
    const themeConfig = config.public.venixTheme

    const resolvedCookie = useCookie<string>(THEME_RESOLVED_COOKIE)
    const preferenceCookie = useCookie<string>(THEME_PREFERENCE_COOKIE)

    // 'vuetify:before-create' só existe quando vuetify-nuxt-module está instalado
    // (peer opcional); o cast é seguro porque o hook nunca dispara sem o módulo presente.
    const hookBeforeCreate = nuxtApp.hook as unknown as (
      name: 'vuetify:before-create',
      fn: (ctx: VuetifyBeforeCreateContext) => void,
    ) => void

    hookBeforeCreate('vuetify:before-create', ({ vuetifyOptions }) => {
      const themes = vuetifyOptions?.theme?.themes
      if (!vuetifyOptions?.theme || !themes) return

      const defaultTheme = themeConfig?.defaultTheme || 'dark'

      let resolved = defaultTheme
      if (resolvedCookie.value && themes[resolvedCookie.value]) {
        resolved = resolvedCookie.value
      }
      else if (preferenceCookie.value && themes[preferenceCookie.value]) {
        resolved = preferenceCookie.value
      }

      vuetifyOptions.theme.defaultTheme = resolved
    })
  },
})
