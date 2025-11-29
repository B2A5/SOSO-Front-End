/**
 * 서버 컴포넌트 전용 API 클라이언트
 * Next.js rewrites 프록시를 통해 백엔드와 통신합니다.
 *
 * NOTE: 서버 컴포넌트에서는 localhost의 프록시(/api/users/me)를 사용합니다.
 *       쿠키가 자동으로 포함되므로 수동 전달 불필요.
 */

import { cookies } from 'next/headers';

/**
 * 서버에서 현재 로그인한 사용자 정보 조회
 *
 * @returns 사용자 정보 또는 null (에러 시 또는 프록시 비활성화 시)
 */
export async function getServerCurrentUser() {
  // 프록시 비활성화 시(HTTP CSR 전용 모드) SSR 인증 불가
  const proxyEnabled =
    process.env.NEXT_PUBLIC_ENABLE_PROXY !== 'false';

  if (!proxyEnabled) {
    console.log(
      '[ServerAPI] 🚫 프록시 비활성화 - SSR 인증 스킵 (CSR 전용 모드)',
    );
    return null;
  }

  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  console.log(
    '[ServerAPI] accessToken:',
    accessToken ? '있음' : '없음',
  );

  if (!accessToken) {
    return null;
  }

  // Next.js 내부 프록시 사용 (/api/users/me )
  // localhost 내부 통신이므로 쿠키가 자동으로 포함됨
  const proxyUrl = 'http://localhost:3000/api/users/me';

  const response = await fetch(proxyUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
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
  console.log('[ServerAPI] 사용자 정보 조회 성공');
  return data;
}
