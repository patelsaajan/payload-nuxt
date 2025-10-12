import { gql } from 'graphql-request'

export const GET_HEADER = gql`
  query {
    Header {
      navItems {
        id
        link {
          type
          label
          url
          newTab
        }
        icon
      }
    }
  }
`
