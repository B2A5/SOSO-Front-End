// apps/web/src/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, TokenInfo } from '@/types/auth';

interface AuthState {
  // 상태
  user: User | null;
  tokens: TokenInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 액션
  setUser: (user: User) => void;
  setTokens: (tokens: TokenInfo) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, tokens: TokenInfo) => void;
  logout: () => void;
  clearAuth: () => void;

  // 유틸
  isTokenExpired: () => boolean;
  isTokenExpiringSoon: () => boolean;
}

// 인증 상태 관리 스토어
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      // 유저 정보 설정
      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
        });
      },

      // 토큰 정보 설정
      setTokens: (tokens: TokenInfo) => {
        set({ tokens });
      },

      // 로딩 상태 설정
      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      // 로그인 처리
      login: (user: User, tokens: TokenInfo) => {
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      // 로그아웃 처리
      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // 인증 정보 초기화
      clearAuth: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      // 토큰 만료 여부 확인
      isTokenExpired: () => {
        const { tokens } = get();
        if (!tokens) return true;

        return Date.now() >= tokens.expiresAt;
      },

      // 토큰이 곧 만료되는지 확인 (5분 전)
      isTokenExpiringSoon: () => {
        const { tokens } = get();
        if (!tokens) return true;

        const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
        return fiveMinutesFromNow >= tokens.expiresAt;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
