import type { ThemeConfig, ThemeColors } from './types'

interface ProcessOptions {
    typography?: boolean
    customScrollbar?: boolean
    customCursor?: boolean
    colors?: boolean
}

function generateFontFaces(theme: ThemeConfig) {
    if (!theme.typography?.customFonts) return ''

    const uniqueFonts = new Map<string, typeof theme.typography.customFonts>()

    theme.typography.customFonts.forEach(font => {
        if (!uniqueFonts.has(font.name)) {
            uniqueFonts.set(font.name, [])
        }
        uniqueFonts.get(font.name)!.push(font)
    })

    let css = '\n/* ============================================ */\n'
    css += '/* Typography - Font Faces                      */\n'
    css += '/* ============================================ */\n\n'

    uniqueFonts.forEach(weights => {
        weights.forEach(font => {
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

function buildFontFamily(theme: ThemeConfig) {
    const fontNames: string[] = []

    if (theme.typography?.customFonts) {
        const uniqueNames = [...new Set(theme.typography.customFonts.map(font => font.name))]
        uniqueNames.forEach(name => {
            fontNames.push(`'${name}'`)
        })
    }

    if (theme.typography?.defaultFonts) {
        fontNames.push(theme.typography.defaultFonts)
    }

    return fontNames.join(', ')
}

function generateRootVars(theme: ThemeConfig) {
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

function generateThemeVars(mode: string, colors: ThemeColors) {
    const colorVars = Object.entries(colors)
        .filter(([key]) => !['dark', 'seasonal', 'dateRange', 'translations', 'icon'].includes(key))
        .filter(([, value]) => typeof value === 'string' && value.startsWith('#'))
        .map(([key, value]) => `  --color-${key}: ${value};`)
        .join('\n')

    const isDark = colors.dark === true
    const colorScheme = isDark ? 'dark' : 'light'

    // Calcula a cor inversa baseada no schema
    const inverseColor = isDark ? '#FFFFFF' : '#000000'

    return `\n/* ============================================ */\n` +
        `/* Colors - ${mode.charAt(0).toUpperCase() + mode.slice(1)} Theme                     */\n` +
        `/* ============================================ */\n\n` +
        `:root[data-theme='${mode}'] {\n` +
        `  color-scheme: ${colorScheme};\n` +
        `  --color-schema: ${colorScheme === 'dark' ? '#000000' : '#FFFFFF'};\n` +
        `  --color-inverse: ${inverseColor};\n` +
        colorVars + '\n' +
        `}\n`
}

function generateCustomScrollbarCSS(theme: ThemeConfig) {
    const scrollbar = theme.customScrollbar
    if (!scrollbar || !scrollbar.enabled) return ''

    const width = scrollbar.width || 'auto'
    const borderRadius = scrollbar.borderRadius || '8px'
    const borderWidth = scrollbar.borderWidth || '3px'

    const colorVar = (key: keyof NonNullable<ThemeConfig['customScrollbar']>['colors'], fallback: string) => {
        const value = scrollbar.colors?.[key] || fallback
        if (value.startsWith('var(--') || value.startsWith('#') || value.startsWith('rgb')) {
            return value
        }
        return `var(--color-${value})`
    }

    const thumb = colorVar('thumb', 'primary')
    const thumbHover = colorVar('thumbHover', 'secondary')
    const track = colorVar('track', 'background2')
    const border = colorVar('border', 'background3')

    let css = '\n/* ============================================ */\n'
    css += '/* Custom Scrollbar                             */\n'
    css += '/* ============================================ */\n'
    css += `\n::-webkit-scrollbar {
  width: ${width};
  height: ${width};
}\n`
    css += `\n::-webkit-scrollbar-track {
  background: ${track};
}\n`
    css += `\n::-webkit-scrollbar-thumb {
  background: ${thumb};
  border-radius: ${borderRadius};
  border: ${borderWidth} solid ${border};
}\n`
    css += `\n::-webkit-scrollbar-thumb:hover {
  background: ${thumbHover};
}\n`
    css += `\nhtml {
  scrollbar-width: ${width === 'auto' ? 'auto' : 'thin'};
  scrollbar-color: ${thumb} ${track};
}\n`

    return css
}

function generateCustomCursorCSS(theme: ThemeConfig) {
    const cursor = theme.customCursor
    if (!cursor || !cursor.enabled || !cursor.cursors) return ''

    const cursors = cursor.cursors

    let css = '\n/* ============================================ */\n'
    css += '/* Custom Cursor                                */\n'
    css += '/* ============================================ */\n'

    const cursorValue = (type: string) => {
        if (!cursors[type]) return null
        const { path, hotspot } = cursors[type]
        const hotspotStr = hotspot ? ` ${hotspot}` : ''
        return `url('${path}')${hotspotStr}, ${type}`
    }

    if (cursors.default) {
        const value = cursorValue('default')
        css += '\n/* 1. Cursor padrão em tudo */\n'
        css += `body {
  cursor: ${value};
}\n`
    }

    if (cursors.pointer) {
        const value = cursorValue('pointer')
        css += '\n/* 2. Cursor pointer para elementos clicáveis */\n'
        css += `a, a *,
button, button *,
[role="button"],
input[type="button"], input[type="submit"], input[type="reset"],
.v-btn:not(.v-btn--disabled),
.v-list-item,
.v-icon,
.v-tab,
.v-chip,
.v-card--link,
.v-breadcrumbs-item--link,
.v-pagination__item {
  cursor: ${value} !important;
}\n`
    }

    if (cursors.text) {
        const value = cursorValue('text')
        css += '\n/* 3. Cursor text (i-beam) apenas para campos editáveis */\n'
        css += `input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="search"],
input[type="tel"],
input[type="url"],
input[type="date"],
input[type="datetime-local"],
input[type="month"],
input[type="week"],
input[type="time"],
textarea,
select,
[contenteditable="true"] {
  cursor: ${value} !important;
}\n`
    }

    if (cursors.default) {
        const value = cursorValue('default')
        css += '\n/* 4. Elementos desabilitados */\n'
        css += `.v-btn--disabled,
[disabled],
.disabled {
  cursor: ${value} !important;
}\n`
    }

    return css
}

export function processTheme(theme: ThemeConfig, options: ProcessOptions = {}): string {
    const output: string[] = []

    // Tipografia - funciona independente do "defaults" das cores
    if (options.typography !== false && theme.typography?.enabled !== false) {
        output.push(generateFontFaces(theme))
        output.push(generateRootVars(theme))
    }

    // Cores - sempre processa as variáveis CSS, mas a aplicação automática é controlada pelo "defaults"
    if (options.colors !== false && theme.colors?.enabled !== false) {
        if (theme.colors?.themes) {
            Object.entries(theme.colors.themes).forEach(([themeName, themeColors]) => {
                // Ignora o tema "system" - não é um tema de cores
                if (themeName === 'system') return

                // Verifica se tem cores válidas
                if (!themeColors.primary && !themeColors.background) return

                output.push(generateThemeVars(themeName, themeColors))
            })
        }
    }

    // Scrollbar - funciona independente do "defaults" das cores
    if (options.customScrollbar !== false && theme.customScrollbar?.enabled !== false) {
        const scrollbarCSS = generateCustomScrollbarCSS(theme)
        if (scrollbarCSS) output.push(scrollbarCSS)
    }

    // Cursor - funciona independente do "defaults" das cores
    if (options.customCursor !== false && theme.customCursor?.enabled !== false) {
        const cursorCSS = generateCustomCursorCSS(theme)
        if (cursorCSS) output.push(cursorCSS)
    }

    return output.join('\n')
}