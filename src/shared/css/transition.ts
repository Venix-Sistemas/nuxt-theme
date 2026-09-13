// src/shared/css/transition.ts

/** Duração do cross-fade nativo (View Transitions API) ao trocar de tema. */
export function generateThemeTransitionCSS(): string {
  return `\n/* ============================================ */\n`
    + `/* Theme transition                              */\n`
    + `/* ============================================ */\n\n`
    + `::view-transition-old(root),\n`
    + `::view-transition-new(root) {\n`
    + `  animation-duration: 0.3s;\n`
    + `}\n\n`
    // Sem isso, a camada de overlay da transição (que cobre a tela toda
    // enquanto anima) intercepta o hit-test do ponteiro — o cursor customizado
    // (e o hover de elementos por baixo) "trava" no cursor padrão do SO até o
    // mouse se mexer de novo. `pointer-events: none` deixa o hit-test passar
    // direto pro conteúdo real por baixo, como se o overlay não existisse.
    // Aplicado em cada nível da árvore de pseudo-elementos (não só na raiz)
    // com `!important`, para não depender de herança funcionar do mesmo jeito
    // nessa árvore especial em todo navegador.
    + `::view-transition,\n`
    + `::view-transition-group(*),\n`
    + `::view-transition-image-pair(*),\n`
    + `::view-transition-old(*),\n`
    + `::view-transition-new(*) {\n`
    + `  pointer-events: none !important;\n`
    + `}\n`
}
