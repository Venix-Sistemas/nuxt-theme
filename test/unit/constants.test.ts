import { describe, it, expect } from 'vitest'
import {
  THEME_PREFERENCE_COOKIE,
  THEME_RESOLVED_COOKIE,
  DEFAULT_LOCALE,
  DEFAULT_THEME,
} from '../../src/shared/constants'

describe('constants', () => {
  it('deve ter cookies definidos', () => {
    expect(THEME_PREFERENCE_COOKIE).toBe('venix-theme-preference')
    expect(THEME_RESOLVED_COOKIE).toBe('venix-theme-resolved')
  })

  it('deve ter valores padrão', () => {
    expect(DEFAULT_LOCALE).toBe('en-US')
    expect(DEFAULT_THEME).toBe('dark')
  })
})
