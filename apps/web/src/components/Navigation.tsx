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
      // /main 또는 /main/community, 또는 그 하위 경로 모두 활성화
      return (
        currentPath === '/main' ||
        currentPath === href ||
        currentPath.startsWith(`${href}/`)
      );
    }
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  return (
    <nav className=" bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700 z-50">
      <div className="flex items-center justify-around h-16 px-4">
        {NAVIGATION_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href as Route<string>} // 타입 이슈 해결
              className={twMerge(
                'flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg ',
                'transition-colors transition-scale duration-200 min-w-0 flex-1',
                'text-neutral-400 ',
                active ? 'text-black dark:text-white scale-95' : '',
              )}
            >
              {/* todo: 아이콘 그냥 가져와야하나? 루시드 리엑트 stroke issue */}
              <Icon
                className={`w-7 h-7 ${active ? 'fill-soso-600 text-soso-600' : ''}`}
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
