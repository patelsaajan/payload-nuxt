export default defineNuxtPlugin(async () => {
  const { fetchThemeSettings } = usePayloadGraphQL()

  try {
    const themeSettings = await fetchThemeSettings()

    if (themeSettings) {
      const styleEl = document.createElement('style')
      styleEl.id = 'theme-css-vars'
      styleEl.textContent = `
        :root {
          --theme-primary: ${themeSettings.primaryColor || '#000000'} !important;
          --theme-secondary: ${themeSettings.secondaryColor || '#666666'} !important;
          --theme-accent: ${themeSettings.accentColor || '#0066cc'} !important;
          --theme-background: ${themeSettings.backgroundColor || '#ffffff'} !important;
          --theme-text: ${themeSettings.textColor || '#000000'} !important;
          --theme-text-primary: ${themeSettings.primaryTextColor || '#ffffff'} !important;
          --theme-text-secondary: ${themeSettings.secondaryTextColor || '#ffffff'} !important;
          --theme-border-radius: ${themeSettings.borderRadius || '6px'} !important;
        }
      `
      document.head.appendChild(styleEl)
    }
  } catch (error) {
    console.error('Failed to load theme settings:', error)
  }
})
