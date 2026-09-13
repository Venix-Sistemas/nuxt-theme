export interface TranslationConfig {
  enabled: boolean
  locale: string
  defaultLocale: string
  cookieSync: string
  /**
   * Mantém `<html lang>` sincronizado com o locale resolvido pelo módulo
   * (necessário para leitores de tela pronunciarem os nomes de tema traduzidos
   * corretamente — WCAG 3.1.1). Desligado por padrão: se o projeto já usa um
   * módulo de i18n de verdade (ex.: `@nuxtjs/i18n`), é ELE quem deve ser a
   * fonte de verdade de `lang` — ligar isso aqui ao mesmo tempo pode fazer os
   * dois brigarem pelo atributo. Ligue só em projetos sem i18n de rotas, que
   * usam apenas as traduções de nome de tema deste módulo.
   */
  manageHtmlLang: boolean
}
