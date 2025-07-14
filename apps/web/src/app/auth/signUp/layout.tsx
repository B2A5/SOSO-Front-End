//회원가입 레이아웃
// apps/web/src/app/auth/signup/layout.tsx

import { Button } from '@/components/buttons/Button';
export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center h-full">
      <div className="w-full flex-1">{children}</div>
      <Button size="lg">회원가입</Button>
    </div>
  );
}
