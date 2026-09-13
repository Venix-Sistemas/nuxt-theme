<template>
  <span
    v-if="resolved.kind === 'emoji'"
    class="venix-icon venix-icon--emoji"
    v-bind="$attrs"
  >{{ resolved.value }}</span>
  <!-- eslint-disable vue/no-v-html -- SVG vem do config do tema/props do dev consumidor, não de input de usuário final -->
  <span
    v-else-if="resolved.kind === 'svg'"
    class="venix-icon venix-icon--svg"
    v-bind="$attrs"
    v-html="resolved.value"
  />
  <!-- eslint-enable vue/no-v-html -->
  <Icon
    v-else
    class="venix-icon venix-icon--iconify"
    :name="resolved.value"
    :mode="mode"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVenixIcon } from '../composables/useVenixIcon'

defineOptions({ inheritAttrs: false })

const { icon, mode } = defineProps<{
  /** Emoji ('🎨'), nome de ícone Iconify ('line-md:home') ou SVG inline. */
  icon: string
  /**
   * Força o modo de renderização de `@nuxt/icon` para ícones Iconify: `'svg'`
   * (elemento `<svg>` real — necessário para ícones animados como `line-md`)
   * ou `'css'` (background/mask, mais leve, sem animação). Sem efeito para
   * emoji ou SVG inline. Sem valor, usa o modo padrão configurado no módulo.
   */
  mode?: 'css' | 'svg'
}>()

const resolved = useVenixIcon(computed(() => icon))
</script>

<style>
/* SVG inline não tem tamanho intrínseco como emoji (font-size) ou o <Icon> do
   @nuxt/icon (width/height próprios) — sem isso, alguns navegadores colapsam
   a largura em layouts flex. */
.venix-icon--svg svg {
  width: 1em;
  height: 1em;
}
</style>
