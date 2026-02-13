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
            hasBackground
            columns {
              size
              richText
              link {
                type
                url
                label
                newTab
                appearance
                color
              }
            }
          }
          ... on MediaBlock {
            id
            blockType
            blockName
            aspectRatio
            media {
              id
              alt
              url
              focalX
              focalY
            }
          }
          ... on TimelineBlock {
            id
            blockType
            blockName
            title
            timelineVariant: variant
            defaultValue
            orientation
            items {
              date
              title
              description
              icon
            }
          }
          ... on CardCarouselBlock {
            id
            blockType
            blockName
            title
            cards {
              footer
              date
              content
            }
          }
          ... on CtaCardBlock {
            id
            blockType
            blockName
            title
            content
            ctaVariant: variant
            link {
              type
              url
              label
              newTab
              appearance
              color
            }
          }
        }
      }
    }
  }
`
