import { gql } from 'graphql-request'

export const GET_BRANDING = gql`
  query GetBranding {
    BrandingSetting {
      socials {
        name
        icon
        url
      }
    }
  }
`
