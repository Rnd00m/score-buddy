import {config} from 'dotenv'

config({path: '.env.local', override: true})
if (process.env.APP_ENV === 'production') config({path: '.env.production', override: true})

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: {enabled: true},
  ssr: false,
  app: {
    pageTransition: {
      name: 'slide',
      mode: 'out-in'
    },
    head: {
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
      siteUrl: 'https://score-buddy.vercel.app'
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