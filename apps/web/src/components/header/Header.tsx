import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/**
 * 헤더 컴포넌트
 * - 좌측, 중앙, 우측 영역으로 구성
 */
interface HeaderProps {
  children: ReactNode;
  className?: string;
}

interface HeaderComponents {
  (props: HeaderProps): JSX.Element;
  Left: typeof HeaderLeft;
  Center: typeof HeaderCenter;
  Right: typeof HeaderRight;
}

/** 메인 컴포넌트 */
function HeaderRoot({ children, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'w-full flex justify-between items-center',
        'py-[6px] px-5',
        'border-b border-neutral-100 dark:border-neutral-800',
        'bg-transparent',
        className,
      )}
    >
      {children}
    </header>
  );
}

/** 좌측 영역 */
function HeaderLeft({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={cn('flex-1', className)}>{children}</div>;
}

/** 중앙 영역 (제목) */
function HeaderCenter({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        'text-body1 font-bold text-center dark:text-fontColor-gray1',
        className,
      )}
    >
      {children}
    </h1>
  );
}

/** 우측 영역 */
function HeaderRight({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex justify-end flex-1', className)}>
      {children}
    </div>
  );
}

export const Header = HeaderRoot as HeaderComponents;
Header.Left = HeaderLeft;
Header.Center = HeaderCenter;
Header.Right = HeaderRight;
