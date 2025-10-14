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
          heading
          text
          links {
            link {
              type
              url
              label
              newTab
              appearance
            }
          }
          media {
            id
            alt
            url
          }
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
                appearance
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
