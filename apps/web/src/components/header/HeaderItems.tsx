// components/header/HeaderItems.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/buttons/Button';
import { ChevronLeft, EllipsisVertical, Search } from 'lucide-react';

export function BackButton({ onClick }: { onClick?: () => void }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <Button variant="ghost" onClick={handleClick}>
      <ChevronLeft className="w-5 h-5" />
    </Button>
  );
}

export function CancelButton({ onClick }: { onClick?: () => void }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <Button variant="ghost" onClick={handleClick}>
      취소
    </Button>
  );
}

export function MenuButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <EllipsisVertical className="w-5 h-5" />
    </Button>
  );
}

export function SearchButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <Search className="w-5 h-5" />
    </Button>
  );
}
