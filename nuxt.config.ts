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
  },
  runtimeConfig: {    
    // Public keys that are exposed to the client
    JWT_SECRET: process.env.JWT_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      DB_URI: process.env.DB_URI,
      
    public: {
      JWT_SECRET: process.env.JWT_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      DB_URI: process.env.DB_URI,
    }
  },
  ignore: process.env.NODE_ENV === 'production' 
    ? [
        'pages/blog/editBlogs.vue', 
        'pages/contractor/editContractors.vue',
        'pages/item/editItems.vue',
        'pages/user/editUsers.vue',
        'pages/claims.vue',
        'pages/profile.vue'
      ] 
    : [],
})