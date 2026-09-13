// runtime/composables/useThemeCookies.ts
import { useCookie } from '#app'
import {
  THEME_PREFERENCE_COOKIE,
  THEME_RESOLVED_COOKIE,
  DEFAULT_LOCALE_COOKIE_NAME,
} from '../../shared/constants'
import { hasCookieConsent } from '../../shared/utils/consent'

export const useThemeCookies = (localeCookieName: string = DEFAULT_LOCALE_COOKIE_NAME) => {
  const preferenceCookie = useCookie<string>(THEME_PREFERENCE_COOKIE)
  const resolvedCookie = useCookie<string>(THEME_RESOLVED_COOKIE)
  const localeCookie = useCookie<string>(localeCookieName)

  const removeCookie = (name: string) => {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
    }
  }

  // Só grava se o app consumidor já registrou consentimento de cookies
  // funcionais — chamado tanto automaticamente (a cada troca de tema) quanto
  // explicitamente via `persistence.enable()`.
  const persistIfConsented = (preference: string, resolved: string) => {
    if (!hasCookieConsent()) return
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
    persistIfConsented,
    disablePersistence,
  }
}
