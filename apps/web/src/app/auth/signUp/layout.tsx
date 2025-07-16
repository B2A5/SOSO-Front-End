//회원가입 레이아웃
// apps/web/src/app/auth/signup/layout.tsx
import { UserTypeProvider } from './UserTypeContext';

export const metadata = {
  title: '회원가입',
};
export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserTypeProvider>
      <div className="flex flex-col items-center h-full">
        <div className="w-full flex-1 h-full">{children}</div>
      </div>
    </UserTypeProvider>
  );
}
