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
          backgroundColor
          textColor
          imagePositionMobile
          imagePositionDesktop
          links {
            link {
              type
              url
              label
              newTab
              appearance
              color
            }
          }
          media {
            id
            alt
            url
            focalX
            focalY
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
                color
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
              focalX
              focalY
            }
          }
        }
      }
    }
  }
`
