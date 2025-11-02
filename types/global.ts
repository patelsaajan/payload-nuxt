// Global shared types

// Media/Image interface
export interface IMedia {
  id?: string;
  url: string;
  alt?: string;
  focalX?: number;
  focalY?: number;
}

// Category interface
export interface ICategory {
  id: string;
  title: string;
  slug: string;
}

// Meta interface (for SEO)
export interface IMeta {
  description?: string;
  image?: IMedia;
}

// Social media interface
export interface ISocial {
  name: string;
  icon: string;
  url: string;
}

// Relation type for carousel/card components
export type typeRelationTo = "posts";
