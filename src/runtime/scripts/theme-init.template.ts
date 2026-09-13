// runtime/theme-init.template.ts
import initTheme from '../scripts/theme-init'
import themeData from '../../shared/theme.json' with { type: 'json' }
import type { ThemeConfig } from '../../shared/types'

// Executa imediatamente
initTheme(themeData as ThemeConfig)
