import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const MOCK_USER: User = {
  id: 'user1',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '+91 98765 43210',
  address: {
    street: '42, Green Park Colony',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    label: 'Home',
  },
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      otpSent: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true, error: null });
        await new Promise((res) => setTimeout(res, 1200));
        if (email && _password) {
          set({ user: { ...MOCK_USER, email }, isAuthenticated: true, isLoading: false });
        } else {
          set({ error: 'Invalid credentials', isLoading: false });
        }
      },

      signup: async (name: string, email: string, phone: string, _password: string) => {
        set({ isLoading: true, error: null });
        await new Promise((res) => setTimeout(res, 1200));
        const newUser: User = {
          ...MOCK_USER,
          id: `user_${Date.now()}`,
          name,
          email,
          phone,
        };
        set({ user: newUser, isAuthenticated: true, isLoading: false });
      },

      sendOtp: async (_phone: string) => {
        set({ isLoading: true, error: null });
        await new Promise((res) => setTimeout(res, 1000));
        set({ otpSent: true, isLoading: false });
      },

      verifyOtp: async (otp: string) => {
        set({ isLoading: true, error: null });
        await new Promise((res) => setTimeout(res, 1000));
        if (otp === '123456' || otp.length === 6) {
          set({ isAuthenticated: true, isLoading: false });
          return true;
        }
        set({ error: 'Invalid OTP. Try 123456.', isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, otpSent: false });
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'auth-storage' }
  )
);
