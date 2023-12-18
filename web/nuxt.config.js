// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Message',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  css: [
    '@/assets/css/tailwind.css',
    '@fontsource/inter/400.css',
  ],

  devtools: { enabled: false },
  modules: ['@nuxt/ui', '@sidebase/nuxt-auth', '@vueuse/nuxt', '@pinia/nuxt'],
  ui: {
    icons: ['solar'],
  },
  colorMode: {
    preference: 'light',
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
      wsUrl: process.env.WS_URL,
    },
  },

  auth: {
    origin: process.env.ORIGIN_URL,
    baseURL: process.env.API_URL,
    provider: {
      type: 'local',
      sessionDataType: {
        id: 'string',
        name: 'string',
        email: 'string',
        messages: 'string'
      },
      token: {
        maxAgeInSeconds: 8 * 60 * 60,
      },
    },
    globalAppMiddleware: true,
  },
})
