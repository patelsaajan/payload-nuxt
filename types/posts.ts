import type { IMedia, IMeta, ICategory } from './global'

// Post interface
export interface IPost {
  id: string
  slug: string
  title: string
  publishedAt?: string
  meta?: IMeta
  excerpt?: string
  heroImage?: IMedia
  categories?: ICategory[]
}
