// src/setup/register-components.ts
import { addComponent } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'

export function registerThemeComponents(resolver: Resolver) {
  addComponent({
    name: 'VenixThemeSwitcher',
    filePath: resolver.resolve('./runtime/components/VenixThemeSwitcher'),
  })
}
