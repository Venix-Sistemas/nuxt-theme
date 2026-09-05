// runtime/composables/useTheme.ts
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig } from '#app'
import themeData from '../../app/theme.json'
import type { ThemeConfig, ThemeColors } from '../../app/types'

export const useTheme = () => {
    const config = useRuntimeConfig()
    const themeConfig = config.public.venixTheme

    // Cookies - MOVER PARA CIMA (antes de getCurrentLocale)
    const getCookie = (name: string): string | null => {
        if (typeof document === 'undefined') return null
        const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'))
        return match?.[2] ? decodeURIComponent(match[2]) : null
    }

    const hasConsent = (): boolean => {
        if (typeof localStorage === 'undefined') return false
        const consentData = localStorage.getItem('cookie-consent')
        if (!consentData) return false

        try {
            const consent = JSON.parse(consentData)
            return consent.functionality === true
        } catch (e) {
            return false
        }
    }

    const setCookieIfAllowed = (name: string, value: string) => {
        if (typeof document === 'undefined') return
        if (hasConsent()) {
            document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`
        }
    }

    const removeCookie = (name: string) => {
        if (typeof document !== 'undefined') {
            document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
        }
    }

    // Garantir que colors e themes existem
    const defaultColors: ThemeConfig['colors'] = {
        enabled: true,
        defaults: true,
        defaultColor: 'dark',
        themes: {}
    }

    const theme: ThemeConfig = {
        ...themeData as ThemeConfig,
        colors: {
            ...(themeData.colors || defaultColors),
            defaultColor: themeConfig?.defaultTheme || themeData.colors?.defaultColor || 'dark',
            themes: {
                ...(themeData.colors?.themes || {}),
                ...(themeConfig?.colorThemes || {})
            }
        }
    }

    const defaultTheme = theme.colors.defaultColor || 'dark'

    if (!theme.colors.themes) {
        console.warn('No themes found in theme configuration')
        theme.colors.themes = {}
    }

    const shouldApplyColors = themeConfig?.applyColors !== false && theme.colors.defaults !== false

    // Agora getCookie está definida antes de getCurrentLocale
    const getCurrentLocale = (): string => {
        // 1. Tenta window.__INITIAL_LOCALE__
        if (typeof window !== 'undefined' && window.__INITIAL_LOCALE__) {
            return window.__INITIAL_LOCALE__
        }

        // 2. Tenta cookie
        const cookieLocale = getCookie('theme-locale')
        if (cookieLocale) return cookieLocale

        // 3. Fallback para navigator
        if (typeof navigator !== 'undefined') {
            return navigator.language || 'en-US'
        }

        return 'en-US'
    }

    const translate = (translations?: Record<string, string>, fallback?: string): string => {
        if (!translations) return fallback || ''

        const currentLocale = getCurrentLocale()

        if (translations[currentLocale]) return translations[currentLocale]

        const baseLocale = currentLocale.split('-')[0]
        if (baseLocale && translations[baseLocale]) return translations[baseLocale]

        if (translations['en-US']) return translations['en-US']

        const firstTranslation = Object.values(translations)[0]
        if (firstTranslation) return firstTranslation

        return fallback || ''
    }

    const themes = computed(() => {
        return Object.entries(theme.colors.themes)
            .filter(([value]) => value !== 'system')
            .map(([value, themeConfig]) => ({
                value,
                name: translate(themeConfig.translations, value.charAt(0).toUpperCase() + value.slice(1)),
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

    type ThemeValue = string
    const themeValues = computed(() => themes.value.map(t => t.value))

    const preferenceCookie = getCookie('theme-preference')
    const initialPreference = preferenceCookie || defaultTheme
    const preference = ref<string>(initialPreference || 'system')

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

            if (startMonth === undefined || startDay === undefined ||
                endMonth === undefined || endDay === undefined) continue

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

    const getResolvedTheme = (pref: string): string => {
        if (pref === 'system') {
            const prefersDark = typeof window !== 'undefined'
                ? window.matchMedia('(prefers-color-scheme: dark)').matches
                : true

            const seasonalTheme = getActiveSeasonalTheme(prefersDark)
            if (seasonalTheme) return seasonalTheme

            return prefersDark ? 'dark' : 'light'
        }

        if (pref && theme.colors.themes[pref]) {
            return pref
        }

        return defaultTheme
    }

    const apply = (pref: string) => {
        if (!shouldApplyColors) return

        const resolved = getResolvedTheme(pref)

        if (typeof document !== 'undefined') {
            const html = document.documentElement
            html.classList.remove(...themeValues.value)
            html.classList.add(resolved)
            html.setAttribute('data-theme', resolved)
            window.__INITIAL_THEME__ = resolved
        }
    }

    if (typeof document !== 'undefined' && shouldApplyColors) {
        const currentTheme = document.documentElement.getAttribute('data-theme')
        if (currentTheme) {
            if (!preferenceCookie) {
                preference.value = currentTheme
            }
        } else {
            apply(preference.value)
        }
    }

    onMounted(() => {
        if (!shouldApplyColors) return

        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (preference.value === 'system') apply('system')
        }
        mq.addEventListener('change', handleSystemThemeChange)

        const checkSeasonalChange = () => {
            const now = new Date()
            const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()

            return setTimeout(() => {
                if (preference.value === 'system') apply('system')
                checkSeasonalChange()
            }, msToMidnight + 1000)
        }

        const midnightTimeout = checkSeasonalChange()

        const handleConsentUpdate = () => {
            setCookieIfAllowed('theme-preference', preference.value)
            setCookieIfAllowed('theme-resolved', getResolvedTheme(preference.value))
        }
        window.addEventListener('cookie-preferences-updated', handleConsentUpdate)

        onUnmounted(() => {
            mq.removeEventListener('change', handleSystemThemeChange)
            clearTimeout(midnightTimeout)
            window.removeEventListener('cookie-preferences-updated', handleConsentUpdate)
        })
    })

    watch(preference, (newPref) => {
        if (!shouldApplyColors) return

        apply(newPref)
        setCookieIfAllowed('theme-preference', newPref)
        setCookieIfAllowed('theme-resolved', getResolvedTheme(newPref))
    })

    const theme_toggle = (forceTheme?: string) => {
        preference.value = forceTheme ?? (preference.value === 'light' ? 'dark' : 'light')
    }

    const theme_data = computed(() =>
        themes.value.find(t => t.value === preference.value) ?? themes.value[0]
    )

    const isSeasonalActive = computed(() => {
        if (preference.value !== 'system') return false
        return getActiveSeasonalTheme() !== null
    })

    const activeSeasonalTheme = computed(() => {
        if (preference.value !== 'system') return null
        return getActiveSeasonalTheme()
    })

    const updateThemeColors = (themeName: string, newColors: Partial<ThemeColors>) => {
        if (!theme.colors.themes[themeName]) return

        theme.colors.themes[themeName] = {
            ...theme.colors.themes[themeName],
            ...newColors
        }

        if (typeof document !== 'undefined') {
            const root = document.documentElement

            Object.entries(newColors).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    root.style.setProperty(`--color-${key}`, value)
                }
            })

            window.dispatchEvent(new CustomEvent('theme-updated', {
                detail: { themeName, colors: newColors }
            }))
        }
    }

    const addTheme = (themeName: string, colors: ThemeColors) => {
        theme.colors.themes[themeName] = colors
    }

    const removeTheme = (themeName: string) => {
        delete theme.colors.themes[themeName]
    }

    return {
        theme: {
            preference,
            value: computed(() => getResolvedTheme(preference.value)),
            isSeasonalActive,
            activeSeasonalTheme,
            shouldApplyColors,
            colors: theme.colors,  // Expõe as cores
            themes: theme.colors.themes  // Expõe os temas
        },
        theme_data,
        theme_toggle,
        themes,
        updateThemeColors,
        addTheme,
        removeTheme,
        enablePersistence: () => {
            setCookieIfAllowed('theme-preference', preference.value)
            setCookieIfAllowed('theme-resolved', getResolvedTheme(preference.value))
        },
        disablePersistence: () => {
            removeCookie('theme-preference')
            removeCookie('theme-resolved')
        }
    }
}