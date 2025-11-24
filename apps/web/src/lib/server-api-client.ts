/**
 * 서버 컴포넌트 전용 API 클라이언트
 * 쿠키를 수동으로 전달하여 인증된 요청을 보냅니다.
 */

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

/**
 * 서버에서 현재 로그인한 사용자 정보 조회
 *
 * @returns 사용자 정보 또는 null (에러 시)
 */
export async function getServerCurrentUser() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    console.log('[ServerAPI] accessToken 없음');
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    // 401/403: 인증 실패는 null 반환 (캐시됨, 로그아웃 상태)
    if (response.status === 401 || response.status === 403) {
      console.log('[ServerAPI] 인증 실패 (401/403)');
      return null;
    }

    // 500등의 서버 에러는 throw (캐시 안됨, 클라이언트에서 재시도)
    console.error('[ServerAPI] 서버 에러:', response.status);
    throw new Error(`Server error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
