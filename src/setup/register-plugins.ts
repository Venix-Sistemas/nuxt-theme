// src/setup/register-plugins.ts
import { addPlugin, addTemplate, createResolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

export function registerThemePlugins(nuxt: Nuxt, shouldApplyColors: boolean) {
  const resolver = createResolver(import.meta.url)

  if (shouldApplyColors) {
    // Plugin SSR (servidor)
    addPlugin({
      src: resolver.resolve('../runtime/plugins/theme-init.server'),
      mode: 'server',
    })

    // Script inline
    addTemplate({
      src: resolver.resolve('../runtime/scripts/theme-init.template.ts'),
      filename: 'venix-theme-init.ts',
      write: true,
    })
  }

  // Plugin principal
  addPlugin(resolver.resolve('../runtime/plugin'))
}
