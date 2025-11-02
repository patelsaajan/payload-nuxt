// Global shared types

// Category interface
export interface ICategory {
  id: string;
  title: string;
  slug: string;
}

// Meta interface (for SEO)

// Social media interface
export interface ISocial {
  name: string;
  icon: string;
  url: string;
}

// Relation type for carousel/card components
export type typeRelationTo = "posts" | "case_studies";
