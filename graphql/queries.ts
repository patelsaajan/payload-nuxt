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
          ... on PostsCarouselBlock {
            id
            blockType
            blockName
            introContent
            populateBy
            relationTo
            limit
            categories {
              id
              title
              slug
            }
            selectedDocs {
              relationTo
              value {
                ... on Post {
                  id
                  title
                  slug
                  publishedAt
                  meta {
                    description
                    image {
                      id
                      alt
                      url
                      focalX
                      focalY
                    }
                  }
                  categories {
                    id
                    title
                    slug
                  }
                }
                ... on CaseStudy {
                  id
                  title
                  slug
                  excerpt
                  publishedAt
                  heroImage {
                    id
                    alt
                    url
                    focalX
                    focalY
                  }
                  categories {
                    id
                    title
                    slug
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_CASE_STUDIES = gql`
  query GetCaseStudies($limit: Int) {
    CaseStudies(limit: $limit, sort: "-publishedAt") {
      docs {
        id
        title
        slug
        excerpt
        heroImage {
          id
          alt
          url
          focalX
          focalY
        }
        publishedAt
      }
    }
  }
`

export const GET_CASE_STUDY_BY_SLUG = gql`
  query GetCaseStudyBySlug($slug: String!) {
    CaseStudies(where: { slug: { equals: $slug } }) {
      docs {
        id
        title
        slug
        excerpt
        heroImage {
          id
          alt
          url
          focalX
          focalY
        }
        content
        categories {
          id
          title
          slug
        }
        publishedAt
      }
    }
  }
`

export const GET_POSTS = gql`
  query GetPosts($limit: Int) {
    Posts(
      limit: $limit
      sort: "-publishedAt"
    ) {
      docs {
        id
        title
        slug
        meta {
          description
          image {
            id
            alt
            url
            focalX
            focalY
          }
        }
        categories {
          id
          title
          slug
        }
        publishedAt
      }
    }
  }
`

export const GET_POSTS_WITH_FILTER = gql`
  query GetPostsWithFilter($limit: Int, $categoryIds: [JSON]!) {
    Posts(
      limit: $limit
      sort: "-publishedAt"
      where: { categories: { in: $categoryIds } }
    ) {
      docs {
        id
        title
        slug
        meta {
          description
          image {
            id
            alt
            url
            focalX
            focalY
          }
        }
        categories {
          id
          title
          slug
        }
        publishedAt
      }
    }
  }
`

export const GET_CASE_STUDIES_WITH_FILTER = gql`
  query GetCaseStudiesWithFilter($limit: Int, $categoryIds: [JSON]!) {
    CaseStudies(
      limit: $limit
      sort: "-publishedAt"
      where: { categories: { in: $categoryIds } }
    ) {
      docs {
        id
        title
        slug
        excerpt
        heroImage {
          id
          alt
          url
          focalX
          focalY
        }
        categories {
          id
          title
          slug
        }
        publishedAt
      }
    }
  }
`
