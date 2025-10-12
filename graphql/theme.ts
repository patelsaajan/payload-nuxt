import { gql } from 'graphql-request'

export const GET_THEME_SETTINGS = gql`
  query GetThemeSettings {
    ThemeSetting {
      primaryColor
      secondaryColor
      actionColor
      backgroundColor
    }
  }
`
