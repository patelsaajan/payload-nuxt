import type { IMedia, ICategory } from './global'

// Case Study interface
export interface ICaseStudy {
  id: string
  slug: string
  title: string
  excerpt?: string
  publishedAt?: string
  heroImage?: IMedia
  categories?: ICategory[]
}
