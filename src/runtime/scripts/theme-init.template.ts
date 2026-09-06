// runtime/theme-init.template.ts
import initTheme from '../scripts/theme-init'
import themeData from '../../app/theme.json'
import type { ThemeConfig } from '../../app/types'

// Executa imediatamente
initTheme(themeData as ThemeConfig)
