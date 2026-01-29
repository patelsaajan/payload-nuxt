import { GraphQLClient } from 'graphql-request'
import { GET_PAGE_BY_SLUG, GET_POSTS, GET_POSTS_WITH_FILTER, GET_POST_BY_SLUG } from '../../graphql/queries'
import { GET_HEADER } from '../../graphql/header'
import { GET_BRANDING } from '../../graphql/branding'

export const usePayloadGraphQL = () => {
  const config = useRuntimeConfig()
  const client = new GraphQLClient(`${config.public.payloadBaseUrl}/api/graphql`)

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
      }
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
      }
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
      }
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
      }
    )
  }

  return {
    fetchPageBySlug,
    fetchHeader,
    fetchPosts,
    fetchBranding,
    fetchPostBySlug
  }
}
