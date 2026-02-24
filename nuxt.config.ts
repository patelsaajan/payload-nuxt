// https://nuxt.com/docs/api/configuration/nuxt-config

import { writeFileSync, existsSync, copyFileSync } from 'fs'
import { resolve } from 'path'
import { GET_THEME_SETTINGS } from './graphql/theme'
import { GraphQLClient } from 'graphql-request'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/ui'],
  css: ['~/assets/css/theme-variables.css', '~/assets/css/main.css'],
  ssr: true,

  devServer: {
    port: 4000
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      ignore: ['/preview/**'],
    },
  },

  routeRules: {
    '/preview/**': { ssr: false },
  },

  runtimeConfig: {
    public: {
      payloadBaseUrl: '', // Set in env
      siteName: 'Professional Portfolio & Projects',
      cssConstants: '', // fetched from payload cms
      enabledCollections: '', // NUXT_PUBLIC_ENABLED_COLLECTIONS - comma-separated list of additional collections
    }
  },

  hooks: {
    'build:before': async () => {
      const themeVarsPath = resolve(__dirname, 'app/assets/css/theme-variables.css')
      const baseUrl = process.env.NUXT_PUBLIC_PAYLOAD_BASE_URL

      const defaultCss = `:root {
        --theme-primary: #000000;
        --theme-secondary: #666666;
        --theme-accent: #0066cc;
        --theme-background: #ffffff;
        --theme-text: #000000;
        --theme-text-primary: #ffffff;
        --theme-text-secondary: #ffffff;
        --theme-border-radius: 6px;
      }
`

      if (!baseUrl) {
        console.warn('NUXT_PUBLIC_PAYLOAD_BASE_URL not set. Using default theme.')
        writeFileSync(themeVarsPath, defaultCss)
        return
      }

      const isUp = await fetch(`${baseUrl}/api/build-test`).catch(() => null)
      if (!isUp) {
        console.warn('CMS not found. Using default theme.')
        writeFileSync(themeVarsPath, defaultCss)
        return
      }

      console.log(await isUp.text())
      const client = new GraphQLClient(`${baseUrl}/api/graphql`)
      const themeData: any = await client.request(GET_THEME_SETTINGS)

      if (themeData?.ThemeSetting) {
        console.log('Fetched theme settings from Payload CMS during build.')
        const themeSettings = themeData.ThemeSetting
        const cssVars = `:root {
          --theme-primary: ${themeSettings.primaryColor || '#000000'};
          --theme-secondary: ${themeSettings.secondaryColor || '#666666'};
          --theme-accent: ${themeSettings.accentColor || '#0066cc'};
          --theme-background: ${themeSettings.backgroundColor || '#ffffff'};
          --theme-text: ${themeSettings.textColor || '#000000'};
          --theme-text-primary: ${themeSettings.primaryTextColor || '#ffffff'};
          --theme-text-secondary: ${themeSettings.secondaryTextColor || '#ffffff'};
          --theme-border-radius: ${themeSettings.borderRadius || '6px'};
        }
`
        writeFileSync(themeVarsPath, cssVars)
        console.log('Theme variables written to', themeVarsPath)
      } else {
        console.warn('No theme settings found in Payload CMS. Using defaults.')
        writeFileSync(themeVarsPath, defaultCss)
      }

      // Fetch and save favicon
      const faviconUrl = process.env.NUXT_FAVICON_URL
      const publicDir = resolve(__dirname, 'public')
      const faviconPath = resolve(publicDir, 'favicon.ico')
      const fallbackPath = resolve(publicDir, 'favicon-fallback.ico')

      if (faviconUrl) {
        const fullFaviconUrl = `${baseUrl}${faviconUrl}`
        const faviconResponse = await fetch(fullFaviconUrl).catch(() => null)

        if (faviconResponse?.ok) {
          const faviconBuffer = await faviconResponse.arrayBuffer()
          writeFileSync(faviconPath, Buffer.from(faviconBuffer))
          console.log('Favicon downloaded and saved to', faviconPath)
        } else {
          console.warn('Failed to fetch favicon from', fullFaviconUrl)
          if (existsSync(fallbackPath)) {
            copyFileSync(fallbackPath, faviconPath)
            console.log('Using fallback favicon')
          }
        }
      } else if (existsSync(fallbackPath)) {
        copyFileSync(fallbackPath, faviconPath)
        console.log('No NUXT_FAVICON_URL set, using fallback favicon')
      }
    },
    'nitro:config': async (nitroConfig) => {
      const payloadUrl = process.env.NUXT_PUBLIC_PAYLOAD_BASE_URL
      const enabledCollections = (process.env.NUXT_PUBLIC_ENABLED_COLLECTIONS || '')
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean)

      // Initialize prerender config
      nitroConfig.prerender = nitroConfig.prerender || {}
      nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
      nitroConfig.prerender.ignore = nitroConfig.prerender.ignore || []

      // Ignore disabled collection routes during prerendering
      if (!enabledCollections.includes('portfolios')) {
        nitroConfig.prerender.ignore.push('/portfolio', '/portfolio/**')
      }
      if (!enabledCollections.includes('gallery')) {
        nitroConfig.prerender.ignore.push('/gallery')
      }

      // Fetch all blog slugs from Payload
      const postsResponse = await fetch(`${payloadUrl}/api/posts?limit=1000&depth=0`).catch(() => null)

      if (postsResponse?.ok) {
        const data = await postsResponse.json()
        const blogRoutes = data.docs.map((post: any) => `/blog/${post.slug}`)
        nitroConfig.prerender.routes.push(...blogRoutes)
      }

      // Fetch all portfolio slugs from Payload (only if portfolios collection is enabled)
      if (enabledCollections.includes('portfolios')) {
        const portfolioResponse = await fetch(`${payloadUrl}/api/portfolios?limit=1000&depth=0`).catch(() => null)

        if (portfolioResponse?.ok) {
          const data = await portfolioResponse.json()
          const portfolioRoutes = data.docs.map((portfolio: any) => `/portfolio/${portfolio.slug}`)
          nitroConfig.prerender.routes.push(...portfolioRoutes)
        }
      }
    }
  },

  // Image optimization configuration
  image: {
    // Enable image optimization
    quality: 80,

    // Using nuxt compaitable provider
    provider: 'ipx',

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
    domains: [
      process.env.NUXT_PUBLIC_PAYLOAD_BASE_URL?.replace(/^https?:\/\//, '') || 'localhost:3000'
    ]
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

  experimental: {
    payloadExtraction: false
  },

  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})