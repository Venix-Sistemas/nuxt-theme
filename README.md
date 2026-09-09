# @venix-sistemas/nuxt-theme

[![npm version](https://badge.fury.io/js/@venix%2Fnuxt-theme.svg)](https://badge.fury.io/js/@venix%2Fnuxt-theme)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A complete theme module for Nuxt applications, providing a centralized system for colors, typography, cursor, scrollbar, internationalization and seasonal themes.

## Features

* 🎨 **Dark and light themes**
* 🌈 **Custom color themes**
* 🌐 **Internationalization and locale detection**
* 📝 **Custom typography and font faces**
* 🖱️ **Custom cursor**
* 📜 **Custom scrollbar**
* 🎃 **Seasonal themes** — Carnival, Halloween, Christmas and more
* 💾 **Cookie-based persistence**
* 🖥️ **System theme preference detection**
* ⚡ **Nuxt-native integration**

## Installation

Install the package using your preferred package manager:

```bash
npm install @venix-sistemas/nuxt-theme
```

Or with pnpm:

```bash
pnpm add @venix-sistemas/nuxt-theme
```

## Quick Setup

### 1. Add the module

Add `@venix-sistemas/nuxt-theme` to the `modules` section of your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@venix-sistemas/nuxt-theme'],

  venixTheme: {
    translation: {
      locale: 'pt-BR',
      defaultLocale: 'en-US',
      cookieSync: 'i18n_redirected',
    },

    color: {
      themes: {
        dark: {
          primary: '#FF6B6B',
        },
      },
    },

    scrollbar: true,
    cursor: true,
    typography: true,
  },
})
```

### 2. Use the theme

You can access the theme utilities directly from your components:

```vue
<template>
  <div>
    <button @click="theme_toggle('dark')">
      Dark
    </button>

    <button @click="theme_toggle('light')">
      Light
    </button>
  </div>
</template>

<script setup lang="ts">
const { theme_toggle } = useTheme()
</script>
```

## Configuration

### Module Options

Every feature (`translation`, `color`, `scrollbar`, `cursor`, `typography`) is configured through a single key that accepts either a `boolean` (quick enable/disable) or a config object (which also enables the feature):

| Option        | Type                 | Default | Description                                    |
| ------------- | -------------------- | ------- | ----------------------------------------------- |
| `theme`       | `string`             | —       | Path to a custom theme JSON file                |
| `translation` | `boolean \| object`  | `true`  | Enable or configure locale detection/i18n       |
| `color`       | `boolean \| object`  | `true`  | Enable or configure the color system            |
| `scrollbar`   | `boolean \| object`  | `true`  | Enable or configure the custom scrollbar        |
| `cursor`      | `boolean \| object`  | `true`  | Enable or configure the custom cursor           |
| `typography`  | `boolean \| object`  | `true`  | Enable or configure typography                  |

#### `translation` object

| Property       | Type      | Default              | Description                                       |
| -------------- | --------- | -------------------- | -------------------------------------------------- |
| `locale`       | `string`  | —                     | Force a specific locale                            |
| `defaultLocale`| `string`  | `'en-US'`             | Default fallback locale                            |
| `cookieSync`   | `string`  | `'i18n_redirected'`   | Cookie used to persist/sync the selected locale    |

Setting `translation: false` fully disables locale auto-detection and cookie syncing — useful if another module (e.g. `@nuxtjs/i18n`) already owns that cookie.

#### `color` object

| Property      | Type      | Default  | Description                                          |
| ------------- | --------- | -------- | ----------------------------------------------------- |
| `apply`       | `boolean` | `true`   | Automatically apply the resolved theme (`data-theme`) |
| `defaultColor`| `string`  | `'dark'` | Name of the theme used when no preference is set      |
| `themes`      | `object`  | `{}`     | Override or add custom color themes                   |

## Themes

The module supports dark and light themes and can be extended with custom color configurations.

```typescript
color: {
  themes: {
    dark: {
      primary: '#FF6B6B',
    },

    light: {
      primary: '#FF6B6B',
    },
  },
}
```

Theme preferences can be persisted using cookies and can also follow the user's system preference.

## Internationalization

The module supports locale detection and can integrate with the application's internationalization setup.

The locale resolution can use:

1. The explicitly configured locale
2. The application's locale
3. The persisted locale cookie
4. The browser's preferred language
5. The configured default locale

## Seasonal Themes

Seasonal themes allow the appearance of the application to change automatically based on predefined occasions.

Supported themes include:

* 🎭 Carnival
* 🎃 Halloween
* 🎄 Christmas

Additional seasonal themes can be added as the theme system evolves.

## Development

Clone the repository and install the dependencies:

```bash
pnpm install
```

Start the playground:

```bash
pnpm dev
```

Run the tests:

```bash
pnpm test
```

Build the package:

```bash
pnpm prepack
```

Run the linter:

```bash
pnpm lint
```

## Documentation

* [Online Documentation](https://github.com/seu-usuario/nuxt-theme)
* [Playground](./playground)

## License

MIT License
