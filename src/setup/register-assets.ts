// src/setup/register-assets.ts
import type { Resolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

export function registerPublicAssets(nuxt: Nuxt, resolver: Resolver) {
  nuxt.options.nitro = nuxt.options.nitro || {}
  nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || []

  nuxt.options.nitro.publicAssets.push({
    dir: resolver.resolve('./runtime/public'),
    maxAge: 60 * 60 * 24 * 365,
    baseURL: '/',
  })
}
