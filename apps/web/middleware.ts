import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

//로그인 필요 라우트
const PROTECTED_ROUTES = [
  '/main/community/freeboard/new',
  '/main/community/votesboard/new',
];

//로그인 시 접근 불가 라우트
const PUBLIC_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 쿠키에서 액세스 토큰 확인
  const hasAuth = request.cookies.has('accessToken');

  // 보호된 라우트 접근 시 인증 필요
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!hasAuth) {
      console.log('[Middleware] 인증 필요:', pathname);

      // 현재 URL을 returnUrl로 저장
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);

      return NextResponse.redirect(loginUrl);
    }
  }
  // 공개 라우트 접근 시 이미 인증된 경우 메인으로 리다이렉트
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    if (hasAuth) {
      console.log(
        '[Middleware] 이미 로그인됨, 메인으로 이동:',
        pathname,
      );

      const mainUrl = new URL('/main/profile', request.url);
      return NextResponse.redirect(mainUrl);
    }
  }

  return NextResponse.next();
}

/**
 * Middleware 설정
 * - Static 파일, API 라우트 제외
 */
export const config = {
  matcher: [
    /*
     * 다음을 제외한 모든 경로에 적용:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
