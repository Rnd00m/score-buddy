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
  },
  runtimeConfig: {
    bggApiKey: process.env.BGG_API_KEY,
    public: {
      bggApiBaseUrl: 'https://boardgamegeek.com/xmlapi2'
    }
  },
  css: ['@/assets/scss/main.scss'],
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/supabase',
  ],
  supabase: {
    redirectOptions: {
      login: '/account/login',
      callback: '/account/callback',
      exclude: ['/**'],
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
        '@capacitor/app',
        '@capacitor-community/keep-awake',
        '@tanstack/vue-query',
        '@tanstack/vue-query-devtools',
        '@vue/devtools-api',
        'uuid',
      ]
    }
  }
})