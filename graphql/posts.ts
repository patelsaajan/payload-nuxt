import { gql } from 'graphql-request'

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
        heroImage {
          id
          alt
          url
        }
        categories {
          id
        }
        publishedAt
      }
    }
  }
`

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    Posts(where: { slug: { equals: $slug } }) {
      docs {
        id
        title
        slug
        meta {
          title
          socialTitle
          description
          socialDescription
        }
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
        }
        publishedAt
      }
    }
  }
`
