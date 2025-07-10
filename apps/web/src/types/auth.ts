/**
import { redirect } from 'next/navigation';
 * // apps/web/src/types/auth.ts
 * @file 인증 관련 타입 정의
 *
 * 이 파일에는 인증 흐름에 필요한 주요 인터페이스들이 정의되어 있습니다.
 * - User: 서비스에서 사용하는 회원 정보
 * - TokenInfo: JWT 토큰 및 만료 시각 정보
 * - KakaoLoginRequest: PKCE 기반 카카오 인가 코드 교환 요청 바디 스펙
 * - LoginResponse: 로그인 성공 시 반환되는 사용자 및 토큰 정보
 * - RefreshTokenRequest: 리프레시 토큰을 이용한 토큰 갱신 요청 스펙
 * - LogoutRequest: 로그아웃 시 서버로 전달할 요청 스펙
 */

/**
 * 서비스 내 회원 정보를 나타내는 타입
 */
export interface User {
  /** 서비스 내부에서 사용하는 고유 회원번호 */
  id: number;
  /** 사용자 이메일 (카카오에서 제공된 경우에만 포함) */
  email?: string;
  /** 사용자 닉네임 (프로필에서 설정된 별명) */
  nickname: string;
  /** 프로필 이미지 URL (선택적) */
  profileImageUrl?: string;
  /** 인증 제공자 종류: kakao | google | naver */
  provider: 'kakao' | 'google' | 'naver';
  /** 제공자로부터 발급된 사용자 고유 ID (예: kakao user id) */
  providerId: string;
  /** 계정 생성 일시 (ISO 8601 포맷 문자열) */
  createdAt: string;
  /** 계정 정보 최신화 일시 (ISO 8601 포맷 문자열) */
  updatedAt: string;
}

/**
 * JWT 토큰 및 만료 시각 정보를 담는 타입
 */
export interface TokenInfo {
  /** 발급된 Access Token (JWT) */
  accessToken: string;
  /** 발급된 Refresh Token (JWT) */
  refreshToken: string;
  /** Access Token 만료 시각 (Unix epoch, 밀리초 단위) */
  expiresAt: number;
  /** Refresh Token 만료 시각 (Unix epoch, 밀리초 단위) */
  refreshExpiresAt: number;
}

/**
 * @interface KakaoLoginRequest
 *
 * PKCE 기반 카카오 OAuth2 인가 코드 교환 요청 스펙 정의
 * 서버에 인가 코드와 코드 검증자(Verifier)를 전달하여
 * JWT 토큰을 발급받기 위한 요청 바디 형태입니다.
 */
export interface KakaoLoginRequest {
  /** 카카오 인증 서버에서 전달된 인가 코드 */
  code: string;
  /** PKCE Code Verifier: 코드 챌린지 검증용 랜덤 문자열 */
  codeVerifier: string;
  redirectUri: string;
  /** CSRF 방지용 상태 값 (선택적) */
  state?: string;
}

/**
 * @interface LoginResponse
 *
 * 로그인 성공 시 서버가 반환하는 객체 형태
 * 사용자 정보(`user`)와 토큰 정보(`tokens`)를 포함합니다.
 */
export interface LoginResponse {
  /** 로그인된 사용자 정보 */
  user: User;
  /** 발급된 Access/Refresh 토큰 정보 */
  tokens: TokenInfo;
}

/**
 * @interface RefreshTokenRequest
 *
 * Access Token이 만료되었을 때, 저장된 Refresh Token을 이용하여
 * 새로운 JWT 토큰을 발급받기 위한 요청 바디 형태입니다.
 */
export interface RefreshTokenRequest {
  /** 클라이언트에 저장된 Refresh Token */
  refreshToken: string;
}

/**
 * @interface LogoutRequest
 *
 * 로그아웃 처리 시 서버로 전달하는 요청 바디 형태
 * Refresh Token을 만료 처리하여 세션을 완전히 종료합니다.
 */
export interface LogoutRequest {
  /** 클라이언트에 저장된 Refresh Token */
  refreshToken: string;
}
