export interface ThemeTranslations {
  [locale: string]: string
}

export interface ThemeIconFormats {
  /** Emoji, sempre presente — fallback quando o formato preferido não existe. */
  emote: string
  /** Nome de ícone Iconify (ex.: 'mdi:sun-compass'), sem animação (@nuxt/icon em modo CSS). */
  css?: string
  /** Nome de ícone Iconify (ex.: 'line-md:sunny-filled-loop'), com animação (@nuxt/icon em modo SVG). */
  svg?: string
}

export interface ThemeColors {
  dark?: boolean
  seasonal?: boolean
  dateRange?: {
    start: string
    end: string
  }
  primary?: string
  secondary?: string
  accent?: string
  error?: string
  info?: string
  success?: string
  warning?: string
  background?: string
  background2?: string
  background3?: string
  translations?: ThemeTranslations
  /** Emoji simples ('🎨') ou um objeto com variantes por formato — veja `ThemeIconFormats`. */
  icon?: string | ThemeIconFormats
}

export interface ColorsConfig {
  enabled: boolean
  defaults: boolean
  defaultColor: string
  themes: Record<string, ThemeColors>
}
