import { gql } from "graphql-request";

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
              enableLink
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
`;

export const GET_POSTS = gql`
  query GetPosts($limit: Int, $page: Int) {
    Posts(limit: $limit, page: $page, sort: "-publishedAt") {
      docs {
        id
        title
        slug
        heroImage {
          id
          alt
          url
          focalX
          focalY
        }
        meta {
          description
          image {
            id
            alt
            url
          }
        }
        categories {
          id
        }
        publishedAt
      }
      totalDocs
      limit
      totalPages
      page
      pagingCounter
      hasPrevPage
      hasNextPage
    }
  }
`;

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
        heroImage {
          id
          alt
          url
        }
        meta {
          description
          image {
            id
            alt
            url
          }
        }
        categories {
          id
        }
        publishedAt
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    Posts(where: { slug: { equals: $slug } }) {
      docs {
        id
        title
        slug
        heroImage {
          id
          alt
          url
          focalX
          focalY
        }
        meta {
          description
          image {
            id
            alt
            url
          }
        }
        content
        categories {
          id
        }
        publishedAt
      }
    }
  }
`;
