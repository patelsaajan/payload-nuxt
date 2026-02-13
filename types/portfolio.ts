export type Portfolio = {
  id: string
  title: string
  slug: string
  description: string
  afterPhoto: PortfolioPhoto
  afterPhotoCaption?: string
  beforePhoto?: PortfolioPhoto
  beforePhotoCaption?: string
  transitionPhotos?: TransitionPhoto[]
  categories: {
    id: string
    title: string
  }[]
  publishedAt: string
}

export type PortfolioAfter = {
  id: string
  title: string
  slug: string
  description: string
  afterPhoto: PortfolioPhoto
  categories: {
    id: string
    title: string
  }[]
  publishedAt: string
}

export type PortfolioPhoto = {
  id: string
  alt: string
  url: string
  focalX: number
  focalY: number
}

export type TransitionPhoto = {
  photo: PortfolioPhoto
  caption?: string
  title?: string
}