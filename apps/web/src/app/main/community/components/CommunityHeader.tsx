'use client';
import { Button } from '@/components/buttons/Button';
import { Search } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Tab } from '@/components/tabs/Tab';
import { TabItem } from '@/types/tab.types';
import { useRouter, usePathname } from 'next/navigation';
import { useOverlay } from '@/hooks/ui/useOverlay';

export const TAB_LIST: TabItem[] = [
  { title: '튜표 게시판', value: 'votesboard' },
  { title: '자유 게시판', value: 'freeboard' },
];

interface CommunityHeaderProps {
  className?: string;
}
export function CommunityHeader({
  className = '',
}: CommunityHeaderProps) {
  const router = useRouter();
  const { openOverlay } = useOverlay();
  const pathname = usePathname() || '';

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
