export interface FontConfig {
  name: string
  preload: boolean
  sources: {
    woff2: string
  }
  weight: string
  style: string
}

export interface TypographyConfig {
  enabled: boolean
  defaultFonts: string
  fontSize: string
  customFonts: FontConfig[]
}
