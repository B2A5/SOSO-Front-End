import React from 'react';
import { Button } from '@/components/buttons/Button';
import { twMerge } from 'tailwind-merge';

// 콘텐츠 버튼 컴포넌트
// 선택된 콘텐츠를 표시하고 클릭 시 onClick 콜백 호출
// 선택된 상태에 따라 스타일이 변경됨
interface ContentButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void; // 클릭 시 호출되는 함수 (해당 라벨의 value를 전달)
}

function ContentButton({
  label,
  selected,
  onClick,
}: ContentButtonProps) {
  // 선택된 상태에 따라 클래스 변경
  const SelectClass = selected
    ? 'bg-soso-500 ring-soso-500 text-bold text-white'
    : 'border-neutral-300 text-fontColor-gray2 ';

  return (
    <Button
      size="md"
      variant={'outlined'}
      className={twMerge(SelectClass, 'w-min')}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

export default React.memo(ContentButton); // 동일 프롭은 재랜더 안함
