// src/setup/customize-theme.ts
import type { ThemeConfig, ThemeColors } from '../app/types'
import type { ModuleOptions } from '../module'

export function customizeTheme(baseTheme: ThemeConfig, options: ModuleOptions): ThemeConfig {
  const customized = JSON.parse(JSON.stringify(baseTheme)) as ThemeConfig

  // ===== TIPOGRAFIA =====
  if (typeof options.typography === 'object') {
    customized.typography = {
      ...customized.typography,
      ...options.typography,
      enabled: true,
    }
  }
  else if (options.typography === false) {
    customized.typography.enabled = false
  }

  // ===== SCROLLBAR =====
  if (typeof options.customScrollbar === 'object') {
    customized.customScrollbar = {
      ...customized.customScrollbar,
      ...options.customScrollbar,
      enabled: true,
    }
  }
  else if (options.customScrollbar === false) {
    customized.customScrollbar.enabled = false
  }

  // ===== CURSOR =====
  if (typeof options.customCursor === 'object') {
    customized.customCursor = {
      ...customized.customCursor,
      ...options.customCursor,
      enabled: true,
    }
  }
  else if (options.customCursor === false) {
    customized.customCursor.enabled = false
  }

  // ===== CORES =====
  if (options.colorThemes) {
    Object.entries(options.colorThemes).forEach(([themeName, customColors]) => {
      if (customized.colors.themes[themeName]) {
        customized.colors.themes[themeName] = {
          ...customized.colors.themes[themeName],
          ...customColors,
        }
      }
      else {
        customized.colors.themes[themeName] = {
          dark: true,
          ...customColors,
        } as ThemeColors
      }
    })
  }

  return customized
}
