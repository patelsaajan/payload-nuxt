// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],

  ssr: true,

  devServer: {
    port: 4000
  },

  runtimeConfig: {
    public: {
      payloadBaseUrl: '' // Set in env
    }
  },

  // Image optimization configuration
  image: {
    // Enable image optimization
    quality: 80,

    // Image formats to generate
    format: ['webp'],

    // Responsive image sizes
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },

    // Allow external domains (for Payload media)
    domains: []
  },

  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'accent'
      ]
    }
  },

  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
  }
})