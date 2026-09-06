// runtime/composables/useThemeCookies.ts
import { useCookie } from '#app'
import {
  THEME_PREFERENCE_COOKIE,
  THEME_RESOLVED_COOKIE,
  DEFAULT_LOCALE_COOKIE_NAME,
} from '../../app/constants'

export const useThemeCookies = () => {
  const preferenceCookie = useCookie<string>(THEME_PREFERENCE_COOKIE)
  const resolvedCookie = useCookie<string>(THEME_RESOLVED_COOKIE)
  const localeCookie = useCookie<string>(DEFAULT_LOCALE_COOKIE_NAME)

  const removeCookie = (name: string) => {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
    }
  }

  const enablePersistence = (preference: string, resolved: string) => {
    preferenceCookie.value = preference
    resolvedCookie.value = resolved
  }

  const disablePersistence = () => {
    removeCookie(THEME_PREFERENCE_COOKIE)
    removeCookie(THEME_RESOLVED_COOKIE)
  }

  return {
    preferenceCookie,
    resolvedCookie,
    localeCookie,
    enablePersistence,
    disablePersistence,
  }
}
