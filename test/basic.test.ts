import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { loadTheme } from '../src/shared/utils/load'
import { processTheme } from '../src/shared/css'

describe('nuxt-theme module', () => {
  // Teste E2E
  describe('ssr', async () => {
    await setup({
      rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
    })

    it('renders the index page', async () => {
      const html = await $fetch('/')
      expect(html).toContain('<div>basic</div>')
    })

    it('aplica o data-theme no SSR', async () => {
      const html = await $fetch('/')
      expect(html).toMatch(/data-theme="[^"]*"/)
    })
  })

  // Teste de integração
  describe('theme', () => {
    it('deve carregar tema', () => {
      const theme = loadTheme()
      expect(theme).toBeDefined()
      expect(theme.colors.themes['dark']).toBeDefined()
    })

    it('deve gerar CSS', () => {
      const theme = loadTheme()
      const css = processTheme(theme)
      expect(css).toContain('--color-primary')
      expect(css).toContain(':root[data-theme=\'dark\']')
    })
  })
})
