export default defineNuxtConfig({
  modules: ['@venix-sistemas/nuxt-theme'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',

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
      customFonts: [
        {
          name: 'New Rocker',
          // preload: true,
          sources: {
            woff2: '/fonts/New_Rocker/NewRocker-Regular.woff2',
          },
          // weight: "normal",
          // style: "normal"
        },
      ],
    },

    // Cursor customizado
    cursor: {
      // enabled: true,

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
    },
  },
})
