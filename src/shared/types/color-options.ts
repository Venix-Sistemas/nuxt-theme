import type { ThemeColors } from './colors'

export interface ColorOptions {
  enabled: boolean
  apply: boolean
  defaultColor: string
  themes: Record<string, Partial<ThemeColors>>
  /**
   * Formato preferido para o ícone de cada tema quando `icon` é um objeto
   * (`ThemeIconFormats`). Cai para `'emote'` quando o tema não define o
   * formato escolhido, ou quando `icon` é só uma string (formato legado).
   */
  iconFormat: 'emote' | 'css' | 'svg'
}
