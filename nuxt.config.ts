export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {enabled: true},
  ssr: false,
  css: ['@/assets/scss/main.scss'],
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],
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
})