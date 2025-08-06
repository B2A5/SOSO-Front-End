// 헤더 컴포넌트
// 좌측에 이전 페이지로 돌아가는 버튼 | 취소 버튼
// 중앙에 페이지 제목
// 우측에 검색 버튼(없을수도 있음)
'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/buttons/Button';
import { Search, ChevronLeft, EllipsisVertical } from 'lucide-react';

type LeftButtonType = 'back' | 'cancel';
type RightButtonType = 'search' | 'none' | 'menu';

interface HeaderProps {
  title: string; // 페이지 제목
  leftButtonType?: LeftButtonType; // 좌측 버튼 타입
  rightButtonType?: RightButtonType; // 우측 버튼 타입
  onRightButtonClick?: () => void; // 우측 버튼 클릭 핸들러
}

export default function Header({
  title,
  leftButtonType = 'back', // 기본값은 'back'
  rightButtonType = 'none', // 기본값은 'none'
  onRightButtonClick,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="w-full flex justify-between items-center py-[6px] px-5 border-b border-neutral-100 dark:border-neutral-800 bg-transparent">
      <div className="flex-1">
        {leftButtonType === 'back' && (
          <Button variant="ghost" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        {leftButtonType === 'cancel' && (
          <Button variant="ghost" onClick={() => router.back()}>
            취소
          </Button>
        )}
      </div>
      <h1 className="text-body1 font-bold text-center dark:text-fontColor-gray1">
        {title}
      </h1>
      <div className="flex justify-end flex-1">
        {rightButtonType === 'search' && (
          <Button variant="ghost" onClick={onRightButtonClick}>
            <Search className="w-5 h-5" />
          </Button>
        )}
        {rightButtonType === 'menu' && (
          <Button variant="ghost" onClick={onRightButtonClick}>
            <EllipsisVertical className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
