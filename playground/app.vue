<template>
  <div class="playground">
    <header class="header">
      <h1>🎨 Nuxt Theme Playground</h1>
      <p>Teste interativo do módulo de temas</p>
    </header>


    <main class="content">


      <h1> Whereas disregard and contempt for human rights have resulted
      </h1>
      <br>

      <!-- Seletor de Temas -->
      <section class="section">
        <h2>Seletor de Temas</h2>
        <client-only>
          <div class="theme-buttons">
            <button v-for="item in themes" :key="item.value" @click="theme_toggle(item.value)"
              :class="{ active: item.value === theme.preference.value }" class="theme-button">
              <ThemeIcon :name="item.icon" />
              <span>{{ item.name }}</span>
            </button>
          </div>
        </client-only>
      </section>

      <!-- Paleta de Cores -->
      <section class="section">
        <h2>Paleta de Cores - {{ currentThemeName }}</h2>
        <client-only>
          <div class="color-grid">
            <div v-for="color in colorList" :key="color.name" class="color-card">
              <div class="color-preview" :style="{ backgroundColor: color.value }"></div>
              <span class="color-name">{{ formatColorName(color.name) }}</span>
              <code class="color-value">{{ color.value }}</code>
            </div>
          </div>
        </client-only>
      </section>

      <!-- Teste de Scroll Vertical -->
      <section class="section">
        <h2>Scroll Vertical</h2>
        <div class="scroll-vertical">
          <div v-for="i in 20" :key="`vertical-${i}`" class="scroll-item">
            Item vertical {{ i }}
          </div>
        </div>
      </section>

      <!-- Teste de Scroll Horizontal -->
      <section class="section">
        <h2>Scroll Horizontal</h2>
        <div class="scroll-horizontal">
          <div v-for="i in 20" :key="`horizontal-${i}`" class="scroll-item-horizontal">
            Item {{ i }}
          </div>
        </div>
      </section>

      <!-- Botões de Ação -->
      <section class="section">
        <h2>Ações</h2>
        <client-only>
          <div class="actions">
            <button @click="toggleTheme" class="action-button">
              Alternar Light/Dark
            </button>
            <button @click="changePrimaryColor" class="action-button">
              Mudar Cor Primária
            </button>
          </div>
        </client-only>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import themeData from '../src/app/theme.json'

const {
  theme,
  themes,
  theme_toggle,
  theme_data,
  updateThemeColors,
} = useTheme()

const activeTheme = ref('')

onMounted(() => {
  activeTheme.value = theme.preference.value || 'dark'
})

watch(() => theme.preference.value, (newTheme) => {
  activeTheme.value = newTheme || 'dark'
})

const currentThemeName = computed(() => {
  return theme_data?.value?.name || activeTheme.value || 'dark'
})

const formatColorName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/(\d+)/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

const colorList = computed(() => {
  const currentTheme = activeTheme.value || theme.preference.value || 'dark'
  const themeColors = themeData.colors.themes[currentTheme as keyof typeof themeData.colors.themes]

  if (!themeColors) return []

  return Object.entries(themeColors)
    .filter(([key]) => !['dark', 'seasonal', 'dateRange', 'translations', 'icon'].includes(key))
    .filter(([, value]) => typeof value === 'string' && value.startsWith('#'))
    .map(([name, value]) => ({
      name,
      value: value as string
    }))
})

const toggleTheme = () => {
  theme_toggle()
}

const changePrimaryColor = () => {
  const colors = ['#FF6B6B', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#00BCD4']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  const currentTheme = activeTheme.value || theme.preference.value || 'dark'
  updateThemeColors(currentTheme, {
    primary: randomColor,
  })
}
</script>

<style>
:root {
  --color-primary: #FF6B6B;
  --color-secondary: #FFB96A;
  --color-background: #0F0F0F;
  --color-background2: #191919;
  --color-background3: #232323;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-base, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  background: var(--color-background);
  color: var(--color-primary);
  transition: all 0.3s ease;
}

.playground {
  min-height: 100vh;
}

.header {
  text-align: center;
  padding: 2rem;
  background: var(--color-background2);
  border-bottom: 1px solid var(--color-background3);
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.section {
  background: var(--color-background2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-background3);
}

.section h2 {
  margin-bottom: 1rem;
  color: var(--color-secondary);
}

.theme-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.theme-button {
  padding: 0.75rem 1.25rem;
  border: 2px solid var(--color-background3);
  border-radius: 8px;
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-button:hover {
  border-color: var(--color-primary);
}

.theme-button.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-background);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.color-card {
  background: var(--color-background3);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
}

.color-preview {
  width: 100%;
  height: 100px;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  border: 2px solid var(--color-background3);
}

.color-name {
  display: block;
  font-size: 0.9rem;
  color: var(--color-secondary);
  margin-bottom: 0.25rem;
}

.color-value {
  font-size: 0.8rem;
  color: var(--color-primary);
  font-family: monospace;
}

.squares-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.color-square {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0.5rem;
  border: 3px solid var(--color-background3);
}

.square-label {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  text-align: center;
  width: 100%;
}

/* Scroll Vertical */
.scroll-vertical {
  height: 300px;
  overflow-y: auto;
  background: var(--color-background3);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.scroll-item {
  padding: 1rem;
  background: var(--color-background2);
  border-radius: 4px;
  color: var(--color-primary);
  text-align: center;
  flex-shrink: 0;
}

/* Scroll Horizontal */
.scroll-horizontal {
  overflow-x: auto;
  background: var(--color-background3);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  white-space: nowrap;
}

.scroll-item-horizontal {
  padding: 2rem;
  background: var(--color-background2);
  border-radius: 4px;
  color: var(--color-primary);
  text-align: center;
  min-width: 200px;
  flex-shrink: 0;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.action-button {
  padding: 0.75rem 1.25rem;
  border: 2px solid var(--color-secondary);
  border-radius: 8px;
  background: transparent;
  color: var(--color-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: var(--color-secondary);
  color: var(--color-background);
}
</style>