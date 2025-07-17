import React from 'react';
import { Button } from '@/components/buttons/Button';
import { twMerge } from 'tailwind-merge';

interface ContentButtonProps {
  content: string;
  selected: boolean;
  onClick: (item: string) => void; // 클릭 시 아이템을 전달하는 함수
}

export default function ContentButton({
  content,
  selected,
  onClick,
}: ContentButtonProps) {
  // 선택된 상태에 따라 클래스 변경
  const SelectClass = selected
    ? 'ring-soso-500 text-bold'
    : 'border-neutral-300 text-fontColor-gray2 ';

  return (
    <Button
      size="md"
      variant={'outlined'}
      className={twMerge(SelectClass, 'w-min')}
      onClick={() => onClick(content)}
    >
      {content}
    </Button>
  );
}
