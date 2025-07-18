// apps/web/src/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types/auth.types';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuth: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  login: ({
    user,
    accessToken,
  }: {
    user: User;
    accessToken: string;
  }) => void;
  logout: () => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuth: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuth: true }),
      setToken: (accessToken) => set({ accessToken }),
      setLoading: (isLoading) => set({ isLoading }),

      login: ({ user, accessToken }) => {
        set({ user, accessToken, isAuth: true, isLoading: false });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuth: false,
          isLoading: false,
        });
      },

      clear: () => {
        set({
          user: null,
          accessToken: null,
          isAuth: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuth: state.isAuth,
      }),
    },
  ),
);
