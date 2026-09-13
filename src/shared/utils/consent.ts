// src/shared/utils/consent.ts
import { COOKIE_CONSENT_STORAGE_KEY } from '../constants'

/**
 * Lê o consentimento de cookies funcionais gravado em `localStorage` sob
 * `COOKIE_CONSENT_STORAGE_KEY` — nunca escrito por este módulo por conta
 * própria (só via `persistence.grant()/revoke()`), podendo também vir da UI
 * de consentimento de cookies do app consumidor, desde que grave no mesmo
 * formato (`{ functionality: boolean }`).
 */
export function hasCookieConsent(): boolean {
  if (typeof localStorage === 'undefined') return false

  const consentData = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
  if (!consentData) return false

  try {
    const consent = JSON.parse(consentData)
    return consent?.functionality === true
  }
  catch {
    return false
  }
}
