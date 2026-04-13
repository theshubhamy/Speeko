import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// Mock user for MVP
const MOCK_USER: User = {
  id: 'user_1',
  name: 'Shubham',
  email: 'shubham@speeko.ai',
  plan: 'free',
  createdAt: Date.now(),
  totalSessions: 12,
  averageScore: 7.4,
  streak: 3,
};

export const useAuthStore = create<AuthState>((set) => ({
  user: MOCK_USER, // Auto-logged in for MVP
  isAuthenticated: true,
  isLoading: false,

  login: async (_email, _password) => {
    set({ isLoading: true });
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ user: MOCK_USER, isAuthenticated: true, isLoading: false });
  },

  loginAsGuest: () => {
    set({ user: MOCK_USER, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },
}));
