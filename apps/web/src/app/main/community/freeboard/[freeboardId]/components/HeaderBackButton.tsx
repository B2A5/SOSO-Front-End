'use client';

import { useRouter } from 'next/navigation';

export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={className}
      aria-label="뒤로가기"
    >
      ←
    </button>
  );
}
