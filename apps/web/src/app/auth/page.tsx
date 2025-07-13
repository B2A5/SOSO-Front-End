// apps/web/src/app/auth/page.tsx
import { Suspense } from 'react';
import LoginContents from './LoginContents';

export const metadata = {
  title: '소소 로그인/회원가입',
}; // 예시

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <div className="w-full h-full p-layout">
        <LoginContents />
      </div>
    </Suspense>
  );
}
