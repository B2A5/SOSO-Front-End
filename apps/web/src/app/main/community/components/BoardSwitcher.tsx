import { Tab } from '@/components/tabs/Tab';
import { TabItem, TabValue } from '@/types/tab.types';
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

const BOARDS: TabItem[] = [
  { title: '투표 게시판', value: 'votesboard' },
  { title: '자유 게시판', value: 'freeboard' },
];

interface BoardSwitcherProps {
  current: TabValue;
}

export function BoardSwitcher({ current }: BoardSwitcherProps) {
  const router = useRouter();

  const handleTabChange = (value: TabValue) => {
    router.push(`/main/community/${value}`);
  };

  return (
    <Tab
      tabs={BOARDS}
      activeTab={current}
      onTabChange={handleTabChange}
    />
  );
}
