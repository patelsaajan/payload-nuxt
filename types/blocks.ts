// Base block interface
export interface IBaseBlock {
  id?: string;
  blockType?: string;
  blockName?: string;
}

export interface IMediaBlock {
  blockType: "mediaBlock";
  id?: string;
  url: string;
  alt?: string;
  focalX?: number;
  focalY?: number;
}

// Content Column
export interface IContentColumn {
  size?: "oneThird" | "half" | "twoThirds" | "full";
  richText?: any;
  enableLink?: boolean;
  link?: IContentLink;
}

// Content Link
export interface IContentLink {
  type?: string;
  url: string;
  label: string;
  newTab?: boolean;
  appearance?: "primary" | "secondary" | "default";
  color?: string;
}

// Content Block
export interface IContentBlock extends IBaseBlock {
  blockType: "content";
  columns: IContentColumn[];
}

// Union type for all block types
export type Block = IMediaBlock | IContentBlock;
