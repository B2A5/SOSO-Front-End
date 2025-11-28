'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/buttons/Button';
import { useAuth } from '@/hooks/useAuth';
export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">마이 페이지</h1>
      <p className="text-lg">여기에 마이 페이지 내용을 추가하세요.</p>
      <Button className="mt-4" size="lg" onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  );
}
