interface RevalidateRequest {
  keys?: string[]
  patterns?: string[]
}

interface RevalidateResponse {
  success: boolean
  revalidated: string[]
  timestamp: string
}

export default defineEventHandler(async (event): Promise<RevalidateResponse> => {
  const config = useRuntimeConfig()
  const secret = config.cachePurgeSecret

  // Validate authentication
  const authHeader = getHeader(event, 'X-Cache-Purge-Secret') ||
                     getHeader(event, 'x-cache-purge-secret') ||
                     event.node.req.headers['x-cache-purge-secret']

  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cache purge secret not configured',
    })
  }

  if (!authHeader || authHeader !== secret) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid or missing cache purge secret',
    })
  }

  const body = await readBody<RevalidateRequest>(event)

  if (!body || (!body.keys && !body.patterns)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad request: Must provide keys or patterns to revalidate',
    })
  }

  const revalidated: string[] = []
  // Use the request host to build the base URL
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const host = getHeader(event, 'host') || 'localhost:4000'
  const baseUrl = `${protocol}://${host}`

  console.log('[Cache Revalidate] Using base URL:', baseUrl)

  try {
    console.log('[Cache Revalidate] Request received:', { keys: body.keys, patterns: body.patterns })

    // Build list of paths to revalidate
    const pathsToRevalidate: string[] = []

    if (body.keys) {
      for (const key of body.keys) {
        if (key.startsWith('post-')) {
          const slug = key.replace('post-', '')
          pathsToRevalidate.push(`/blog/${slug}`)
          revalidated.push(key)
        } else if (key.startsWith('page-')) {
          const slug = key.replace('page-', '')
          const path = slug === 'home' ? '/' : `/${slug}`
          pathsToRevalidate.push(path)
          revalidated.push(key)
        }
      }
    }

    if (body.patterns) {
      for (const pattern of body.patterns) {
        if (pattern === 'posts-*') {
          pathsToRevalidate.push('/blog')
          revalidated.push('blog-index')
        }
      }
    }

    console.log('[Cache Revalidate] Paths to revalidate:', pathsToRevalidate)

    // Make GET requests with cache-busting to trigger revalidation
    // This forces Vercel to fetch fresh content and update the edge cache
    const revalidatePromises = pathsToRevalidate.map(async (path) => {
      try {
        // Add timestamp to bust cache
        const cacheBuster = `?_revalidate=${Date.now()}`
        const response = await fetch(`${baseUrl}${path}${cacheBuster}`, {
          method: 'GET',
          headers: {
            'x-prerender-revalidate': secret, // Vercel ISR secret
          },
        })
        console.log(`[Cache Revalidate] Revalidated ${path}: ${response.status}`)
      } catch (error) {
        console.error(`[Cache Revalidate] Failed to revalidate ${path}:`, error)
      }
    })

    await Promise.all(revalidatePromises)

    console.log('[Cache Revalidate] Complete:', revalidated)

    return {
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[Cache Revalidate] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during cache revalidation',
    })
  }
})
