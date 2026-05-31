import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types';

interface FavoritesState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (product: Product) => {
        set((state) => {
          if (state.favorites.find((f) => f.id === product.id)) return state;
          return { favorites: [...state.favorites, product] };
        });
      },

      removeFavorite: (productId: string) => {
        set((state) => ({ favorites: state.favorites.filter((f) => f.id !== productId) }));
      },

      isFavorite: (productId: string) => {
        return !!get().favorites.find((f) => f.id === productId);
      },

      toggleFavorite: (product: Product) => {
        if (get().isFavorite(product.id)) {
          get().removeFavorite(product.id);
        } else {
          get().addFavorite(product);
        }
      },
    }),
    { name: 'favorites-storage' }
  )
);
