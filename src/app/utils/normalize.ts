// src/app/utils/normalize.ts
import { LOCALE_MAP, DEFAULT_LOCALE } from '../constants'

/**
 * Normaliza um locale para o formato padrão
 * Ex: "pt" -> "pt-BR", "PT-br" -> "pt-BR"
 */
export function normalizeLocale(locale: string): string {
  if (!locale) return DEFAULT_LOCALE

  const lowerLocale = locale.toLowerCase()

  // Se já está no formato correto (pt-BR), retorna
  if (lowerLocale.includes('-')) {
    const parts = lowerLocale.split('-')
    const base = parts[0]
    const region = parts[1]

    // Verifica se base e region existem
    if (base && region) {
      return `${base}-${region.toUpperCase()}`
    }

    // Se não tem region, usa só o base
    return base || lowerLocale
  }

  // Usa o mapa para converter
  return LOCALE_MAP[lowerLocale] || lowerLocale
}

/**
 * Extrai o primeiro locale de um header Accept-Language
 * Ex: "pt-BR,pt;q=0.9,en;q=0.8" -> "pt-BR"
 */
export function extractFirstLocale(acceptLanguage: string): string | null {
  if (!acceptLanguage) return null

  const parts = acceptLanguage.split(',')
  if (parts.length === 0) return null

  const firstPart = parts[0]
  if (!firstPart) return null

  const localeParts = firstPart.split(';')
  if (localeParts.length === 0) return null

  const firstLocale = localeParts[0]?.trim()
  return firstLocale || null
}

/**
 * Normaliza uma cor hexadecimal
 * Ex: "fff" -> "#FFF", "ffffff" -> "#FFFFFF", "#fff" -> "#FFF"
 */
export function normalizeColor(color: string): string {
  if (!color) return color

  // Remove espaços
  color = color.trim()

  // Adiciona # se não tiver
  if (!color.startsWith('#')) {
    color = `#${color}`
  }

  return color
}

/**
 * Normaliza o nome de um tema
 * Ex: "dark" -> "Dark", "DARK" -> "Dark"
 */
export function normalizeThemeName(name: string): string {
  if (!name) return name
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}
