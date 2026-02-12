// Block-related types

import type { IContentLink } from './links'

// Base block interface
export interface IBaseBlock {
  id?: string;
  blockType?: string;
  blockName?: string;
}

// Media block
export interface IMediaBlock {
  blockType: 'mediaBlock';
  id?: string;
  url: string;
  alt?: string;
  focalX?: number;
  focalY?: number;
}

// Button block
export interface IButtonBlock extends IBaseBlock {
  blockType: 'buttonBlock';
  text: string;
  linkType: 'internal' | 'external';
  url: string;
  variant: 'primary' | 'secondary' | 'accent';
}

// Content column
export interface IContentColumn {
  size?: 'oneThird' | 'oneFourth' | 'half' | 'twoThirds' | 'full';
  richText?: any;
  enableLink?: boolean;
  link?: IContentLink;
}

// Content block
export interface IContentBlock extends IBaseBlock {
  blockType: 'content';
  columns: IContentColumn[];
}

// Card (used in CardCarousel)
export interface ICard {
  footer?: string;
  date?: string;
  content: string;
}

// Card carousel block
export interface ICardCarouselBlock extends IBaseBlock {
  blockType: 'cardCarousel';
  title?: string;
  cards: ICard[];
}

// CTA card block
export interface ICtaCardBlock extends IBaseBlock {
  blockType: 'ctaCard';
  title?: string;
  content?: string;
  variant?: 'accent' | 'primary' | 'secondary';
  ctaVariant?: 'accent' | 'primary' | 'secondary';
}

// Union type for all block types
export type Block =
  | IMediaBlock
  | IContentBlock
  | IButtonBlock
  | ICardCarouselBlock
  | ICtaCardBlock;
