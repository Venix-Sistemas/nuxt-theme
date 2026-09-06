// src/app/types/runtime-config.ts
import type { ThemeColors } from './colors'

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    venixTheme?: {
      defaultTheme: string
      colorThemes: Record<string, Partial<ThemeColors>>
      applyColors: boolean
      localeCookie: string
      defaultLocale: string
      locale: string
      enabled: {
        typography: boolean
        customScrollbar: boolean
        customCursor: boolean
        colors: boolean
      }
    }
  }
}

declare global {
  interface Window {
    __INITIAL_THEME__?: string
    __INITIAL_LOCALE__?: string
  }
}

export { }
