```markdown
# @venix/nuxt-theme

[![npm version](https://badge.fury.io/js/@venix%2Fnuxt-theme.svg)](https://badge.fury.io/js/@venix%2Fnuxt-theme)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Theme module for Nuxt with colors, typography, scrollbar and cursor customization

## Features

- 🎨 **Color themes** with dark/light mode
- 🌐 **Internationalization** with automatic locale detection
- 📝 **Custom typography** with font faces
- 🖱️ **Custom cursor** support
- 📜 **Custom scrollbar** styling
- 🌈 **Seasonal themes** (Carnival, Christmas, Halloween)
- 💾 **Persistence** with cookies
- 🔄 **System preference** detection

## Quick Setup

### 1. Install the module:

```bash
npm install @venix/nuxt-theme
```

### 2. Add to `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@venix/nuxt-theme'],
  
  venixTheme: {
    // Enable features
    typography: true,
    customScrollbar: true,
    customCursor: true,
    colors: true,
    applyColors: true,
    
    // Customize themes
    colorThemes: {
      dark: {
        primary: '#FF6B6B',
      }
    }
  }
})
```

### 3. Use in your app:

```vue
<template>
  <div>
    <button @click="theme_toggle('dark')">Dark</button>
    <button @click="theme_toggle('light')">Light</button>
  </div>
</template>

<script setup>
const { theme_toggle } = useTheme()
</script>
```

## Configuration

### Module Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `string` | - | Path to custom theme JSON |
| `typography` | `boolean \| object` | `true` | Enable/configure typography |
| `customScrollbar` | `boolean \| object` | `true` | Enable/configure scrollbar |
| `customCursor` | `boolean \| object` | `true` | Enable/configure cursor |
| `colors` | `boolean` | `true` | Enable colors |
| `applyColors` | `boolean` | `true` | Auto-apply colors |
| `colorThemes` | `object` | `{}` | Customize color themes |
| `localeCookie` | `string` | `'i18n_redirected'` | Cookie name for locale |
| `defaultLocale` | `string` | `'en-US'` | Fallback locale |
| `locale` | `string` | - | Force specific locale |

## Documentation

- [Online documentation](https://github.com/seu-usuario/nuxt-theme)
- [Examples](./playground)

## Development

```bash
# Install dependencies
pnpm install

# Run playground
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm prepack

# Lint
pnpm lint
```

## License

MIT
```