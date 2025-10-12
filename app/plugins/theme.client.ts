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
          --theme-action: ${themeSettings.actionColor || '#0066cc'} !important;
          --theme-background: ${themeSettings.backgroundColor || '#ffffff'} !important;
        }
      `
      document.head.appendChild(styleEl)
    }
  } catch (error) {
    console.error('Failed to load theme settings:', error)
  }
})
