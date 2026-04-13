import { create } from 'zustand';
import { User } from '@/types';
import {
  loginWithEmail,
  registerWithEmail,
  loginAsGuest as firebaseLoginAsGuest,
  logout as firebaseLogout,
  onAuthStateChange,
  getAppUser,
  updateUserProfile as firebaseUpdateUserProfile,
} from '@/services/auth.service';
import { auth } from '@/services/firebase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean; // tracks if onAuthStateChanged has fired at least once
  error: string | null;

  // Actions
  initialize: () => () => void; // returns unsubscribe fn
  login: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  // ─── Initialize — call once at app start ─────────────────────────────────
  initialize: () => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const appUser = await getAppUser(firebaseUser);
          set({ user: appUser, isAuthenticated: !!appUser, isInitialized: true });
        } catch {
          set({ user: null, isAuthenticated: false, isInitialized: true });
        }
      } else {
        set({ user: null, isAuthenticated: false, isInitialized: true });
      }
    });
    return unsubscribe;
  },

  // ─── Login ────────────────────────────────────────────────────────────────
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginWithEmail(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (e: any) {
      const message = firebaseErrorMessage(e.code);
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },


  // ─── Guest Login ──────────────────────────────────────────────────────────
  loginAsGuest: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await firebaseLoginAsGuest();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (e: any) {
      const message = firebaseErrorMessage(e.code);
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  // ─── Register ─────────────────────────────────────────────────────────────
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await registerWithEmail(name, email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (e: any) {
      const message = firebaseErrorMessage(e.code);
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  // ─── Logout ───────────────────────────────────────────────────────────────
  logout: async () => {
    await firebaseLogout();
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),

  updateProfile: async (updates) => {
    const user = get().user;
    if (!user) return;

    try {
      await firebaseUpdateUserProfile(user.id, updates);
      set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      }));
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  },
}));

// ─── Human-readable Firebase error messages ───────────────────────────────────

function firebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
