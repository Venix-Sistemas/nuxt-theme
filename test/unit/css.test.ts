import { describe, it, expect } from 'vitest'
import { processTheme } from '../../src/app/css'
import { generateThemeVars } from '../../src/app/css/colors'
import { loadTheme } from '../../src/app/utils/load'

describe('processTheme', () => {
  const theme = loadTheme()

  it('deve gerar CSS com cores', () => {
    const css = processTheme(theme, { colors: true })
    expect(css).toContain('--color-primary')
    expect(css).toContain(':root[data-theme=\'dark\']')
  })

  it('não deve gerar CSS de cores se desabilitado', () => {
    // Usa um tema sem cores habilitadas
    const themeWithoutColors = {
      ...theme,
      colors: {
        ...theme.colors,
        enabled: false,
      },
    }

    const css = processTheme(themeWithoutColors, {
      typography: false,
      customScrollbar: false,
      customCursor: false,
    })

    expect(css).not.toContain('--color-primary')
    expect(css).not.toContain(':root[data-theme=\'dark\']')
  })

  it('deve gerar CSS de scrollbar se habilitado', () => {
    const css = processTheme(theme, { customScrollbar: true })
    expect(css).toContain('::-webkit-scrollbar')
  })
})

describe('generateThemeVars', () => {
  it('deve ignorar o tema system', () => {
    const css = generateThemeVars('system', {
      translations: { 'pt-BR': 'Sistema' },
      icon: 'i-line-md:light-dark-loop',
    })
    expect(css).not.toContain('--color-primary')
  })

  it('deve gerar cores válidas', () => {
    const css = generateThemeVars('dark', {
      dark: true,
      primary: '#FF6B6B',
      secondary: '#FFB96A',
    })
    expect(css).toContain('--color-primary: #FF6B6B')
    expect(css).toContain('--color-secondary: #FFB96A')
  })
})
