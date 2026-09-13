import type { ThemeConfig } from '../types/index'

export function generateFontFaces(theme: ThemeConfig): string {
  if (!theme.typography?.customFonts) return ''

  const uniqueFonts = new Map<string, typeof theme.typography.customFonts>()

  theme.typography.customFonts.forEach((font) => {
    if (!uniqueFonts.has(font.name)) {
      uniqueFonts.set(font.name, [])
    }
    uniqueFonts.get(font.name)!.push(font)
  })

  let css = '\n/* ============================================ */\n'
  css += '/* Typography - Font Faces                      */\n'
  css += '/* ============================================ */\n\n'

  uniqueFonts.forEach((weights) => {
    weights.forEach((font) => {
      const urls = Object.entries(font.sources)
        .map(([format, url]) => `url('${url}') format('${format}')`)
        .join(',\n       ')

      css += `@font-face {
  font-family: '${font.name}';
  src: ${urls};
  font-weight: ${font.weight};
  font-style: ${font.style || 'normal'};
  font-display: swap;
}

`
    })
  })

  return css
}

function buildFontFamily(theme: ThemeConfig): string {
  const fontNames: string[] = []

  if (theme.typography?.customFonts) {
    const uniqueNames = [...new Set(theme.typography.customFonts.map(font => font.name))]
    uniqueNames.forEach((name) => {
      fontNames.push(`'${name}'`)
    })
  }

  if (theme.typography?.defaultFonts) {
    fontNames.push(theme.typography.defaultFonts)
  }

  return fontNames.join(', ')
}

export function generateRootVars(theme: ThemeConfig): string {
  let vars = '\n/* ============================================ */\n'
  vars += '/* Typography - Root Variables                  */\n'
  vars += '/* ============================================ */\n\n'
  vars += ':root {\n'

  const fontFamily = buildFontFamily(theme)
  if (fontFamily) {
    vars += `  --font-family-base: ${fontFamily};\n`
  }

  if (theme.typography?.fontSize) {
    vars += `  --font-size-base: ${theme.typography.fontSize};\n`
  }

  vars += '}\n'

  return vars
}
