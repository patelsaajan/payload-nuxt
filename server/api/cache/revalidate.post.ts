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

    console.log('[Cache Revalidate] Paths to revalidate:', pathsToRevalidate.map(p => p.path))

    // Use HTTP PURGE method to clear Vercel's edge cache
    const revalidatePromises = pathsToRevalidate.map(async ({ path, key }) => {
      try {
        const fullUrl = `${baseUrl}${path}`

        // Step 1: Send PURGE request to clear Vercel's edge cache
        console.log(`[Cache Revalidate] Purging cache for ${fullUrl}`)
        const purgeResponse = await fetch(fullUrl, {
          method: 'PURGE',
          headers: {
            'x-vercel-purge': '1',
          },
        })
        console.log(`[Cache Revalidate] PURGE response for ${path}: ${purgeResponse.status}`)

        // Step 2: Fetch fresh content to warm the cache
        const warmResponse = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        console.log(`[Cache Revalidate] Warmed cache for ${path}: ${warmResponse.status}`)

        if (warmResponse.ok) {
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
