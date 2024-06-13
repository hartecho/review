// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    pageTransition: {
      name: 'fade', // Use 'fade' as the transition name or choose your own
      mode: 'out-in' // Ensure the new page fades in only after the old page fades out
    },
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/SSLogo.png' },
        // For other formats
        { rel: 'icon', type: 'image/png', href: '/SSLogo.png' },
      ],
    },
  },
  css: ['~/css/Transitions/Fade.css'],
  modules: [
    '@nuxtjs/google-fonts', "@nuxt/image", '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', 'nuxt-vue3-google-signin'
  ],
  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  }
})