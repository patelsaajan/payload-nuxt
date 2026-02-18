import { gql } from 'graphql-request'


export const GET_GALLERY_BY_PAGE = gql`
query GetGalleryMedia($page: Int, $limit: Int) {
  allMedia(
    page: $page, 
    limit: $limit,
    where: {
      addToGallery: {
        equals: true
      }
    }) 
  {
    docs {
      id
      title
      alt
      caption
      url
      focalX
      focalY
    }
    totalDocs
    totalPages
    limit
    page
    hasNextPage
    hasPrevPage
  }
}
`