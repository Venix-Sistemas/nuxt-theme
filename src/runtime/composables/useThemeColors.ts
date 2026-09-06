// runtime/composables/useThemeColors.ts
import { computed } from 'vue'
import type { ThemeConfig, ThemeColors } from '../../app/types'

export const useThemeColors = (
  theme: ThemeConfig,
  translate: (translations?: Record<string, string>, fallback?: string) => string,
) => {
  const themes = computed(() => {
    return Object.entries(theme.colors.themes)
      .filter(([value]) => value !== 'system')
      .map(([value, themeConfig]) => ({
        value,
        name: translate(themeConfig.translations, value),
        icon: themeConfig.icon || '',
      }))
  })

  const systemTheme = theme.colors.themes['system']
  if (systemTheme) {
    themes.value.unshift({
      value: 'system',
      name: translate(systemTheme.translations, 'System'),
      icon: systemTheme.icon || '',
    })
  }

  const themeValues = computed(() => themes.value.map(t => t.value))

  const updateThemeColors = (themeName: string, newColors: Partial<ThemeColors>) => {
    if (!theme.colors.themes[themeName]) return

    theme.colors.themes[themeName] = {
      ...theme.colors.themes[themeName],
      ...newColors,
    }

    if (typeof document !== 'undefined') {
      const root = document.documentElement

      Object.entries(newColors).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--color-${key}`, value)
        }
      })

      window.dispatchEvent(new CustomEvent('theme-updated', {
        detail: { themeName, colors: newColors },
      }))
    }
  }

  const addTheme = (themeName: string, colors: ThemeColors) => {
    theme.colors.themes[themeName] = colors
  }

  const removeTheme = (themeName: string) => {
    const { [themeName]: _, ...restThemes } = theme.colors.themes
    theme.colors.themes = restThemes
  }

  return {
    themes,
    themeValues,
    updateThemeColors,
    addTheme,
    removeTheme,
  }
}
