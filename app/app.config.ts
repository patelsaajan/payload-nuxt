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
            class: 'text-primary-text'
          },
          {
            color: 'secondary',
            variant: 'solid',
            class: 'text-primary'
          },
          {
            color: 'accent',
            variant: 'solid',
            class: 'text-text'
          }
        ]
      }
    }
  })
  