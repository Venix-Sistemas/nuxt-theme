export interface ThemeTranslations {
  [locale: string]: string
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
  icon?: string
}

export interface ColorsConfig {
  enabled: boolean
  defaults: boolean
  defaultColor: string
  themes: Record<string, ThemeColors>
}
