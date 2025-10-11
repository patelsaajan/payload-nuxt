import { gql } from 'graphql-request'

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: String!) {
    Pages(where: { slug: { equals: $slug } }) {
      docs {
        id
        title
        slug
        hero {
          type
          richText
        }
        layout {
          ... on ContentBlock {
            id
            blockType
            blockName
            columns {
              size
              richText
            }
          }
          ... on CallToActionBlock {
            id
            blockType
            blockName
            richText
            links {
              link {
                type
                url
                label
              }
            }
          }
          ... on MediaBlock {
            id
            blockType
            blockName
            media {
              id
              alt
              url
            }
          }
        }
      }
    }
  }
`
