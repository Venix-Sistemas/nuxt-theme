// runtime/composables/useTheme.ts
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig, useCookie, useRequestHeaders } from '#app'
import themeData from '../../app/theme.json'
import type { ThemeConfig, ThemeColors } from '../../app/types'

export const useTheme = () => {
    const config = useRuntimeConfig()
    const themeConfig = config.public.venixTheme

    // Pega headers do SSR
    const headers = useRequestHeaders(['accept-language'])

    // Configurações do módulo
    const localeCookieName = themeConfig?.localeCookie || 'i18n_redirected'
    const defaultLocale = themeConfig?.defaultLocale || 'en-US'
    const forcedLocale = themeConfig?.locale

    // Cookies
    const preferenceCookie = useCookie<string>('theme-preference')
    const resolvedCookie = useCookie<string>('theme-resolved')
    const localeCookie = useCookie<string>(localeCookieName)

    // Garantir que colors e themes existem
    const defaultColors: ThemeConfig['colors'] = {
        enabled: true,
        defaults: true,
        defaultColor: 'dark',
        themes: {}
    }

    // THEME DEFINIDO AQUI (antes de detectLocale)
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

    // Detecta locale de forma consistente entre SSR e cliente
    const detectLocale = (): string => {
        // Coleta todos os locales disponíveis nas traduções
        const getAvailableLocales = (): string[] => {
            const availableLocales = new Set<string>()
            Object.values(theme.colors.themes).forEach(themeConfig => {
                if (themeConfig.translations) {
                    Object.keys(themeConfig.translations).forEach(locale => {
                        availableLocales.add(locale)
                    })
                }
            })
            return Array.from(availableLocales)
        }

        // Encontra o melhor locale disponível
        const findBestLocale = (requestedLocale: string): string => {
            const availableLocales = getAvailableLocales()

            if (availableLocales.includes(requestedLocale)) return requestedLocale

            const baseLocale = requestedLocale.split('-')[0]
            const matchingLocale = availableLocales.find(locale =>
                locale.split('-')[0] === baseLocale
            )
            if (matchingLocale) return matchingLocale

            return defaultLocale
        }

        // 1. Locale forçado via config
        if (forcedLocale) return findBestLocale(forcedLocale)

        // 2. Cookie de idioma
        if (localeCookie.value) return findBestLocale(localeCookie.value)

        // 3. SSR: usa accept-language header
        const acceptLanguageHeader = headers['accept-language']
        if (acceptLanguageHeader) {
            const acceptLanguage = Array.isArray(acceptLanguageHeader)
                ? acceptLanguageHeader[0]
                : acceptLanguageHeader

            if (acceptLanguage) {
                const firstLocale = acceptLanguage.split(',')[0].split(';')[0].trim()
                if (firstLocale) return findBestLocale(firstLocale)
            }
        }

        // 4. Cliente: usa navigator.language
        if (import.meta.client && typeof navigator !== 'undefined') {
            return findBestLocale(navigator.language || defaultLocale)
        }

        // 5. Fallback final
        return defaultLocale
    }

    // Locale reativo
    const currentLocale = ref<string>(detectLocale())

    // Atualiza o locale quando o cookie mudar
    watch(localeCookie, (newLocale) => {
        if (newLocale && !forcedLocale) {
            currentLocale.value = newLocale
        }
    })

    // Função de tradução
    const translate = (translations?: Record<string, string>, fallback?: string): string => {
        if (!translations) return fallback || ''

        const locale = currentLocale.value

        if (translations[locale]) return translations[locale]

        const baseLocale = locale.split('-')[0]
        if (baseLocale && translations[baseLocale]) return translations[baseLocale]

        if (translations[defaultLocale]) return translations[defaultLocale]

        if (translations['en-US']) return translations['en-US']

        const firstTranslation = Object.values(translations)[0]
        if (firstTranslation) return firstTranslation

        return fallback || ''
    }

    const removeCookie = (name: string) => {
        if (typeof document !== 'undefined') {
            document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
        }
    }

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

    const initialPreference = preferenceCookie.value || defaultTheme
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
            if (!preferenceCookie.value) {
                preference.value = currentTheme
            }
        } else {
            apply(preference.value)
        }
    }

    onMounted(() => {
        if (!shouldApplyColors) return

        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const handleSystemThemeChange = () => {
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
            preferenceCookie.value = preference.value
            resolvedCookie.value = getResolvedTheme(preference.value)
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
        preferenceCookie.value = newPref
        resolvedCookie.value = getResolvedTheme(newPref)
    })

    const theme_toggle = (forceTheme?: string) => {
        const newTheme = forceTheme ?? (preference.value === 'light' ? 'dark' : 'light')
        preference.value = newTheme

        preferenceCookie.value = newTheme
        resolvedCookie.value = getResolvedTheme(newTheme)
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
            colors: theme.colors,
            themes: theme.colors.themes
        },
        theme_data,
        theme_toggle,
        themes,
        updateThemeColors,
        addTheme,
        removeTheme,
        enablePersistence: () => {
            preferenceCookie.value = preference.value
            resolvedCookie.value = getResolvedTheme(preference.value)
        },
        disablePersistence: () => {
            removeCookie('theme-preference')
            removeCookie('theme-resolved')
        },
        currentLocale,
        setLocale: (locale: string) => {
            currentLocale.value = locale
            if (!forcedLocale) {
                localeCookie.value = locale
            }
        },
    }
}