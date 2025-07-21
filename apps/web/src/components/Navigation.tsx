// apps/web/src/components/navigation/BottomNavigation.tsx
'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { NAVIGATION_ITEMS } from '@/types/navigation.types';
import { twMerge } from 'tailwind-merge';

interface BottomNavigationProps {
  currentPath: string;
}

/**
 * 하단 네비게이션 바 컴포넌트
 */
export function Navigation({ currentPath }: BottomNavigationProps) {
  // 현재 경로에 따라 활성화된 네비게이션 아이템을 결정하는 함수
  const isActive = (href: string): boolean => {
    if (href === '/main/community') {
      return (
        currentPath === '/main' || currentPath === '/main/community'
      );
    }
    return currentPath === href;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16 px-4">
        {NAVIGATION_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href as Route<string>} // 타입 이슈 해결
              className={twMerge(
                'flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-colors transition-scale duration-200 min-w-0 flex-1',
                'text-neutral-400 ',
                active ? 'text-white bg-soso-600 scale-95' : '',
              )}
            >
              <Icon
                className={`w-5 h-5 ${active ? 'fill-current' : ''}`}
              />
              <span className="text-xs font-medium truncate">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
