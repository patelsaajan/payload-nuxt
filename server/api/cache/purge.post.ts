import { useStorage } from '#imports'
import { promises as fs } from 'fs'
import { resolve } from 'path'

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
  const nodeHeaders = nodeReq.headers
  const authFromNode = nodeHeaders['x-cache-purge-secret']

  // Debug: log all headers
  const allHeaders = getHeaders(event)
  console.log('[Cache Purge] All headers from h3:', Object.keys(allHeaders))
  console.log('[Cache Purge] All headers from node:', Object.keys(nodeHeaders))
  console.log('[Cache Purge] Auth from node headers:', !!authFromNode)

  // Debug logging
  console.log('[Cache Purge] Secret configured:', !!secret, 'Length:', secret?.length)
  console.log('[Cache Purge] Auth header (h3):', !!authHeader, 'Length:', authHeader?.length)
  console.log('[Cache Purge] Auth header (node):', !!authFromNode, 'Length:', authFromNode?.length)

  // Use the auth header from wherever we can get it
  const finalAuthHeader = authHeader || authHeaderLower || authFromNode
  console.log('[Cache Purge] Final auth header:', !!finalAuthHeader)
  console.log('[Cache Purge] Secrets match:', finalAuthHeader === secret)

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

  // Use both data cache and route cache storage
  const dataStorage = useStorage('cache')
  const routeStorage = useStorage('cache:nitro:routes')

  const purged: string[] = []
  const failed: string[] = []

  try {
    // Try to access different storage mounts
    const storages = {
      cache: useStorage('cache'),
      'cache:nitro': useStorage('cache:nitro'),
      'cache:nitro:routes': useStorage('cache:nitro:routes'),
      nitro: useStorage('nitro'),
      'nitro:routes': useStorage('nitro:routes'),
    }

    console.log('[Cache Purge] Checking all storage mounts...')
    for (const [name, storage] of Object.entries(storages)) {
      try {
        const keys = await storage.getKeys()
        console.log(`[Cache Purge] ${name}: ${keys.length} keys`)
        if (keys.length > 0) {
          console.log(`[Cache Purge] ${name} sample:`, keys.slice(0, 5))
        }
      } catch (err) {
        console.log(`[Cache Purge] ${name}: Error accessing - ${err.message}`)
      }
    }

    // Get all cache keys from both storages
    const dataKeys = await dataStorage.getKeys()
    const routeKeys = await routeStorage.getKeys()

    console.log('[Cache Purge] Looking for keys:', body.keys)
    console.log('[Cache Purge] Looking for patterns:', body.patterns)

    // Collect keys to purge from both storages
    const dataKeysToPurge = new Set<string>()
    const routeKeysToPurge = new Set<string>()

    // Map cache keys to route paths
    // post-third-post -> /blog/third-post
    // posts-* -> /blog and /blog/*
    // page-home -> /
    // page-about -> /about
    const routesToPurge = new Set<string>()

    if (body.keys) {
      for (const key of body.keys) {
        // Handle different key types
        if (key.startsWith('post-')) {
          const slug = key.replace('post-', '')
          routesToPurge.add(`/blog/${slug}`)
        } else if (key.startsWith('page-')) {
          const slug = key.replace('page-', '')
          if (slug === 'home') {
            routesToPurge.add('/')
          } else {
            routesToPurge.add(`/${slug}`)
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
          routesToPurge.add('/blog')
          // Find all route keys that match /blog/*
          for (const routeKey of routeKeys) {
            if (routeKey.includes('/blog/') || routeKey.includes('blog')) {
              routeKeysToPurge.add(routeKey)
            }
          }
        } else if (pattern === 'page-*') {
          // Purge all pages
          for (const routeKey of routeKeys) {
            if (!routeKey.includes('/blog') && !routeKey.includes('/api')) {
              routeKeysToPurge.add(routeKey)
            }
          }
        } else if (pattern === 'post-*') {
          // Purge all blog post routes
          for (const routeKey of routeKeys) {
            if (routeKey.includes('/blog/')) {
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

    console.log('[Cache Purge] Routes to purge:', Array.from(routesToPurge))
    console.log('[Cache Purge] Route keys to purge:', routeKeysToPurge.size)
    console.log('[Cache Purge] Data keys to purge:', dataKeysToPurge.size)

    // Purge data cache keys
    for (const cacheKey of dataKeysToPurge) {
      try {
        await dataStorage.removeItem(cacheKey)
        const originalKey = cacheKey.replace('nitro:data:', '').replace(':_payload.json', '')
        purged.push(originalKey)
      } catch (error) {
        const originalKey = cacheKey.replace('nitro:data:', '').replace(':_payload.json', '')
        failed.push(originalKey)
        console.error(`Failed to purge data cache key: ${originalKey}`, error)
      }
    }

    // Purge route cache keys
    for (const routeKey of routeKeysToPurge) {
      try {
        await routeStorage.removeItem(routeKey)
        purged.push(`route:${routeKey}`)
      } catch (error) {
        failed.push(`route:${routeKey}`)
        console.error(`Failed to purge route cache key: ${routeKey}`, error)
      }
    }

    console.log(`Cache purge completed: ${purged.length} keys purged, ${failed.length} failed`)

    return {
      success: failed.length === 0,
      purged,
      failed,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Cache purge error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error during cache purge',
    })
  }
})
