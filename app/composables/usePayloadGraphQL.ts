import { GraphQLClient } from 'graphql-request'
import { GET_PAGE_BY_SLUG, GET_CASE_STUDIES, GET_CASE_STUDY_BY_SLUG } from '../../graphql/queries'
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

  return { fetchPageBySlug, fetchHeader, fetchThemeSettings, fetchCaseStudies, fetchCaseStudyBySlug }
}
