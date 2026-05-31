// ─── Enums (Const Objects for Type Erasure Compliance) ──────────────────────────

export const ProductCategory = {
  FRUITS: 'Fruits',
  VEGETABLES: 'Vegetables',
  DAIRY: 'Dairy',
  BAKERY: 'Bakery',
  MEAT: 'Meat',
  BEVERAGES: 'Beverages',
  SNACKS: 'Snacks',
  FROZEN: 'Frozen',
  PERSONAL_CARE: 'Personal Care',
  HOUSEHOLD: 'Household',
} as const;
export type ProductCategory = typeof ProductCategory[keyof typeof ProductCategory];

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const SortOption = {
  RELEVANCE: 'Relevance',
  PRICE_LOW: 'Price: Low to High',
  PRICE_HIGH: 'Price: High to Low',
  RATING: 'Top Rated',
  NEWEST: 'Newest',
} as const;
export type SortOption = typeof SortOption[keyof typeof SortOption];


// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  label?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: ProductCategory;
  unit: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isOrganic?: boolean;
  tags: string[];
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: ProductCategory;
  icon: string;
  color: string;
  bgColor: string;
  productCount: number;
  image: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  bgColor: string;
  ctaText: string;
  ctaLink: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  deliveryAddress: Address;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery?: string;
}

export interface FilterState {
  category: ProductCategory | null;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: SortOption;
  isOrganic: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
