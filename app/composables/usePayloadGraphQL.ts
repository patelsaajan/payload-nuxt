import { GraphQLClient } from 'graphql-request'
import { GET_PAGE_BY_SLUG, GET_POSTS, GET_POSTS_WITH_FILTER, GET_POST_BY_SLUG } from '../../graphql/queries'
import { GET_HEADER } from '../../graphql/header'
import { GET_THEME_SETTINGS } from '../../graphql/theme'
import { GET_BRANDING } from '../../graphql/branding'

export const usePayloadGraphQL = () => {
  const config = useRuntimeConfig()
  const client = new GraphQLClient(`${config.public.payloadBaseUrl}/api/graphql`)

  const fetchPageBySlug = async (slug?: string) => {
    // Default to 'home' if no slug provided or if at root path
    const pageSlug = slug || 'home'

    const data: any = await client.request(GET_PAGE_BY_SLUG, { slug: pageSlug })
    return data.Pages.docs[0] || null
  }

  const fetchHeader = async () => {
    const data: any = await client.request(GET_HEADER)
    return data.Header || null
  }

  const fetchThemeSettings = async () => {
    const data: any = await client.request(GET_THEME_SETTINGS)
    return data.ThemeSetting || null
  }

  const fetchPosts = async (limit: number = 10, categoryIds?: string[]) => {
    try {
      if (categoryIds && categoryIds.length > 0) {
        const data: any = await client.request(GET_POSTS_WITH_FILTER, {
          limit,
          categoryIds
        })
        return data.Posts.docs || []
      } else {
        const data: any = await client.request(GET_POSTS, { limit })
        return data.Posts.docs || []
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  }


  const fetchBranding = async () => {
    const data: any = await client.request(GET_BRANDING)
    return data.BrandingSetting || null
  }

  const fetchPostBySlug = async (slug: string) => {
    const data: any = await client.request(GET_POST_BY_SLUG, { slug })
    return data.Posts.docs[0] || null
  }

  return {
    fetchPageBySlug,
    fetchHeader,
    fetchThemeSettings,
    fetchPosts,
    fetchBranding,
    fetchPostBySlug
  }
}
