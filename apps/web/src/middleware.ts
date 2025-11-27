import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 로그인 필요 라우트
const PROTECTED_ROUTES = [
  '/main/community/freeboard/new',
  '/main/community/votesboard/new',
];

// 로그인 시 접근 불가 라우트
const PUBLIC_ROUTES = ['/login', '/signup'];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * 로그인 페이지로 리다이렉트 (returnUrl 포함)
 */
function redirectToLogin(request: NextRequest, pathname: string) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('returnUrl', pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 프록시 비활성화 시(HTTP CSR 전용 모드) 미들웨어 인증 스킵
  const proxyEnabled =
    process.env.NEXT_PUBLIC_ENABLE_PROXY !== 'false';

  if (!proxyEnabled) {
    console.log(
      '[Middleware] 🚫 프록시 비활성화 - 미들웨어 인증 스킵 (CSR 전용 모드)',
    );
    return NextResponse.next();
  }

  if (!API_BASE_URL) {
    console.error(
      '[Middleware] NEXT_PUBLIC_API_BASE_URL is not defined',
    );
    return NextResponse.next();
  }

  // 모든 쿠키 확인
  const allCookies = request.cookies.getAll();
  console.log(
    `[Middleware] 📦 전체 쿠키 개수: ${allCookies.length}`,
    allCookies.map((c) => c.name),
  );

  // 쿠키에서 액세스 토큰과 리프레시 토큰 확인
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  let hasAuth = !!accessToken;

  // 디버깅: 쿠키 상태 로그
  console.log(
    `[Middleware] ${pathname} - accessToken: ${accessToken ? '있음' : '없음'}, refreshToken: ${refreshToken ? '있음' : '없음'}`,
  );

  // 액세스 토큰이 없고 리프레시 토큰만 있는 경우 토큰 갱신 시도
  if (!accessToken && refreshToken) {
    try {
      // 프록시를 통해 토큰 갱신 (쿠키 자동 포함)
      const refreshResponse = await fetch(
        'http://localhost:3000/api/auth/refresh',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (refreshResponse.ok) {
        console.log('[Middleware] 토큰 갱신 성공');

        // Set-Cookie 헤더를 클라이언트로 전달
        const setCookieHeaders = refreshResponse.headers.getSetCookie
          ? refreshResponse.headers.getSetCookie()
          : [];

        if (setCookieHeaders.length > 0) {
          setCookieHeaders.forEach((cookie) => {
            // Request 쿠키 업데이트 (downstream에서 accessToken 사용 가능)
            const [cookiePart] = cookie.split(';');
            const [name, value] = cookiePart.split('=');
            if (name?.trim() === 'accessToken' && value) {
              request.cookies.set('accessToken', value);
              hasAuth = true;
            }
          });
        }

        // 토큰 갱신 성공 후 루트 경로면 리다이렉트
        if (pathname === '/') {
          const targetUrl = hasAuth ? '/main' : '/login';
          console.log(
            `[Middleware] 토큰 갱신 후 루트 접근 → ${targetUrl}로 리다이렉트`,
          );
          const redirectResponse = NextResponse.redirect(
            new URL(targetUrl, request.url),
          );
          // Set-Cookie 헤더 유지
          setCookieHeaders.forEach((cookie) => {
            redirectResponse.headers.append('Set-Cookie', cookie);
          });
          return redirectResponse;
        }

        // 다른 경로는 계속 진행
        const newResponse = NextResponse.next();
        setCookieHeaders.forEach((cookie) => {
          newResponse.headers.append('Set-Cookie', cookie);
        });
        return newResponse;
      } else {
        console.log('[Middleware] 토큰 갱신 실패 - 로그아웃 처리');
        // refreshToken도 만료된 경우 쿠키 삭제
        const response = NextResponse.next();
        response.cookies.delete('refreshToken');
        response.cookies.delete('accessToken');

        // 보호된 라우트 접근 시도면 로그인으로 리다이렉트
        if (
          PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
        ) {
          return redirectToLogin(request, pathname);
        }

        return response;
      }
    } catch (error) {
      console.error('[Middleware] 토큰 갱신 중 에러:', error);

      // 보호된 라우트 접근 시도면 로그인으로 리다이렉트
      if (
        PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
      ) {
        return redirectToLogin(request, pathname);
      }

      // 에러 발생 시에도 계속 진행
      return NextResponse.next();
    }
  }

  // 보호된 라우트 접근 시 인증 필요
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!hasAuth) {
      console.log('[Middleware] 인증 필요:', pathname);
      return redirectToLogin(request, pathname);
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
