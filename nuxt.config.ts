import {config} from 'dotenv'

config({path: '.env.local', override: true})
if (process.env.APP_ENV === 'production') config({path: '.env.production', override: true})

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: {enabled: true},
  ssr: true,
  app: {
    pageTransition: {
      name: 'slide',
      mode: 'out-in'
    },
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
      title: 'Score Buddy',
      meta: [
        {name: 'description', content: 'Score Buddy facilite le suivi des scores pendant vos parties de jeux de société. Plus besoin de papier et crayon : suivez vos scores en temps réel et gardez un historique de vos parties.'},
        {name: 'theme-color', content: '#FFCE00'},
        {property: 'og:type', content: 'website'},
        {property: 'og:site_name', content: 'Score Buddy'},
        {property: 'og:title', content: 'Score Buddy'},
        {property: 'og:description', content: 'Score Buddy facilite le suivi des scores pendant vos parties de jeux de société. Plus besoin de papier et crayon : suivez vos scores en temps réel et gardez un historique de vos parties.'},
        {property: 'og:image', content: `${process.env.APP_BASE_URL}/og-image.png`},
        {property: 'og:image:width', content: '1024'},
        {property: 'og:image:height', content: '1024'},
        {property: 'og:url', content: process.env.APP_BASE_URL},
        {property: 'og:locale', content: 'fr_FR'},
        {property: 'og:locale:alternate', content: 'en_US'},
        {name: 'twitter:card', content: 'summary'},
        {name: 'twitter:title', content: 'Score Buddy'},
        {name: 'twitter:description', content: 'Score Buddy facilite le suivi des scores pendant vos parties de jeux de société. Plus besoin de papier et crayon : suivez vos scores en temps réel et gardez un historique de vos parties.'},
        {name: 'twitter:image', content: `${process.env.APP_BASE_URL}/og-image.png`},
      ],
      link: [
        {rel: 'icon', type: 'image/svg+xml', href: '/logo.svg'},
        {rel: 'alternate icon', type: 'image/x-icon', href: '/favicon.ico'},
        {rel: 'canonical', href: process.env.APP_BASE_URL},
      ],
      script: [
        {
          key: 'color-scheme-init',
          innerHTML: `(function(){try{var s=localStorage.getItem('colorScheme');var isDark=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(isDark){document.documentElement.classList.add('app-dark');}}catch(e){}})();`,
        },
      ],
    },
  },
  runtimeConfig: {
    bggApiKey: process.env.BGG_API_KEY,
    public: {
      bggApiBaseUrl: 'https://boardgamegeek.com/xmlapi2',
      siteUrl: process.env.APP_BASE_URL
    }
  },
  css: ['@/assets/scss/main.scss'],
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/supabase',
    '@nuxtjs/i18n',
  ],
  supabase: {
    redirectOptions: {
      login: '/account/login',
      callback: '/account/callback',
      exclude: ['/**'],
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      {code: 'en', name: 'English', file: 'en.json'},
      {code: 'fr', name: 'Français', file: 'fr.json'},
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'locale',
      redirectOn: 'root',
    },
  },
  primevue: {
    importTheme: { from: '@/themes/default.ts' },
    options: {
      ripple: true
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    optimizeDeps: {
      include: [
        '@capacitor-community/keep-awake',
        '@capacitor/app',
        '@capacitor/core',
        '@capawesome/capacitor-android-edge-to-edge-support',
        '@tanstack/vue-query',
        '@tanstack/vue-query-devtools',
        '@vue/devtools-api',
        'uuid',
      ]
    }
  }
})