import { create } from 'zustand';
import type { Product, FilterState } from '../types';
import { ProductCategory, SortOption } from '../types';
import { products as allProducts } from '../data/products';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: FilterState;
  fetchProducts: () => Promise<void>;
  fetchByCategory: (category: ProductCategory) => Promise<void>;
  searchProducts: (query: string) => void;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilters: () => void;
  getProductById: (id: string) => Product | undefined;
  getFeaturedProducts: () => Product[];
  getProductsByCategory: (category: ProductCategory) => Product[];
}

const defaultFilters: FilterState = {
  category: null,
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
  sortBy: SortOption.RELEVANCE,
  isOrganic: false,
};

function applyFilters(products: Product[], filters: FilterState, query: string): Product[] {
  let result = [...products];

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  result = result.filter(
    (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
  );

  if (filters.minRating > 0) {
    result = result.filter((p) => p.rating >= filters.minRating);
  }

  if (filters.isOrganic) {
    result = result.filter((p) => p.isOrganic === true);
  }

  switch (filters.sortBy) {
    case SortOption.PRICE_LOW:
      result.sort((a, b) => a.price - b.price);
      break;
    case SortOption.PRICE_HIGH:
      result.sort((a, b) => b.price - a.price);
      break;
    case SortOption.RATING:
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return result;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  filteredProducts: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  filters: defaultFilters,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    await new Promise((res) => setTimeout(res, 800));
    set({
      products: allProducts,
      filteredProducts: allProducts,
      isLoading: false,
    });
  },

  fetchByCategory: async (category: ProductCategory) => {
    set({ isLoading: true, error: null });
    await new Promise((res) => setTimeout(res, 600));
    const filtered = allProducts.filter((p) => p.category === category);
    set({ filteredProducts: filtered, isLoading: false });
  },

  searchProducts: (query: string) => {
    const { filters } = get();
    set({
      searchQuery: query,
      filteredProducts: applyFilters(allProducts, filters, query),
    });
  },

  setFilter: (filter: Partial<FilterState>) => {
    const { filters, searchQuery } = get();
    const newFilters = { ...filters, ...filter };
    set({
      filters: newFilters,
      filteredProducts: applyFilters(allProducts, newFilters, searchQuery),
    });
  },

  resetFilters: () => {
    set({
      filters: defaultFilters,
      searchQuery: '',
      filteredProducts: allProducts,
    });
  },

  getProductById: (id: string) => allProducts.find((p) => p.id === id),

  getFeaturedProducts: () => allProducts.filter((p) => p.isFeatured),

  getProductsByCategory: (category: ProductCategory) =>
    allProducts.filter((p) => p.category === category),
}));
