import { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import {
  BackButton,
  CancelButton,
  MenuButton,
  SearchButton,
} from './HeaderItems';

/**
 * Header 컴포넌트
 *
 * @description
 * Compound Component 패턴을 사용한 헤더 컴포넌트입니다.
 * 좌측(Left), 중앙(Center), 우측(Right) 영역으로 구성되며,
 * 각 영역에 원하는 콘텐츠를 자유롭게 배치할 수 있습니다.
 *
 * @features
 * - 반응형 레이아웃
 * - Center는 항상 화면 정중앙에 위치 (absolute positioning)
 * - 긴 제목은 자동으로 말줄임표(...) 처리
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <Header>
 *   <Header.Left>
 *     <Header.BackButton />
 *   </Header.Left>
 *   <Header.Center>페이지 제목</Header.Center>
 *   <Header.Right>
 *     <Header.MenuButton onClick={handleMenu} />
 *   </Header.Right>
 * </Header>
 *
 * // Left나 Right 생략 가능
 * <Header>
 *   <Header.Center>제목만</Header.Center>
 * </Header>
 * ```
 */
interface HeaderProps {
  children: ReactNode;
  className?: string;
}

interface HeaderComposition {
  (props: HeaderProps): JSX.Element;
  /** 좌측 영역 (주로 뒤로가기, 취소 버튼) */
  Left: typeof HeaderLeft;
  /** 중앙 영역 (제목) */
  Center: typeof HeaderCenter;
  /** 우측 영역 (주로 검색, 메뉴 버튼) */
  Right: typeof HeaderRight;
  /** 뒤로가기 버튼 (ChevronLeft 아이콘) */
  BackButton: typeof BackButton;
  /** 취소 버튼 (텍스트) */
  CancelButton: typeof CancelButton;
  /** 메뉴 버튼 (3점 아이콘) */
  MenuButton: typeof MenuButton;
  /** 검색 버튼 (돋보기 아이콘) */
  SearchButton: typeof SearchButton;
}

/**
 * Header 메인 컨테이너
 *
 * @internal
 */
function HeaderRoot({ children, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'relative w-full flex justify-between items-center',
        'py-1.5 px-1',
        'border-b border-neutral-100 dark:border-neutral-800',
        'bg-transparent',
        className,
      )}
    >
      {children}
    </header>
  );
}

/**
 * Header 좌측 영역
 *
 * @description
 * - 주로 뒤로가기, 취소 버튼 등을 배치합니다
 * - flex-1로 우측과 균형을 맞춥니다
 *
 * @example
 * ```tsx
 * <Header.Left>
 *   <Header.BackButton />
 * </Header.Left>
 * ```
 */
function HeaderLeft({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={cn('flex-1', className)}>{children}</div>;
}

/**
 * Header 중앙 영역 (제목)
 *
 * @description
 * - absolute positioning으로 항상 화면 정중앙에 위치
 * - 최대 너비 60%로 제한되며, 넘치면 말줄임표(...) 표시
 * - Left나 Right가 없어도 중앙 유지
 *
 * @example
 * ```tsx
 * <Header.Center>페이지 제목</Header.Center>
 * ```
 */
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
        'absolute left-1/2 -translate-x-1/2',
        'max-w-[60%] truncate',
        className,
      )}
      title={typeof children === 'string' ? children : undefined}
    >
      {children}
    </h1>
  );
}

/**
 * Header 우측 영역
 *
 * @description
 * - 주로 검색, 메뉴 버튼 등을 배치합니다
 * - flex-1로 좌측과 균형을 맞춥니다
 * - justify-end로 우측 정렬
 *
 * @example
 * ```tsx
 * <Header.Right>
 *   <Header.SearchButton onClick={handleSearch} />
 *   <Header.MenuButton onClick={handleMenu} />
 * </Header.Right>
 * ```
 */
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

// Compound Component 조합
export const Header = HeaderRoot as HeaderComposition;

// Layout 영역
Header.Left = HeaderLeft;
Header.Center = HeaderCenter;
Header.Right = HeaderRight;

// Action 버튼들
Header.BackButton = BackButton;
Header.CancelButton = CancelButton;
Header.MenuButton = MenuButton;
Header.SearchButton = SearchButton;
