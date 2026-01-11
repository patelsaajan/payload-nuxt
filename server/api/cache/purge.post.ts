import { useStorage } from '#imports'

interface PurgeCacheRequest {
  keys?: string[]
  patterns?: string[]
}

interface PurgeCacheResponse {
  success: boolean
  purged: string[]
  failed: string[]
  timestamp: string
}

export default defineEventHandler(async (event): Promise<PurgeCacheResponse> => {
  const config = useRuntimeConfig()
  const secret = config.cachePurgeSecret

  // Validate authentication - try multiple ways to get the header
  const authHeader = getHeader(event, 'X-Cache-Purge-Secret')
  const authHeaderLower = getHeader(event, 'x-cache-purge-secret')

  // Try accessing node request headers directly
  const nodeReq = event.node.req
  const authFromNode = nodeReq.headers['x-cache-purge-secret']

  // Use the auth header from wherever we can get it
  const finalAuthHeader = authHeader || authHeaderLower || authFromNode

  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cache purge secret not configured',
    })
  }

  if (!finalAuthHeader || finalAuthHeader !== secret) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Invalid or missing cache purge secret',
    })
  }

  // Parse request body
  const body = await readBody<PurgeCacheRequest>(event)

  if (!body || (!body.keys && !body.patterns)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad request: Must provide keys or patterns to purge',
    })
  }

  // Use cache storage (contains both data cache and route cache with different prefixes)
  const storage = useStorage('cache')

  const purged: string[] = []
  const failed: string[] = []

  try {
    // Get all cache keys (routes are stored in 'cache' storage with nitro:routes:_: prefix)
    const allCacheKeys = await storage.getKeys()

    // Separate data cache keys from route cache keys
    const dataKeys = allCacheKeys.filter(key => !key.startsWith('nitro:routes:'))
    const routeKeys = allCacheKeys.filter(key => key.startsWith('nitro:routes:_:'))

    // Collect keys to purge from both storages
    const dataKeysToPurge = new Set<string>()
    const routeKeysToPurge = new Set<string>()

    if (body.keys) {
      for (const key of body.keys) {
        // Handle different key types and map to route cache keys
        if (key.startsWith('post-')) {
          const slug = key.replace('post-', '')
          // Blog posts: /blog/third-post -> nitro:routes:_:blogthirdpost.*.json
          const routePattern = `blog${slug.replace(/-/g, '')}`
          for (const routeKey of routeKeys) {
            if (routeKey.includes(`:${routePattern}`)) {
              routeKeysToPurge.add(routeKey)
            }
          }
        } else if (key.startsWith('page-')) {
          const slug = key.replace('page-', '')
          // Pages: page-home -> / -> nitro:routes:_:index.*.json
          //        page-about -> /about -> nitro:routes:_:about.*.json
          const routePattern = slug === 'home' ? 'index' : slug.replace(/-/g, '')
          for (const routeKey of routeKeys) {
            if (routeKey.includes(`:${routePattern}.`)) {
              routeKeysToPurge.add(routeKey)
            }
          }
        }

        // Also check data cache for exact match
        const dataKey = `nitro:data:${key}:_payload.json`
        if (dataKeys.includes(dataKey)) {
          dataKeysToPurge.add(dataKey)
        }
      }
    }

    // Handle pattern matches
    if (body.patterns) {
      for (const pattern of body.patterns) {
        if (pattern === 'posts-*') {
          // Purge blog index and all blog posts
          // Route keys format: nitro:routes:_:blog*.json
          for (const routeKey of routeKeys) {
            if (routeKey.includes(':blog')) {
              routeKeysToPurge.add(routeKey)
            }
          }
        } else if (pattern === 'page-*') {
          // Purge all pages (excluding blog and API routes)
          for (const routeKey of routeKeys) {
            if (!routeKey.includes(':blog') && !routeKey.includes(':api')) {
              routeKeysToPurge.add(routeKey)
            }
          }
        } else if (pattern === 'post-*') {
          // Purge all blog post routes
          for (const routeKey of routeKeys) {
            // Match blog posts but not blog index
            if (routeKey.match(/nitro:routes:_:blog[a-z0-9-]+\./)) {
              routeKeysToPurge.add(routeKey)
            }
          }
        }

        // Also check data cache patterns
        const regexPattern = pattern.replace(/\*/g, '.*').replace(/\?/g, '.')
        const regex = new RegExp(`^nitro:data:${regexPattern}:_payload\\.json$`)
        for (const dataKey of dataKeys) {
          if (regex.test(dataKey)) {
            dataKeysToPurge.add(dataKey)
          }
        }
      }
    }

    // Debug logging
    console.log('[Cache Purge] Request received:', { keys: body.keys, patterns: body.patterns })
    console.log('[Cache Purge] Found cache keys:', {
      totalKeys: allCacheKeys.length,
      dataKeys: dataKeys.length,
      routeKeys: routeKeys.length,
      dataToPurge: dataKeysToPurge.size,
      routesToPurge: routeKeysToPurge.size
    })

    // Purge data cache keys
    for (const cacheKey of dataKeysToPurge) {
      try {
        await storage.removeItem(cacheKey)
        const originalKey = cacheKey.replace('nitro:data:', '').replace(':_payload.json', '')
        purged.push(originalKey)
      } catch (error) {
        const originalKey = cacheKey.replace('nitro:data:', '').replace(':_payload.json', '')
        failed.push(originalKey)
      }
    }

    // Purge route cache keys
    for (const routeKey of routeKeysToPurge) {
      try {
        await storage.removeItem(routeKey)
        const route = routeKey.replace('nitro:routes:_:', '').replace(/\.[^.]+\.json$/, '')
        purged.push(route)
      } catch (error) {
        const route = routeKey.replace('nitro:routes:_:', '').replace(/\.[^.]+\.json$/, '')
        failed.push(route)
      }
    }

    console.log('[Cache Purge] Result:', { purged, failed })

    return {
      success: failed.length === 0,
      purged,
      failed,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[Cache Purge] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during cache purge',
    })
  }
})
