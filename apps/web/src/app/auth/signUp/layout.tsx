//회원가입 레이아웃
// apps/web/src/app/auth/signup/layout.tsx

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center h-full p-layout">
      <div className="w-full flex-1 h-full">{children}</div>
    </div>
  );
}
