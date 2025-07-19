// apps/web/src/types/auth.ts
/**
 * @file 인증 관련 타입 정의
 *
 * 서비스에서 사용하는 주요 인터페이스들만 남기고,
 * 토큰은 Access Token만 관리하도록 수정했습니다.
 */

/** 서비스 내 회원 정보를 나타내는 타입 */
export interface User {
  /** 내부 고유 회원번호 */
  id?: number;
  /** 이메일 (카카오 등 OAuth 제공자에서 받은 경우) */
  email?: string;
  /** 사용자 닉네임 */
  nickname: string;
  /** 프로필 이미지 URL */
  profileImageUrl?: string;
  // /** 인증 제공자 종류: kakao | google | naver */
  // provider: 'kakao' | 'google' | 'naver';
  /** 제공자로부터 발급된 사용자 고유 ID */
  providerId?: string;
  /** 계정 생성 일시 (ISO 8601) */
  createdAt?: string;
  /** 계정 정보 최신화 일시 (ISO 8601) */
  updatedAt?: string;
}

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
