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
  getUser: () => User | null;
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
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuth: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuth: true }),
      getUser: () => get().user,
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
        console.log('로그아웃 되었습니다.');
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
    // 임시로 로컬 스토리지에 저장
    // 추후 서버 세션 관리, 메모리 등으로 변경 예정
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
