// apps/web/src/types/auth.ts
/**
 * 인증 관련 타입 정의
 */
export interface User {
  id: number;
  email?: string;
  nickname: string;
  profileImage?: string;
  provider: 'kakao' | 'google' | 'naver';
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
}

export interface KakaoLoginRequest {
  code: string;
  redirectUri: string;
  codeVerifier: string; // PKCE
  state?: string;
}

export interface LoginResponse {
  user: User;
  tokens: TokenInfo;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}
