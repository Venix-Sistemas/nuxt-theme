export default defineNuxtConfig({
  modules: ['@venix-sistemas/nuxt-theme', '@unocss/nuxt', '@nuxtjs/i18n'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',

  // Instalado só para testar a compatibilidade do módulo de tema com um
  // sistema de i18n de verdade rodando ao lado (rotas localizadas, `$t()`,
  // `useI18n()`, troca de idioma) — ver seção "Idiomas" no app.vue.
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English' },
      { code: 'pt', iso: 'pt-BR', name: 'Português' },
      { code: 'es', iso: 'es-ES', name: 'Español' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
  },

  venixTheme: {

    // Tradução / locale
    translation: {
      // locale: 'pt-BR',
      // defaultLocale: 'en-US',
      // cookieSync: 'i18n_redirected',
    },

    // Tipografia customizada
    typography: {
      // defaultFonts: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      // fontSize: "16px",

    },

    // Cursor customizado
    cursor: {
      enabled: true,

      /*
      cursors: {
        default: {
          path: "/images/ui/cursor/cursor.png",
          hotspot: "0 0"
        },
        pointer: {
          path: "/images/ui/cursor/cursor-hand2.png",
          hotspot: "0 0"
        },
        text: {
          path: "/images/ui/cursor/cursor-text.png",
          hotspot: "12 12"
        }
      }
      */

    },

    // Scrollbar customizada
    scrollbar: {
      // width: "10px",
      // borderRadius: "8px",
      // borderWidth: "2px",
      // colors: {
      //  thumb: "primary",
      //  thumbHover: "secondary",
      //  track: "background2",
      //  border: "background3"
      // }
    },

    // Cores customizadas
    color: {
      // defaultColor: 'dark',
      themes: {
        // dark: {
        //  primary: '#FF0000',
        //  secondary: '#00FF00',
        // }
      },
      // Formato preferido do ícone de cada tema quando ele define `icon` como
      // objeto (`{ emote, css, svg }`) em vez de emoji simples — 'svg' usa
      // @nuxt/icon em modo SVG (necessário pra ícones animados como line-md).
      // Cai pra 'emote' automaticamente nos temas que só têm emoji.
      iconFormat: 'svg',
    },

    // Vuetify: ative com `vuetify: true` em projetos que usam vuetify-nuxt-module
    // (deve vir antes dele em `modules`). Veja a seção "Vuetify integration" no README.

    // Ícones: <VenixIcon icon="..." /> aceita emoji, nome Iconify (ex.: 'line-md:home',
    // animado) ou SVG inline. `aliases` cria atalhos para qualquer um dos três formatos.
    icon: {
      aliases: {
        home: 'line-md:home',
        favorite: 'line-md:heart-filled',
        star: '⭐',
      },
    },
  },
})
