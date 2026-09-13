// runtime/composables/useThemeSeasonal.ts
import type { ThemeConfig } from '../../shared/types'

export const useThemeSeasonal = (theme: ThemeConfig) => {
  const getActiveSeasonalTheme = (prefersDark?: boolean): string | null => {
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const current = month * 100 + day

    for (const [themeName, themeConfig] of Object.entries(theme.colors.themes)) {
      if (!themeConfig.seasonal || !themeConfig.dateRange) continue

      const startParts = themeConfig.dateRange.start.split('-').map(Number)
      const endParts = themeConfig.dateRange.end.split('-').map(Number)

      if (startParts.length !== 2 || endParts.length !== 2) continue

      const startMonth = startParts[0]
      const startDay = startParts[1]
      const endMonth = endParts[0]
      const endDay = endParts[1]

      if (startMonth === undefined || startDay === undefined
        || endMonth === undefined || endDay === undefined) continue

      const startNum = startMonth * 100 + startDay
      const endNum = endMonth * 100 + endDay

      const inRange = startNum <= endNum
        ? current >= startNum && current <= endNum
        : current >= startNum || current <= endNum

      if (inRange && (prefersDark === undefined || themeConfig.dark === prefersDark)) {
        return themeName
      }
    }

    return null
  }

  return {
    getActiveSeasonalTheme,
  }
}
