// src/app/auth/signup/[type]/layout.tsx
'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import type { UserType } from '@/api/signup';
import { useParams, useRouter } from 'next/navigation';

/**
 * 회원가입 타입별 공통 레이아웃
 * URL 세그먼트 (/auth/signup/[type]/...)에서 founder|inhabitant 을 읽어
 * 창업자/주민 라벨을 렌더합니다.
 * 잘못된 타입이면 /auth/signup 으로 리다이렉트합니다.
 */
export default function SignUpStepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ type?: string | string[] }>();
  const router = useRouter();

  // 1) 파라미터 정규화 (string | string[])
  const rawType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;
  const paramType = rawType?.toLowerCase();

  // 2) 매핑
  const derivedUserType: UserType | null =
    paramType === 'founder'
      ? 'FOUNDER'
      : paramType === 'inhabitant'
        ? 'INHABITANT'
        : null;

  // 3) 잘못된 값이면 시작 페이지로
  useEffect(() => {
    if (derivedUserType == null) {
      router.replace('/auth/signup');
    }
  }, [derivedUserType, router]);

  // redirect 중일 때 렌더 중단
  if (derivedUserType == null) return null;

  // 4) 헤더 타이틀
  const title = derivedUserType === 'FOUNDER' ? '창업자' : '주민으';

  return (
    <div className="flex flex-col items-center h-full">
      <Header
        title={`${title}로 회원가입`}
        showSearch={false}
        leftButtonType="back"
      />
      <div className="w-full flex-1 h-full p-layout">{children}</div>
    </div>
  );
}
