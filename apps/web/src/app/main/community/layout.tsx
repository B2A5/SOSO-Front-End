'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { BoardSwitcherTab } from './components/BoardSwitcherTab';
import type { CommunityTabValue } from '@/types/tab.types';

/**
 * 커뮤니티 공통 레이아웃
 *
 * @description
 * 투표 게시판과 자유 게시판의 공통 컨테이너
 * BoardSwitcher를 상위에서 관리하여 탭 애니메이션 유지
 * 상세/작성 페이지에서는 BoardSwitcher 대신 뒤로가기 버튼 표시
 */
export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 게시글 목록 페이지인지 확인 (상세/작성 페이지 제외)
  const isListPage =
    pathname === '/main/community/votesboard' ||
    pathname === '/main/community/freeboard';

  const current = pathname.includes('freeboard')
    ? 'freeboard'
    : 'votesboard';

  const handleSearchClick = () => {
    // TODO: 검색 기능 구현
    console.log('Search clicked');
  };

  return (
    <div className="flex flex-col h-full w-full">
      {isListPage ? (
        <Header>
          <Header.Left>
            <BoardSwitcherTab
              current={current as CommunityTabValue}
            />
          </Header.Left>
          <Header.Right>
            <Header.SearchButton onClick={handleSearchClick} />
          </Header.Right>
        </Header>
      ) : null}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
