'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 둥근 정도 (e.g. 'rounded-md', 'rounded-full') */
  radius?: string;
}

/**
 * Skeleton (스켈레톤 로딩 컴포넌트)
 *
 * - 간단한 로딩 상태를 표시하기 위한 기본 블록
 * - 배경색/애니메이션은 Tailwind 기반으로 동작
 * - 어디서나 재사용 가능
 *
 * @example
 * <Skeleton className="w-32 h-6" />
 * <Skeleton className="w-full h-[200px] rounded-lg" />
 */
export const Skeleton = React.forwardRef<
  HTMLDivElement,
  SkeletonProps
>(({ className, radius = 'rounded-md', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge(
        'animate-pulse bg-neutral-100 dark:bg-neutral-800',
        radius,
        className,
      )}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';
export default Skeleton;
