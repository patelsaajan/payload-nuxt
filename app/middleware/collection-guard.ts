export default defineNuxtRouteMiddleware((to) => {
  const { isRouteEnabled } = useEnabledCollections()

  if (!isRouteEnabled(to.path)) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }
})
