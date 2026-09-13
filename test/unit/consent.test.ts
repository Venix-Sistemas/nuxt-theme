import { describe, it, expect, afterEach, vi } from 'vitest'
import { hasCookieConsent } from '../../src/shared/utils/consent'

function mockLocalStorage(value: string | null) {
  vi.stubGlobal('localStorage', {
    getItem: () => value,
  })
}

describe('hasCookieConsent', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('deve retornar false se localStorage não existir (SSR)', () => {
    vi.stubGlobal('localStorage', undefined)
    expect(hasCookieConsent()).toBe(false)
  })

  it('deve retornar false se não houver nada gravado', () => {
    mockLocalStorage(null)
    expect(hasCookieConsent()).toBe(false)
  })

  it('deve retornar false se o JSON gravado for inválido', () => {
    mockLocalStorage('{ invalid json')
    expect(hasCookieConsent()).toBe(false)
  })

  it('deve retornar false se functionality não for true', () => {
    mockLocalStorage(JSON.stringify({ functionality: false }))
    expect(hasCookieConsent()).toBe(false)
  })

  it('deve retornar true se functionality for true', () => {
    mockLocalStorage(JSON.stringify({ functionality: true }))
    expect(hasCookieConsent()).toBe(true)
  })
})
