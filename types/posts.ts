// Post-related types

import type { IMedia, IMeta, ICategory } from './common'

// Post interface
export interface IPost {
  id: string;
  slug: string;
  title: string;
  publishedAt?: string;
  meta?: IMeta;
  excerpt?: string;
  heroImage?: IMedia;
  categories?: ICategory[];
  content?: any; // Lexical richText content
}

// Case study interface
export interface ICaseStudy {
  id: string;
  slug: string;
  title: string;
  publishedAt?: string;
  excerpt?: string;
  heroImage?: IMedia;
  content?: any;
}
