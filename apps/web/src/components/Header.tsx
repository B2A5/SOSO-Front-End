// 헤더 컴포넌트
// 좌측에 이전 페이지로 돌아가는 버튼 | 취소 버튼
// 중앙에 페이지 제목
// 우측에 검색 버튼(없을수도 있음)
'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/buttons/Button';

type LeftButtonType = 'back' | 'cancel';

interface HeaderProps {
  title: string; // 페이지 제목
  showSearch?: boolean; // 검색 버튼 표시 여부
  leftButtonType?: LeftButtonType; // 좌측 버튼 타입
}

export default function Header({
  title,
  showSearch = false,
  leftButtonType = 'back', // 기본값은 'back'
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="w-full flex justify-between items-center py-[6px] px-5">
      <div className="flex-1">
        {leftButtonType === 'back' && (
          <Button onClick={() => router.back()}>이전</Button>
        )}
        {leftButtonType === 'cancel' && (
          <Button onClick={() => router.back()}>취소</Button>
        )}
      </div>
      <h1 className="text-body1 font-bold text-center">{title}</h1>
      <div className="flex justify-end flex-1">
        {showSearch && <Button>검색</Button>}
      </div>
    </header>
  );
}
