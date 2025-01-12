import Lara from '@primevue/themes/lara';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {enabled: true},
  css: ['@/assets/scss/main.scss'],
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt'
  ],
  primevue: {
    options: {
      theme: {
        preset: Lara,
        options: {
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities'
          }
        }
      }
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})