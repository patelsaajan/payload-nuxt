import { gql } from 'graphql-request'

// Reusable media fragment
export const MEDIA_FRAGMENT = gql`
  fragment MediaFields on Media {
    id
    alt
    url
    focalX
    focalY
  }
`

// Reusable link fragment
export const LINK_FRAGMENT = gql`
  fragment LinkFields on Link {
    type
    url
    label
    newTab
    appearance
    color
  }
`
