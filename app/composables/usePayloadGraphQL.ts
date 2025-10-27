import { GraphQLClient } from 'graphql-request'
import { GET_PAGE_BY_SLUG, GET_CASE_STUDIES, GET_CASE_STUDY_BY_SLUG, GET_POSTS, GET_POSTS_WITH_FILTER, GET_CASE_STUDIES_WITH_FILTER } from '../../graphql/queries'
import { GET_HEADER } from '../../graphql/header'
import { GET_THEME_SETTINGS } from '../../graphql/theme'

export const usePayloadGraphQL = () => {
  const config = useRuntimeConfig()
  const client = new GraphQLClient(`${config.public.payloadBaseURL}/api/graphql`)

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

  const fetchCaseStudies = async (limit: number = 12) => {
    const data: any = await client.request(GET_CASE_STUDIES, { limit })
    return data.CaseStudies.docs || []
  }

  const fetchCaseStudyBySlug = async (slug: string) => {
    const data: any = await client.request(GET_CASE_STUDY_BY_SLUG, { slug })
    return data.CaseStudies.docs[0] || null
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

  const fetchCaseStudiesWithFilter = async (limit: number = 10, categoryIds?: string[]) => {
    try {
      if (categoryIds && categoryIds.length > 0) {
        const data: any = await client.request(GET_CASE_STUDIES_WITH_FILTER, {
          limit,
          categoryIds
        })
        return data.CaseStudies.docs || []
      } else {
        // Use the existing GET_CASE_STUDIES query when no filter
        const data: any = await client.request(GET_CASE_STUDIES, { limit })
        return data.CaseStudies.docs || []
      }
    } catch (error) {
      console.error('Error fetching case studies:', error)
      return []
    }
  }

  return {
    fetchPageBySlug,
    fetchHeader,
    fetchThemeSettings,
    fetchCaseStudies,
    fetchCaseStudyBySlug,
    fetchPosts,
    fetchCaseStudiesWithFilter
  }
}
