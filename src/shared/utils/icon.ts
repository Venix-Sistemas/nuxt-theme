import type { ThemeIconFormats } from '../types/colors'

export type IconKind = 'emoji' | 'icon' | 'svg'

export interface ResolvedIcon {
  kind: IconKind
  value: string
}

/**
 * Resolve um valor de ícone para o tipo de renderização correto:
 * - SVG inline (começa com `<svg`)
 * - nome de ícone Iconify (formato `coleção:nome`, ex.: `line-md:home`)
 * - emoji/texto (qualquer outro valor)
 *
 * Aliases são resolvidos primeiro, então o valor resultante passa pela mesma
 * detecção — um alias pode apontar para qualquer um dos três formatos.
 */
export function resolveIcon(input: string, aliases: Record<string, string> = {}): ResolvedIcon {
  const value = (aliases[input] ?? input).trim()

  if (/^<svg[\s>]/i.test(value)) {
    return { kind: 'svg', value }
  }

  if (/^[\w-]+:[\w-]+$/.test(value)) {
    return { kind: 'icon', value }
  }

  return { kind: 'emoji', value }
}

export type ThemeIconFormat = 'emote' | 'css' | 'svg'

export interface ResolvedThemeIcon {
  format: ThemeIconFormat
  value: string
}

/**
 * Resolve o ícone de um tema de cor (string legada, sempre emote, ou um
 * `ThemeIconFormats` com variantes) para o formato preferido, caindo para
 * `emote` quando o tema não define o formato escolhido.
 */
export function resolveThemeIcon(
  icon: string | ThemeIconFormats | undefined,
  preferred: ThemeIconFormat,
): ResolvedThemeIcon | null {
  if (!icon) return null

  if (typeof icon === 'string') {
    return { format: 'emote', value: icon }
  }

  if (preferred !== 'emote' && icon[preferred]) {
    return { format: preferred, value: icon[preferred] }
  }

  return { format: 'emote', value: icon.emote }
}
