export default defineEventHandler((event) => {
  // Skip API routes
  if (event.path.startsWith('/api/')) {
    return
  }

  // Add cache tags to responses based on the route
  const path = event.path

  // Homepage
  if (path === '/' || path === '') {
    setResponseHeader(event, 'Cache-Tag', 'page-home')
  }
  // Blog posts
  else if (path.startsWith('/blog/') && path !== '/blog' && path !== '/blog/') {
    const slug = path.replace('/blog/', '')
    setResponseHeader(event, 'Cache-Tag', `post-${slug}`)
  }
  // Blog index
  else if (path === '/blog' || path === '/blog/') {
    setResponseHeader(event, 'Cache-Tag', 'posts-index')
  }
  // Other pages
  else {
    const slug = path.replace('/', '')
    if (slug) {
      setResponseHeader(event, 'Cache-Tag', `page-${slug}`)
    }
  }
})
