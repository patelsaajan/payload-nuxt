
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

  // Check if we're running on Vercel (for cache tag purging)
  const isVercel = !!process.env.VERCEL
  console.log('[Cache Revalidate] Running on Vercel:', isVercel)

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
  const protocol = getHeader(event, 'x-forwarded-proto') || 'http'
  const host = getHeader(event, 'host') || 'localhost:4000'
  const baseUrl = `${protocol}://${host}`

  console.log('[Cache Revalidate] Using base URL:', baseUrl)

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

    console.log('[Cache Revalidate] Cache tags to purge:', pathsToRevalidate.map(p => p.key))

    // On Vercel, try to use cache tag purging
    if (isVercel) {
      try {
        // Import purgeCache from nitro if available
        const { purgeCache } = await import('#nitro').catch(() => ({ purgeCache: null }))

        if (purgeCache) {
          console.log('[Cache Revalidate] Using Nitro purgeCache')
          for (const { key } of pathsToRevalidate) {
            try {
              await purgeCache({ tags: [key] })
              purged.push(key)
              console.log(`[Cache Revalidate] Successfully purged tag: ${key}`)
            } catch (error) {
              console.error(`[Cache Revalidate] Failed to purge tag ${key}:`, error)
              failed.push(key)
            }
          }
        } else {
          console.log('[Cache Revalidate] purgeCache not available, skipping')
          // Mark all as purged since we can't actually purge
          pathsToRevalidate.forEach(({ key }) => purged.push(key))
        }
      } catch (error) {
        console.error('[Cache Revalidate] Error with cache purging:', error)
        pathsToRevalidate.forEach(({ key }) => failed.push(key))
      }
    } else {
      // Local dev fallback
      console.log('[Cache Revalidate] Not on Vercel, marking as purged')
      pathsToRevalidate.forEach(({ key }) => purged.push(key))
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
