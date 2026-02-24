const STANDARD_COLLECTIONS = ['pages', 'posts'] as const
const ADDITIONAL_COLLECTIONS = ['portfolios', 'gallery'] as const

type StandardCollection = typeof STANDARD_COLLECTIONS[number]
type AdditionalCollection = typeof ADDITIONAL_COLLECTIONS[number]
type Collection = StandardCollection | AdditionalCollection

const COLLECTION_ROUTE_PREFIXES: Record<string, AdditionalCollection> = {
  '/portfolio': 'portfolios',
  '/gallery': 'gallery',
}

const BLOCK_TYPE_TO_COLLECTION: Record<string, AdditionalCollection> = {
  'portfolioAftersBlock': 'portfolios',
}

export const useEnabledCollections = () => {
  const config = useRuntimeConfig()

  const enabledAdditionalCollections = computed(() => {
    const envValue = config.public.enabledCollections as string
    if (!envValue) return []

    return envValue
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter((s): s is AdditionalCollection =>
        ADDITIONAL_COLLECTIONS.includes(s as AdditionalCollection)
      )
  })

  const isCollectionEnabled = (collection: Collection): boolean => {
    // Standard collections are always enabled
    if (STANDARD_COLLECTIONS.includes(collection as StandardCollection)) {
      return true
    }

    // Check if additional collection is enabled
    return enabledAdditionalCollections.value.includes(collection as AdditionalCollection)
  }

  const isRouteEnabled = (path: string): boolean => {
    // Check if path matches any collection route prefix
    for (const [prefix, collection] of Object.entries(COLLECTION_ROUTE_PREFIXES)) {
      if (path === prefix || path.startsWith(`${prefix}/`)) {
        return isCollectionEnabled(collection)
      }
    }

    // Routes not matching any collection prefix are always enabled
    return true
  }

  const isBlockEnabled = (blockType: string): boolean => {
    const collection = BLOCK_TYPE_TO_COLLECTION[blockType]
    if (!collection) {
      // Blocks not mapped to a collection are always enabled
      return true
    }
    return isCollectionEnabled(collection)
  }

  return {
    isCollectionEnabled,
    isRouteEnabled,
    isBlockEnabled,
    enabledAdditionalCollections,
    STANDARD_COLLECTIONS,
    ADDITIONAL_COLLECTIONS,
  }
}
