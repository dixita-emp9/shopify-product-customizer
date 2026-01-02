
import { AddonCategory, Product, Addon } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'gid://shopify/Product/1',
    variantId: 'gid://shopify/ProductVariant/101',
    title: 'SPECIAL EDITION Personalised Pouch - Medium',
    handle: 'personalised-pouch-medium',
    price: 130.0,
    currency: 'AED',
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1200',
    description: 'A versatile and stylish pouch perfect for organizing your essentials with a personal touch.',
    material: 'Nylon & Gold-tone hardware',
    dimensions: 'H 12cm x W 19cm x D 5cm',
    variants: [
      { id: 'v1', title: 'Pink Safari', color: '#ffb6c1', imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1200' },
      { id: 'v2', title: 'Black Onyx', color: '#000000', imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1200' },
      { id: 'v3', title: 'Royal Navy', color: '#000080', imageUrl: 'https://images.unsplash.com/photo-1544816153-12ad5d7133a2?auto=format&fit=crop&q=80&w=1200' },
    ]
  },
  {
    id: 'gid://shopify/Product/2',
    variantId: 'gid://shopify/ProductVariant/202',
    title: 'Luxury Canvas Tote - Large',
    handle: 'luxury-canvas-tote',
    price: 245.0,
    currency: 'AED',
    imageUrl: 'https://images.unsplash.com/photo-1544816153-12ad5d7133a2?auto=format&fit=crop&q=80&w=1200',
    description: 'Durable and spacious tote bag made from premium heavyweight canvas.',
    material: 'Heavyweight Canvas & Leather straps',
    dimensions: 'H 35cm x W 45cm x D 15cm',
    variants: [
      { id: 'v4', title: 'Natural', color: '#f5f5dc', imageUrl: 'https://images.unsplash.com/photo-1544816153-12ad5d7133a2?auto=format&fit=crop&q=80&w=1200' },
      { id: 'v5', title: 'Black', color: '#000000', imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1200' },
    ]
  }
];

export const LETTER_COLORS = [
  'White', 'Cream', 'Lemon', 'Brown', 'Baby Pink', 'Rose Pink', 'Neon Pink', 'Fuchsia', 
  'Lilac', 'Purple', 'Turquoise', 'Baby Blue', 'Neon Green', 'Green', 'Royal Blue', 
  'Navy Blue', 'Black', 'Yellow', 'Pastel Orange', 'Orange', 'Red'
];

export const MOCK_ADDONS: Addon[] = [
  ...LETTER_COLORS.map((color, index) => ({
    id: `letter_base_${color}`,
    productId: `gid://shopify/Product/700${index}`,
    variantId: `gid://shopify/ProductVariant/7000${index}`,
    category: AddonCategory.LETTERS,
    title: `${color} Letter`,
    colorName: color,
    letter: 'A',
    imageUrl: `https://api.dicebear.com/7.x/initials/svg?seed=A&backgroundColor=${getColorHex(color)}&fontSize=60`,
    price: 8.0,
    baseColorGroup: color,
  })),
  {
    id: 'patch_base_1',
    productId: 'gid://shopify/Product/801',
    variantId: 'gid://shopify/ProductVariant/8010',
    category: AddonCategory.PATCHES,
    title: 'Retro Rocket',
    colorName: 'Original',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1043/1043444.png',
    price: 15.0,
  },
  {
    id: 'patch_base_2',
    productId: 'gid://shopify/Product/802',
    variantId: 'gid://shopify/ProductVariant/8020',
    category: AddonCategory.PATCHES,
    title: 'Peace Sign',
    colorName: 'Original',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1044/1044237.png',
    price: 12.0,
  },
  {
    id: 'patch_base_3',
    productId: 'gid://shopify/Product/803',
    variantId: 'gid://shopify/ProductVariant/8030',
    category: AddonCategory.PATCHES,
    title: 'Smiley Face',
    colorName: 'Yellow',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/742/742751.png',
    price: 10.0,
  }
];

export const EMBROIDERY_FONTS = [
  { id: 'Lucida', name: 'Lucida', family: 'cursive' },
  { id: 'Monotype', name: 'Monotype', family: 'serif' },
  { id: 'Bianca', name: 'Bianca', family: 'Georgia' },
  { id: 'Zachary', name: 'Zachary', family: 'Times New Roman' },
  { id: 'Playball', name: 'Playball', family: 'cursive' }
];

export const EMBROIDERY_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Green', hex: '#008000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Neon Yellow', hex: '#CCFF00' },
  { name: 'Orange', hex: '#FFA500' }
];

function getColorHex(name: string): string {
  const map: Record<string, string> = {
    'White': 'ffffff', 'Cream': 'f5f5dc', 'Lemon': 'fff44f', 'Brown': '964b00',
    'Baby Pink': 'f4c2c2', 'Rose Pink': 'ff66cc', 'Neon Pink': 'ff6ec7', 'Fuchsia': 'ff00ff',
    'Lilac': 'c8a2c8', 'Purple': '800080', 'Turquoise': '40e0d0', 'Baby Blue': '89cff0',
    'Neon Green': '39ff14', 'Green': '008000', 'Royal Blue': '4169e1', 'Navy Blue': '000080',
    'Black': '000000', 'Yellow': 'ffff00', 'Pastel Orange': 'ffb347', 'Orange': 'ffa500', 'Red': 'ff0000'
  };
  return map[name] || 'cccccc';
}
