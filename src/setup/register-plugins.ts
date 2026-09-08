// src/setup/register-plugins.ts
import { addPlugin, addTemplate, createResolver } from '@nuxt/kit'
import { existsSync } from 'node:fs'
import type { Nuxt } from '@nuxt/schema'

type TemplatePath = `${string}/theme-init.template.${'ts' | 'js'}`

function resolveTemplatePath(basePath: string): TemplatePath {
  const tsPath = `${basePath}.ts` as TemplatePath
  const jsPath = `${basePath}.js` as TemplatePath

  if (existsSync(tsPath)) return tsPath
  if (existsSync(jsPath)) return jsPath

  throw new Error(`Template not found: ${tsPath} or ${jsPath}`)
}

export function registerThemePlugins(nuxt: Nuxt, shouldApplyColors: boolean) {
  const resolver = createResolver(import.meta.url)

  if (shouldApplyColors) {
    addPlugin({
      src: resolver.resolve('../runtime/plugins/theme-init.server'),
      mode: 'server'
    })

    const basePath = resolver.resolve('../runtime/scripts/theme-init.template')
    const templatePath = resolveTemplatePath(basePath)

    addTemplate({
      src: templatePath,
      filename: 'venix-theme-init.ts',
      write: true
    })
  }

  addPlugin(resolver.resolve('../runtime/plugin'))
}