
export enum AddonCategory {
  EMBROIDERY = 'embroidery',
  LETTERS = 'letters',
  PATCHES = 'patches',
  VINYL = 'vinyl'
}

export type CustomizationMode = 'COLOR' | 'LETTERS_PATCHES' | 'EMBROIDERY' | 'VINYL' | null;

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Product {
  id: string;
  variantId: string;
  title: string;
  handle: string;
  price: number;
  currency: string;
  imageUrl: string;
  description?: string;
  material?: string;
  dimensions?: string;
  variants?: { id: string; title: string; imageUrl: string; color: string }[];
}

export interface Addon {
  id: string;
  productId: string;
  variantId: string;
  category: AddonCategory;
  title: string;
  imageUrl: string;
  price: number;
  colorName?: string;
  letter?: string;
  baseColorGroup?: string; // For 2-level selection
}

export interface CanvasElement {
  instanceId: string;
  type: 'addon' | 'text' | 'image' | 'embroidery' | 'vinyl';
  addon?: Addon;
  text?: string;
  fontFamily?: string;
  color?: string;
  imageUrl?: string;
  position: Position;
  size: Size;
  rotation: number;
  zIndex: number;
}

export interface CustomizationData {
  baseProduct: Product;
  selectedVariantId: string;
  mode: CustomizationMode;
  elements: CanvasElement[];
  totalPrice: number;
  currency: string;
  previewUrl?: string;
  personalizationType: string;
}
