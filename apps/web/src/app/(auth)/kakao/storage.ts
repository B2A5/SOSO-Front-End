/**
 * 카카오 OAuth 인증 데이터 저장소
 * sessionStorage를 사용하여 PKCE verifier와 state를 관리합니다.
 */

const KEYS = {
  VERIFIER: 'kakao_code_verifier',
  STATE: 'kakao_oauth_state',
} as const;

/**
 * PKCE code_verifier를 저장합니다.
 */
export const setVerifier = (value: string): void => {
  sessionStorage.setItem(KEYS.VERIFIER, value);
};

/**
 * OAuth state를 저장합니다.
 */
export const setState = (value: string): void => {
  sessionStorage.setItem(KEYS.STATE, value);
};

/**
 * 저장된 PKCE code_verifier를 조회합니다.
 */
export const getVerifier = (): string | null => {
  return sessionStorage.getItem(KEYS.VERIFIER);
};

/**
 * 저장된 OAuth state를 조회합니다.
 */
export const getState = (): string | null => {
  return sessionStorage.getItem(KEYS.STATE);
};

/**
 * 저장된 모든 인증 데이터를 삭제합니다.
 */
export const clear = (): void => {
  sessionStorage.removeItem(KEYS.VERIFIER);
  sessionStorage.removeItem(KEYS.STATE);
};
