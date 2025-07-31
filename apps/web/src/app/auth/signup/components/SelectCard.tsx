import { Card } from '@/components/Card';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

/**
 * 사용자 타입 선택 카드 컴포넌트
 * 선택되었을때 border가 강조되는 카드 형태
 *
 */

interface SelectCardProps {
  title: string; // 카드 제목
  description: string; // 카드 설명
  onClick: () => void; // 카드 클릭 핸들러
  isSelected?: boolean; // 카드 선택 여부
  imageUrl: string; // 카드에 표시할 이미지 URL
}

export function SelectCard({
  title,
  description,
  onClick,
  isSelected = false,
  imageUrl,
}: SelectCardProps) {
  return (
    <Card
      className={twMerge(
        'w-full max-w-md flex gap-4 items-center p-10 cursor-pointer dark:bg-neutral-900',
        isSelected
          ? 'border-2 border-soso-700 dark:text-white'
          : 'text-fontColor-gray1 dark:text-fontColor-gray2',
      )}
      onClick={onClick}
    >
      <div className="relative size-20 bg-gray-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center">
        <Image src={imageUrl} alt={title} fill />
      </div>
      <div className="flex flex-col gap-2 ">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p
          className={twMerge(
            'text-sm',
            isSelected
              ? 'text-fontColor-gray3 dark:text-fontColor-gray1'
              : 'text-fontColor-gray1 dark:text-fontColor-gray2',
          )}
        >
          {description}
        </p>
      </div>
    </Card>
  );
}
