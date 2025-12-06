'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/buttons/Button';
import { useAuth } from '@/hooks/useAuth';

interface StartButtonProps {
  className?: string;
  children: React.ReactNode;
}
export default function StartButton({
  className,
  children,
}: StartButtonProps) {
  const router = useRouter();
  const { isAuth, isLoading } = useAuth();

  const handleStart = () => {
    router.replace(isAuth ? '/main' : '/login');
  };
  return (
    <Button
      className={className}
      onClick={handleStart}
      disabled={isLoading}
      size="lg"
    >
      {children}
    </Button>
  );
}
