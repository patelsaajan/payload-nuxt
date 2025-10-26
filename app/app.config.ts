export default defineAppConfig({
    ui: {
      colors: {
        primary: 'primary',
        secondary: 'secondary',
        accent: 'accent'
      },
      button: {
        compoundVariants: [
          {
            color: 'primary',
            variant: 'solid',
            class: 'text-primary-text cursor-pointer'
          },
          {
            color: 'secondary',
            variant: 'solid',
            class: 'text-primary cursor-pointer'
          },
          {
            color: 'accent',
            variant: 'solid',
            class: 'text-text cursor-pointer'
          },
          {
            color: 'primary',
            variant: 'link',
            class: 'text-red-500 cursor-pointer'
          }
        ]
      },
      navigationMenu: {
        compoundVariants: [
          {
            active: false,
            variant: 'link',
            class: {
              link: [
                'text-text hover:!text-primary'
              ],
              linkLeadingIcon: [
                'text-text group-hover:text-primary'
              ]
            }
          },
        ]
      }
    }
  })
  