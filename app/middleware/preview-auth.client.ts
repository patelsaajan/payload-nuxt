/**
 * Client-side middleware to protect preview pages from direct access.
 * Only allows access when loaded inside an iframe from the Payload admin panel.
 */
export default defineNuxtRouteMiddleware(() => {
  const config = useRuntimeConfig()

  const isInIframe = window.self !== window.top
  const referrer = document.referrer
  const adminUrl = config.public.payloadBaseUrl

  // Check if:
  // 1. Page is loaded inside an iframe
  // 2. Referrer matches the Payload admin panel URL
  const isFromAdminPanel = referrer && adminUrl && referrer.startsWith(adminUrl)

  if (!isInIframe || !isFromAdminPanel) {
    return navigateTo('/', { replace: true })
  }
})
