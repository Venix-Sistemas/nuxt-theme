// src/setup/register-icon.ts
import { createRequire } from 'node:module'
import { realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { installModule, addImports, addComponent } from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions as NuxtIconOptions } from '@nuxt/icon'
import type { IconOptions } from '../shared/types'

// Extraído do tipo público de @nuxt/icon (não há subpath exportado só para
// `ServerBundleOptions`) para tipar as coleções sem depender de @iconify/types
// diretamente — evita uma dependência extra só para tipos.
type IconServerBundle = Exclude<NuxtIconOptions['serverBundle'], 'auto' | 'remote' | 'local' | false | undefined>
type IconCollectionEntry = NonNullable<IconServerBundle['collections']>[number]

// `realpathSync` é essencial aqui: quando este pacote é instalado via pnpm
// (sem hoist), o Node carrega este arquivo através de um symlink em
// node_modules/@venix-sistemas/nuxt-theme/, e `createRequire` resolvido a
// partir do caminho symlinked NÃO enxerga node_modules/ desta própria
// dependência (fica "fora" da árvore real do pacote) — só funciona a partir
// do caminho físico real.
const nodeRequire = createRequire(realpathSync(fileURLToPath(import.meta.url)))

/**
 * Carrega o JSON de uma coleção `@iconify-json/*` a partir da localização
 * deste próprio pacote (não do projeto consumidor). @nuxt/icon, no modo
 * `serverBundle: 'local'`, resolve coleções a partir da raiz do projeto
 * consumidor — o que falha quando o gerenciador de pacotes não faz hoist da
 * dependência (ex.: pnpm estrito), mesmo sendo uma dependência direta deste
 * módulo. Passar os dados já carregados evita essa resolução por completo.
 */
function loadCollection(name: string): IconCollectionEntry {
  try {
    return nodeRequire(`@iconify-json/${name}/icons.json`) as IconCollectionEntry
  }
  catch {
    return name // fallback: deixa o @nuxt/icon tentar resolver/buscar remoto
  }
}

export async function registerThemeIcon(nuxt: Nuxt, resolver: Resolver, options: IconOptions) {
  if (!options.enabled) return

  await installModule('@nuxt/icon', {
    aliases: options.aliases,
    serverBundle: {
      collections: options.collections.map(loadCollection),
    },
  })

  addImports({
    name: 'useVenixIcon',
    from: resolver.resolve('./runtime/composables/useVenixIcon'),
  })

  addComponent({
    name: 'VenixIcon',
    filePath: resolver.resolve('./runtime/components/VenixIcon'),
  })
}
