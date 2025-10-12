import { GraphQLClient } from 'graphql-request'
import { GET_PAGE_BY_SLUG } from '../../graphql/queries'
import { GET_HEADER } from '../../graphql/header'

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

  return { fetchPageBySlug, fetchHeader }
}
