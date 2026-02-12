// Link-related types

// Link reference for internal links
export interface ILinkReference {
  relationTo: string;
  value: {
    slug?: string;
    id?: string;
  } | string;
}

// Content link (used in content blocks)
export interface IContentLink {
  type?: string;
  url: string;
  label: string;
  newTab?: boolean;
  appearance?: 'primary' | 'secondary' | 'default';
  color?: string;
}

// CTA link (used in CTA cards and buttons)
export interface ICtaLink {
  type: 'reference' | 'custom';
  reference?: ILinkReference;
  url?: string;
  label: string;
  newTab?: boolean;
  appearance?: 'default' | 'outline' | 'link' | 'ghost';
  color?: 'primary' | 'secondary' | 'accent';
}

// Relation type for references
export type TypeRelationTo = 'posts' | 'pages';

// Legacy alias (for backwards compatibility)
export type typeRelationTo = 'posts' | 'pages' | 'case_studies';
