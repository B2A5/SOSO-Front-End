// src/app/auth/signup/[type]/layout.tsx
'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useSignupFlow } from '@/hooks/useSignupFlow';

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
  const router = useRouter();
  const { userType } = useSignupFlow();

  // 잘못된 값이면 시작 페이지로
  useEffect(() => {
    if (userType == null) {
      router.replace('/auth/signup');
    }
  }, [userType, router]);

  // redirect 중일 때 렌더 중단
  if (userType == null) return null;

  // 헤더 타이틀
  const title = userType === 'FOUNDER' ? '창업자' : '주민';

  return (
    <div className="flex flex-col items-center h-full">
      <Header title={`${title}로 회원가입`} leftButtonType="back" />
      <div className="w-full flex-1 h-full p-layout">{children}</div>
    </div>
  );
}
