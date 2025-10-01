// apps/web/src/types/auth.ts
/**
 * @file 인증 관련 타입 정의
 *
 * 서비스에서 사용하는 주요 인터페이스들만 남기고,
 * 토큰은 Access Token만 관리하도록 수정했습니다.
 */

/**
 * PKCE 기반 카카오 OAuth2 인가 코드 교환 요청 스펙
 */
export interface KakaoLoginRequest {
  code: string;
  codeVerifier: string;
  redirectUri: string;
  state?: string;
}

/**
 * 로그인 성공 시 서버가 반환하는 객체
 * - 신규 유저면 isNewUser=true, 기존 유저면 accessToken이 내려옵니다.
 */
export interface LoginResponse {
  isNewUser: boolean;
  /** 기존 유저일 때만 내려오는 Access Token */
  accessToken?: string;
}
/**
 * 토큰 갱신 응답 타입
 * - Access Token이 만료되었을 때 서버에서 새로 발급합니다.
 */
export interface RefreshResponse {
  jwtAccessToken: string; // 새로 발급된 Access Token
}
