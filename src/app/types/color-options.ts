import type { ThemeColors } from './colors'

export interface ColorOptions {
  enabled: boolean
  apply: boolean
  defaultColor: string
  themes: Record<string, Partial<ThemeColors>>
}
