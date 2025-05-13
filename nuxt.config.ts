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
        { rel: 'icon', type: 'image/x-icon', href: '/SSLogo.webp' },
        { rel: 'icon', type: 'image/webp', href: '/SSLogo.webp' },
      ],
    },
  },

  css: ['~/css/Transitions/Fade.css'],

  modules: [
    '@nuxtjs/google-fonts', "@nuxt/image", '@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', 'nuxt-vue3-google-signin'
  ],

  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },

  runtimeConfig: {    
    private: {
      JWT_SECRET: process.env.JWT_SECRET,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      DB_URI: process.env.DB_URI,
      RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    },
      

      // Public keys that are exposed to the client
    public: {
      // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    }
  },

  ignore: process.env.NODE_ENV === 'production' 
    ? [
        'pages/claims.vue',
        'pages/profile.vue'
      ] 
    : [],

  compatibilityDate: '2024-08-19',
})