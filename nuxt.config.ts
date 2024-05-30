// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    pageTransition: {
      name: 'fade', // Use 'fade' as the transition name or choose your own
      mode: 'out-in' // Ensure the new page fades in only after the old page fades out
    }
  },
  css: ['~/css/Transitions/Fade.css'],
  modules: [
    '@nuxtjs/google-fonts', "@nuxt/image", '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'
  ],
})