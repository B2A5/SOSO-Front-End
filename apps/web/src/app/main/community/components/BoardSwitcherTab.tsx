import { UnderlineTab } from '@/components/tabs/UnderlineTab';
import { TabItem, CommunityTabValue } from '@/types/tab.types';
import { useRouter } from 'next/navigation';

/**
 * 커뮤니티 게시판 전환 탭
 *
 * @description
 * 투표 게시판과 자유 게시판 간 전환을 위한 상위 탭 컴포넌트
 *
 * @example
 * ```tsx
 * <BoardSwitcher current="votesboard" />
 * ```
 */

const BOARDS: TabItem<CommunityTabValue>[] = [
  { label: '투표 게시판', value: 'votesboard' },
  { label: '자유 게시판', value: 'freeboard' },
];

interface BoardSwitcherTabProps {
  current: CommunityTabValue;
}

export function BoardSwitcherTab({ current }: BoardSwitcherTabProps) {
  const router = useRouter();

  const handleTabChange = (value: CommunityTabValue) => {
    router.push(`/main/community/${value}`);
  };

  return (
    <UnderlineTab<CommunityTabValue>
      tabs={BOARDS}
      activeTab={current}
      onTabChange={handleTabChange}
    />
  );
}
