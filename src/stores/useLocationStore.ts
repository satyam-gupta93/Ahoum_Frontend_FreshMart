import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
  selectedCity: string;
  selectedAddress: string;
  isLoading: boolean;
  setCity: (city: string) => void;
  setAddress: (address: string) => void;
  detectLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      selectedCity: '',
      selectedAddress: '',
      isLoading: false,

      setCity: (city: string) => set({ selectedCity: city, selectedAddress: city }),

      setAddress: (address: string) => set({ selectedAddress: address }),

      detectLocation: async () => {
        set({ isLoading: true });
        await new Promise((res) => setTimeout(res, 1500));
        set({ selectedCity: 'Bengaluru', selectedAddress: 'Bengaluru, Karnataka', isLoading: false });
      },
    }),
    { name: 'location-storage' }
  )
);
