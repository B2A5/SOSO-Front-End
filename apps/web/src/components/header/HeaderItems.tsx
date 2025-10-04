// components/header/HeaderItems.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/buttons/Button';
import { ChevronLeft, EllipsisVertical, Search } from 'lucide-react';

// ========================================
// 좌측 버튼들
// ========================================

/**
 * Header 전용 뒤로가기 버튼
 *
 * @description
 * - 왼쪽 화살표(ChevronLeft) 아이콘을 표시합니다
 * - 기본 동작: 이전 페이지로 이동 (router.back)
 * - onClick 제공 시 커스텀 동작 가능
 *
 * @example
 * ```tsx
 * <Header>
 *   <Header.Left>
 *     <Header.BackButton />
 *   </Header.Left>
 * </Header>
 * ```
 *
 * @param onClick - 클릭 시 실행할 커스텀 핸들러 (선택)
 */
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
      <ChevronLeft className="w-6 h-6" />
    </Button>
  );
}

/**
 * Header 전용 취소 버튼
 *
 * @description
 * - "취소" 텍스트를 표시합니다
 * - 기본 동작: 이전 페이지로 이동 (router.back)
 * - onClick 제공 시 커스텀 동작 가능
 * - 주로 폼 작성 페이지에서 사용
 *
 * @example
 * ```tsx
 * <Header>
 *   <Header.Left>
 *     <Header.CancelButton />
 *   </Header.Left>
 *   <Header.Center>글 작성</Header.Center>
 * </Header>
 * ```
 *
 * @param onClick - 클릭 시 실행할 커스텀 핸들러 (선택)
 */
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

// ========================================
// 우측 버튼들
// ========================================

/**
 * Header 전용 메뉴 버튼
 *
 * @description
 * - 세로 3점(EllipsisVertical) 아이콘을 표시합니다
 * - onClick 필수: 메뉴 열기 등의 동작을 구현해야 함
 * - 주로 바텀시트나 드롭다운 메뉴와 함께 사용
 *
 * @example
 * ```tsx
 * <Header>
 *   <Header.Center>게시글</Header.Center>
 *   <Header.Right>
 *     <Header.MenuButton onClick={() => openMenu()} />
 *   </Header.Right>
 * </Header>
 * ```
 *
 * @param onClick - 클릭 시 실행할 핸들러
 */
export function MenuButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <EllipsisVertical className="w-5 h-5" />
    </Button>
  );
}

/**
 * Header 전용 검색 버튼
 *
 * @description
 * - 돋보기(Search) 아이콘을 표시합니다
 * - onClick 필수: 검색 페이지 이동이나 검색창 열기 등을 구현해야 함
 *
 * @example
 * ```tsx
 * <Header>
 *   <Header.Left>
 *     <Tab tabs={tabs} />
 *   </Header.Left>
 *   <Header.Right>
 *     <Header.SearchButton onClick={() => router.push('/search')} />
 *   </Header.Right>
 * </Header>
 * ```
 *
 * @param onClick - 클릭 시 실행할 핸들러
 */
export function SearchButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <Search className="w-5 h-5" />
    </Button>
  );
}
