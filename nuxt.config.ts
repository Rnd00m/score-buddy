import { existsSync, readFileSync } from 'node:fs'

// .env.local is gitignored and overrides .env for local secrets (e.g. BGG_API_KEY)
if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf-8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)$/)
    if (!match) continue

    const [, key, rawValue] = match
    process.env[key] = rawValue.trim().replace(/^(['"])(.*)\1$/, '$2')
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
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
      include: ['@vue/devtools-api']
    }
  }
})