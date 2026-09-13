export interface IconOptions {
  enabled: boolean
  /** Coleções Iconify empacotadas localmente (offline), ex.: 'line-md'. */
  collections: string[]
  /** Atalhos: nome curto -> emoji, nome de ícone Iconify ('line-md:home') ou SVG inline. */
  aliases: Record<string, string>
}
