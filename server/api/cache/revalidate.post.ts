interface RevalidateRequest {
  keys?: string[]
  patterns?: string[]
}

interface RevalidateResponse {
  success: boolean
  purged: string[]  // Match the format Payload expects
  failed: string[]
  timestamp: string
}

export default defineEventHandler(async (event): Promise<RevalidateResponse> => {
  const config = useRuntimeConfig()
  const secret = config.cachePurgeSecret
  const vercelToken = config.vercelToken || process.env.VERCEL_TOKEN

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

  const purged: string[] = []
  const failed: string[] = []

  // Use the request host to build the base URL
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'
  const protocol = isProduction ? 'https' : 'http'
  const host = getHeader(event, 'host') || 'localhost:4000'
  const baseUrl = `${protocol}://${host}`

  console.log('[Cache Revalidate] Using base URL:', baseUrl)
  console.log('[Cache Revalidate] Vercel token configured:', !!vercelToken)

  try {
    console.log('[Cache Revalidate] Request received:', { keys: body.keys, patterns: body.patterns })

    // Build list of paths to revalidate with key mapping
    const pathsToRevalidate: Array<{ path: string; key: string }> = []

    if (body.keys) {
      for (const key of body.keys) {
        if (key.startsWith('post-')) {
          const slug = key.replace('post-', '')
          pathsToRevalidate.push({ path: `/blog/${slug}`, key })
        } else if (key.startsWith('page-')) {
          const slug = key.replace('page-', '')
          const path = slug === 'home' ? '/' : `/${slug}`
          pathsToRevalidate.push({ path, key })
        }
      }
    }

    if (body.patterns) {
      for (const pattern of body.patterns) {
        if (pattern === 'posts-*') {
          pathsToRevalidate.push({ path: '/blog', key: 'blog-index' })
        }
      }
    }

    console.log('[Cache Revalidate] Paths to revalidate:', pathsToRevalidate.map(p => p.path))

    // Make GET requests with cache-busting to trigger revalidation
    // This forces Vercel to fetch fresh content and update the edge cache
    const revalidatePromises = pathsToRevalidate.map(async ({ path, key }) => {
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

        // Track success/failure
        if (response.ok) {
          purged.push(key)
        } else {
          failed.push(key)
        }
      } catch (error) {
        console.error(`[Cache Revalidate] Failed to revalidate ${path}:`, error)
        failed.push(key)
      }
    })

    await Promise.all(revalidatePromises)

    // Additionally, purge Vercel's edge cache using their API (if token is available)
    if (vercelToken && isProduction && purged.length > 0) {
      try {
        const urlsToPurge = pathsToRevalidate
          .filter(p => purged.includes(p.key))
          .map(p => `${baseUrl}${p.path}`)

        console.log('[Cache Revalidate] Purging Vercel edge cache for:', urlsToPurge)

        // Vercel's purge API expects URLs to purge
        const vercelPurgeResponse = await fetch(
          `https://api.vercel.com/v1/purge?url=${urlsToPurge.join(',')}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${vercelToken}`,
            },
          }
        )

        if (vercelPurgeResponse.ok) {
          console.log('[Cache Revalidate] Vercel edge cache purged successfully')
        } else {
          const errorText = await vercelPurgeResponse.text()
          console.error('[Cache Revalidate] Vercel purge failed:', errorText)
        }
      } catch (error) {
        console.error('[Cache Revalidate] Error purging Vercel cache:', error)
        // Don't fail the whole operation if Vercel purge fails
      }
    }

    console.log('[Cache Revalidate] Complete:', { purged, failed })

    return {
      success: failed.length === 0,
      purged,
      failed,
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
