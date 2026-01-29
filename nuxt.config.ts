// https://nuxt.com/docs/api/configuration/nuxt-config

import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { GET_THEME_SETTINGS } from './graphql/theme'
import { GraphQLClient } from 'graphql-request'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/ui'],
  css: ['~/assets/css/theme-variables.css', '~/assets/css/main.css'],
  
  devServer: {
    port: 4000
  },
  
  runtimeConfig: {
    public: {
      payloadBaseUrl: '', // Set in env
      cssConstants: '' // fetched from payload cms
    }
  },

  hooks: {
    'build:before': async () => {
      const themeVarsPath = resolve(__dirname, 'app/assets/css/theme-variables.css')

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

      const isUp = await fetch(`${process.env.NUXT_PUBLIC_PAYLOAD_BASE_URL}/api/build-test`).catch(() => null)
      if (!isUp) {
        console.warn('CMS not found. Using default theme.')
        writeFileSync(themeVarsPath, defaultCss)
        return
      }

      console.log(await isUp.text())
      const client = new GraphQLClient(`${process.env.NUXT_PUBLIC_PAYLOAD_BASE_URL}/api/graphql`)
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