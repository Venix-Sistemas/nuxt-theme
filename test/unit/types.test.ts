import { describe, it, expect } from 'vitest'
import type { ThemeColors } from '../../src/shared/types'

describe('types', () => {
  it('ThemeColors deve aceitar propriedades opcionais', () => {
    const colors: ThemeColors = {
      primary: '#FF6B6B',
    }
    expect(colors.primary).toBe('#FF6B6B')
    expect(colors.secondary).toBeUndefined()
  })
})
