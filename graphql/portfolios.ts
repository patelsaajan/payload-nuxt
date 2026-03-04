import { gql } from "graphql-request";

export const GET_PORTFOLIO = gql`
  query GetPortfolio($limit: Int, $page: Int) {
    Portfolios(limit: $limit, page: $page, sort: "-publishedAt") {
      docs {
        id
        title
        slug
        description
        afterPhoto {
          id
          alt
          url
          focalX
          focalY
        }
        beforePhoto {
          id
          alt
          url
          focalX
          focalY
        }
        publishedAt
      }
      totalDocs
      limit
      totalPages
      page
      hasNextPage
    }
  }
`;

export const GET_PORTFOLIO_BY_SLUG = gql`
  query GetPortfolioBySlug($slug: String!) {
    Portfolios(where: { slug: { equals: $slug } }) {
      docs {
        id
        title
        slug
        description
        expandedLayout
        meta {
          title
          socialTitle
          description
          socialDescription
          image {
            url
          }
        }
        afterPhoto {
          id
          alt
          url
          focalX
          focalY
        }
        afterPhotoCaption
        afterPhotoTitle
        beforePhoto {
          id
          alt
          url
          focalX
          focalY
        }
        beforePhotoCaption
        beforePhotoTitle
        transitionPhotos {
          photo {
            id
            alt
            url
            focalX
            focalY
          }
          title
          caption
        }
        publishedAt
      }
    }
  }
`;

export const GET_PORTFOLIO_AFTERS = gql`
  query GetPortfolioAfters($limit: Int, $page: Int) {
    Portfolios(limit: $limit, page: $page, sort: "-publishedAt") {
      docs {
        id
        title
        slug
        description
        afterPhoto {
          id
          alt
          url
          focalX
          focalY
        }
        publishedAt
      }
      limit
      page
    }
  }
`;
