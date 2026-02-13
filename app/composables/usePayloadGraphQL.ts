import { GraphQLClient } from 'graphql-request'
import { GET_PAGE_BY_SLUG } from '../../graphql/pages'
import { GET_POSTS, GET_POSTS_WITH_FILTER, GET_POST_BY_SLUG } from '../../graphql/posts'
import { GET_HEADER } from '../../graphql/header'
import { GET_BRANDING } from '../../graphql/branding'
import { GET_PORTFOLIO, GET_PORTFOLIO_BY_SLUG } from '../../graphql/portfolio'

export const usePayloadGraphQL = () => {
  const config = useRuntimeConfig()
  const client = new GraphQLClient(`${config.public.payloadBaseUrl}/api/graphql`)

  // Use cached data from static generation instead of re-fetching
  // Return undefined to trigger fresh fetch if no cached data exists
  const getCachedData = (key: string, nuxtApp: any) => {
    if (nuxtApp.payload.data[key] !== undefined) {
      return nuxtApp.payload.data[key]
    }
    if (nuxtApp.static.data[key] !== undefined) {
      return nuxtApp.static.data[key]
    }
    return undefined // Will trigger fresh fetch
  }

  const fetchPageBySlug = async (slug?: string) => {
    // Default to 'home' if no slug provided or if at root path
    const pageSlug = slug || 'home'

    return useAsyncData(
      `page-${pageSlug}`,
      async () => {
        try {
          const data: any = await client.request(GET_PAGE_BY_SLUG, { slug: pageSlug })
          return data.Pages.docs[0] || null
        } catch (error) {
          console.error('Error fetching page by slug:', error)
          return null
        }
      },
      {
        dedupe: 'defer'
      }
    )
  }

  const fetchHeader = async () => {
    return useAsyncData(
      'header',
      async () => {
        try {
          const data: any = await client.request(GET_HEADER)
          return data.Header || null
        } catch (error) {
          console.error('Error fetching header:', error)
          return null
        }
      },
      { getCachedData }
    )
  }

  const fetchPosts = async (limit: number = 10, page: number = 1, categoryIds?: string[]) => {
    const cacheKey = categoryIds && categoryIds.length > 0
      ? `posts-${limit}-${categoryIds.join(',')}`
      : `posts-${limit}-${page}`

    return useAsyncData(
      cacheKey,
      async () => {
        try {
          if (categoryIds && categoryIds.length > 0) {
            const data: any = await client.request(GET_POSTS_WITH_FILTER, {
              limit,
              categoryIds
            })
            return data.Posts || { docs: [], hasNextPage: false }
          } else {
            const data: any = await client.request(GET_POSTS, { limit, page })
            return data.Posts || { docs: [], hasNextPage: false }
          }
        } catch (error) {
          console.error('Error fetching posts:', error)
          return { docs: [], hasNextPage: false }
        }
      },
      { getCachedData }
    )
  }

  const fetchBranding = async () => {
    return useAsyncData(
      'branding',
      async () => {
        try {
          const data: any = await client.request(GET_BRANDING)
          return data.BrandingSetting || null
        } catch (error) {
          console.error('Error fetching branding:', error)
          return null
        }
      },
      { getCachedData }
    )
  }

  const fetchPostBySlug = async (slug: string) => {
    return useAsyncData(
      `post-${slug}`,
      async () => {
        try {
          const data: any = await client.request(GET_POST_BY_SLUG, { slug })
          return data.Posts.docs[0] || null
        } catch (error) {
          console.error('Error fetching post by slug:', error)
          return null
        }
      },
      { getCachedData }
    )
  }

  const fetchPortfolio = async (limit: number = 10, page: number = 1) => {
    return useAsyncData(
      `portfolio-${limit}-${page}`,
      async () => {
        try {
          const data: any = await client.request(GET_PORTFOLIO, { limit, page })
          return data.Portfolio || { docs: [], hasNextPage: false }
        } catch (error) {
          console.error('Error fetching portfolio:', error)
          return { docs: [], hasNextPage: false }
        }
      },
      { getCachedData }
    )
  }

  const fetchPortfolioBySlug = async (slug: string) => {
    return useAsyncData(
      `portfolio-${slug}`,
      async () => {
        try {
          const data: any = await client.request(GET_PORTFOLIO_BY_SLUG, { slug })
          return data.Portfolio.docs[0] || null
        } catch (error) {
          console.error('Error fetching portfolio by slug:', error)
          return null
        }
      },
      { getCachedData }
    )
  }

  return {
    fetchPageBySlug,
    fetchHeader,
    fetchPosts,
    fetchBranding,
    fetchPostBySlug,
    fetchPortfolio,
    fetchPortfolioBySlug
  }
}
