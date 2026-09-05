// src/app/types.ts
export interface TypographyConfig {
    enabled: boolean
    defaultFonts: string
    fontSize: string
    customFonts: FontConfig[]
}

export interface FontConfig {
    name: string
    preload: boolean
    sources: {
        woff2: string
    }
    weight: string
    style: string
}

export interface ScrollbarConfig {
    enabled: boolean
    width: string
    borderRadius: string
    borderWidth: string
    colors: {
        thumb: string
        thumbHover: string
        track: string
        border: string
    }
}

export interface CursorConfig {
    enabled: boolean
    cursors: Record<string, {
        path: string
        hotspot: string
    }>
}

export interface ColorsConfig {
    enabled: boolean
    defaults: boolean
    defaultColor: string
    themes: Record<string, ThemeColors>
}

export interface ThemeConfig {
    name: string
    typography: TypographyConfig
    customScrollbar: ScrollbarConfig
    customCursor: CursorConfig
    colors: ColorsConfig
}

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

// Declaração do runtimeConfig
declare module '@nuxt/schema' {
    interface PublicRuntimeConfig {
        venixTheme?: {
            defaultTheme: string
            colorThemes: Record<string, Partial<ThemeColors>>
            applyColors: boolean
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