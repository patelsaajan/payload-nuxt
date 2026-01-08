export default defineNuxtPlugin(async () => {
  // Check if theme styles are already applied to prevent refetching
  if (document.getElementById('theme-css-vars')) {
    return
  }

  const { fetchThemeSettings } = usePayloadGraphQL()

  try {
    const { data: themeSettings } = await fetchThemeSettings()

    if (themeSettings.value) {
      const styleEl = document.createElement('style')
      styleEl.id = 'theme-css-vars'
      styleEl.textContent = `
        :root {
          --theme-primary: ${themeSettings.value.primaryColor || '#000000'} !important;
          --theme-secondary: ${themeSettings.value.secondaryColor || '#666666'} !important;
          --theme-accent: ${themeSettings.value.accentColor || '#0066cc'} !important;
          --theme-background: ${themeSettings.value.backgroundColor || '#ffffff'} !important;
          --theme-text: ${themeSettings.value.textColor || '#000000'} !important;
          --theme-text-primary: ${themeSettings.value.primaryTextColor || '#ffffff'} !important;
          --theme-text-secondary: ${themeSettings.value.secondaryTextColor || '#ffffff'} !important;
          --theme-border-radius: ${themeSettings.value.borderRadius || '6px'} !important;
        }
      `
      document.head.appendChild(styleEl)
    }
  } catch (error) {
    console.error('Failed to load theme settings:', error)
  }
})
