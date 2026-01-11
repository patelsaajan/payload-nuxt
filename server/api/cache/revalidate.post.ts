/**
 * Cache Revalidation Endpoint
 *
 * NOTE: This endpoint doesn't actually purge Vercel's edge cache.
 * Vercel's edge cache expires naturally based on Cache-Control headers (1 hour).
 * This endpoint exists to:
 * 1. Provide logging/visibility when content is updated in Payload CMS
 * 2. Maintain compatibility with Payload's cache purge hooks
 * 3. Allow for future implementation of actual cache purging if needed
 */

interface RevalidateRequest {
  keys?: string[]
  patterns?: string[]
}

interface RevalidateResponse {
  success: boolean
  purged: string[]
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

  try {
    console.log('[Cache Revalidate] Request received:', { keys: body.keys, patterns: body.patterns })

    // Log which content was updated (cache will expire naturally in 1 hour)
    if (body.keys) {
      body.keys.forEach(key => {
        purged.push(key)
        if (key.startsWith('post-')) {
          const slug = key.replace('post-', '')
          console.log(`[Cache Revalidate] Content updated: /blog/${slug} (cache expires in 1 hour)`)
        } else if (key.startsWith('page-')) {
          const slug = key.replace('page-', '')
          const path = slug === 'home' ? '/' : `/${slug}`
          console.log(`[Cache Revalidate] Content updated: ${path} (cache expires in 1 hour)`)
        }
      })
    }

    if (body.patterns) {
      body.patterns.forEach(pattern => {
        if (pattern === 'posts-*') {
          purged.push('blog-index')
          console.log(`[Cache Revalidate] Content updated: /blog (cache expires in 1 hour)`)
        }
      })
    }

    console.log('[Cache Revalidate] Complete:', { purged })

    return {
      success: true,
      purged,
      failed: [],
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
