// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],

  devServer: {
    port: 4000
  },

  runtimeConfig: {
    // Private server-side config
    cachePurgeSecret: '', // Set via NUXT_CACHE_PURGE_SECRET env var

    public: {
      payloadBaseUrl: '' // Set in env
    }
  },

  // Caching Strategy for Vercel
  routeRules: {
    // Homepage: Cache for 1 minute on edge (shorter for quicker updates)
    '/': {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    },

    // Blog index: Cache for 1 minute (updates more frequently)
    '/blog': {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    },

    // Individual blog posts: Cache for 2 minutes
    '/blog/**': {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240'
      }
    },

    // Dynamic pages: Cache for 1 minute
    '/**': {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    },

    // Cache API endpoints - no caching
    '/api/cache/**': { cache: false },

    // API routes remain dynamic (no caching)
    '/api/**': { cors: true },
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
  },

  // Nitro (server) configuration for caching
  nitro: {
    compressPublicAssets: true,

    // Add cache headers for static assets
    routeRules: {
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/favicon.ico': { headers: { 'cache-control': 'public, max-age=31536000' } }
    }
  }
})