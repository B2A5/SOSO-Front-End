'use client';
import { useUserType } from '@/app/auth/signup/UserTypeContext';
import Header from '@/components/Header';

export default function SignUpStepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Context에서 유저 타입을 가져옵니다.
  const { userType } = useUserType();
  // 유저 타입에 따라 페이지 제목을 설정합니다.
  const getUserType = () => {
    if (userType === 'FOUNDER') {
      return '창업자';
    }
    return '주민';
  };

  return (
    <div className="flex flex-col items-center h-full">
      <Header
        title={getUserType() + '로 회원가입'}
        showSearch={false}
        leftButtonType="back"
      />

      <div className="w-full flex-1 h-full p-layout">{children}</div>
    </div>
  );
}
