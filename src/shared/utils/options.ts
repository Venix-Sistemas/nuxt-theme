/**
 * Resolve uma opção de módulo no formato `boolean | Partial<Config>` contra uma
 * configuração base. `false` desabilita o recurso, um objeto habilita e mescla
 * customizações, e `true`/`undefined` mantém a configuração base intacta.
 */
export function resolveFeatureOption<T extends { enabled: boolean }>(
  option: boolean | Partial<T> | undefined,
  base: T,
): T {
  if (option === false) {
    return { ...base, enabled: false }
  }

  if (typeof option === 'object' && option !== null) {
    return { ...base, ...option, enabled: option.enabled ?? true }
  }

  return base
}
