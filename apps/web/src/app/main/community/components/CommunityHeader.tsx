'use client';
import { Button } from '@/components/buttons/Button';
import { Search } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Tab } from '@/components/tabs/Tab';
import { TabItem } from '@/types/tab.types';
import { useRouter, usePathname, useParams } from 'next/navigation';
import { useOverlay } from '@/hooks/ui/useOverlay';
import Header from '@/components/Header';

/**
 * 커뮤니티 페이지에 따른 동적 헤더를 제공합니다.
 * - 메인 페이지에서는 탭과 검색 버튼을 표시
 * - post 페이지에서는 이전 버튼만 표시
 * - view 페이지에서는 이전 버튼과 메뉴 버튼을 표시
 */
export const TAB_LIST: TabItem[] = [
  { title: '튜표 게시판', value: 'votesboard' },
  { title: '자유 게시판', value: 'freeboard' },
];

interface CommunityHeaderProps {
  onRightButtonClick?: () => void; // 우측 버튼 클릭 핸들러
  className?: string;
}
export function CommunityHeader({
  className = '',
  onRightButtonClick,
}: CommunityHeaderProps) {
  const router = useRouter();
  const { openOverlay } = useOverlay();
  const pathname = usePathname() || '';
  const params = useParams();

  // URL 세그먼트에서 현재 탭 value 추출 (defaults to first)
  const currentTab =
    TAB_LIST.find((tab) => pathname.endsWith(`/${tab.value}`))
      ?.value || TAB_LIST[0].value;

  // 탭 클릭 시 해당 value 경로로 이동
  const handleTabChange = (value: TabItem['value']) => {
    router.push(`/main/community/${value}`);
  };

  const handleSearchClick = () => {
    openOverlay(<div>Search Overlay</div>);
  };

  // 경로에 따른 헤더 타입 결정
  const getHeaderType = () => {
    if (pathname.includes('/post')) {
      return 'post';
    }
    if (pathname.includes('/view')) {
      return 'view';
    }
    return 'main';
  };

  // 탭에 따른 제목 가져오기
  const getTabTitle = (tab: string) => {
    const tabItem = TAB_LIST.find((item) => item.value === tab);
    return tabItem?.title || '커뮤니티';
  };

  const headerType = getHeaderType();
  const tabTitle = getTabTitle(params.tab as string);

  // 경로에 따른 동적 헤더 렌더링
  if (headerType === 'post') {
    return (
      <Header
        title={`${tabTitle.substring(0, 2)} 글 작성`}
        leftButtonType="cancel"
      />
    );
  }

  if (headerType === 'view') {
    return (
      <Header
        title={tabTitle}
        leftButtonType="back"
        rightButtonType="menu"
        onRightButtonClick={onRightButtonClick}
      />
    );
  }

  // 메인 페이지 - 기존 탭 헤더
  return (
    <div
      className={twMerge(
        'flex items-center justify-between w-full h-[50px] px-5 py-4 bg-transparent ',
        className,
      )}
    >
      <Tab
        tabs={TAB_LIST}
        activeTab={currentTab}
        onTabChange={handleTabChange}
      />

      <Button
        variant="ghost"
        className="px-0"
        onClick={handleSearchClick}
      >
        <Search className="h-5" />
      </Button>
    </div>
  );
}
