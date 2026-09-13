import type { ThemeConfig } from '../types'
import { generateFontFaces, generateRootVars } from './typography'
import { generateThemeVars } from './colors'
import { generateCustomScrollbarCSS } from './scrollbar'
import { generateCustomCursorCSS } from './cursor'
import { generateThemeTransitionCSS } from './transition'

export interface ProcessOptions {
  typography?: boolean
  customScrollbar?: boolean
  customCursor?: boolean
  colors?: boolean
}

export function processTheme(theme: ThemeConfig, options: ProcessOptions = {}): string {
  const output: string[] = []

  // Tipografia
  if (options.typography !== false && theme.typography?.enabled !== false) {
    output.push(generateFontFaces(theme))
    output.push(generateRootVars(theme))
  }

  // Cores
  if (options.colors !== false && theme.colors?.enabled !== false) {
    if (theme.colors?.themes) {
      output.push(generateThemeTransitionCSS())
      Object.entries(theme.colors.themes).forEach(([themeName, themeColors]) => {
        if (themeName === 'system') return
        if (!themeColors.primary && !themeColors.background) return
        output.push(generateThemeVars(themeName, themeColors))
      })
    }
  }

  // Scrollbar
  if (options.customScrollbar !== false && theme.customScrollbar?.enabled !== false) {
    const scrollbarCSS = generateCustomScrollbarCSS(theme)
    if (scrollbarCSS) output.push(scrollbarCSS)
  }

  // Cursor
  if (options.customCursor !== false && theme.customCursor?.enabled !== false) {
    const cursorCSS = generateCustomCursorCSS(theme)
    if (cursorCSS) output.push(cursorCSS)
  }

  return output.join('\n')
}
