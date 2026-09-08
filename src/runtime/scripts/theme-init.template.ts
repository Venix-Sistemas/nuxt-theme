// runtime/theme-init.template.ts
import initTheme from '../scripts/theme-init'
import themeData from '../theme.json' with { type: 'json' }
import type { ThemeConfig } from '../../app/types'

// Executa imediatamente
initTheme(themeData as ThemeConfig)
