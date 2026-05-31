import { create } from 'zustand';
import type { Order, CartItem, Address } from '../types';
import { OrderStatus } from '../types';

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  isLoading: boolean;
  error: string | null;
  placeOrder: (
    items: CartItem[],
    total: number,
    deliveryAddress: Address,
    paymentMethod: string
  ) => Promise<boolean>;
  resetOrder: () => void;
}

export const useOrderStore = create<OrderState>()((set) => ({
  currentOrder: null,
  orderHistory: [],
  isLoading: false,
  error: null,

  placeOrder: async (
    items: CartItem[],
    total: number,
    deliveryAddress: Address,
    paymentMethod: string
  ) => {
    set({ isLoading: true, error: null });
    await new Promise((res) => setTimeout(res, 2000));

    // Simulate 90% success rate
    const success = Math.random() > 0.1;

    if (success) {
      const order: Order = {
        id: `ORD-${Date.now()}`,
        items,
        total,
        deliveryAddress,
        paymentMethod,
        status: OrderStatus.CONFIRMED,
        createdAt: new Date().toISOString(),
        estimatedDelivery: '30-45 mins',
      };
      set((state) => ({
        currentOrder: order,
        orderHistory: [order, ...state.orderHistory],
        isLoading: false,
      }));
      return true;
    } else {
      set({ error: 'Payment failed. Please try again.', isLoading: false });
      return false;
    }
  },

  resetOrder: () => set({ currentOrder: null, error: null }),
}));
