'use client';

import { useTap } from '@/hooks/ui/useTap';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

/**
 * 플로팅 메뉴 버튼 컴포넌트
 * @param value - 버튼의 값
 * @param label - 버튼의 레이블
 * @param onClick - 클릭 이벤트 핸들러
 */

/*  AsideButton 컴포넌트의 props 정의 */
export interface AsideButtonProps {
  value: string;
  label: string;
  onClick?: (value: string) => void;
}

/* AsideButton 컴포넌트의 목업 데이터 */
export const mockAsideButtonData: AsideButtonProps[] = [
  { value: 'button-1', label: '버튼 1' },
  { value: 'button-2', label: '버튼 2' },
  { value: 'button-3', label: '버튼 3' },
  { value: 'button-4', label: '버튼 4' },
  { value: 'button-5', label: '버튼 5' },
  { value: 'button-6', label: '버튼 6' },
];

/*  클릭 이벤트 핸들러 */
export const handleButtonClick = (
  value: string,
  router: ReturnType<typeof useRouter>,
) => {
  console.log(`Button clicked: ${value}`);
  router.push(`/write?type=${value}`);
};

/* AsideButton 컴포넌트 정의 */
export default function AsideButton({
  value,
  label,
  onClick,
}: AsideButtonProps) {
  const [pressed, bind] = useTap();
  const router = useRouter();

  const className = twMerge(`
    w-25 h-12 px-4 text-body rounded-3xl transition-colors duration-150 ease-in-out
    border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-soso-500
    hover:bg-soso-0 hover:text-soso-600
    focus-visible:bg-soso-0 focus-visible:text-soso-600
    ${pressed ? 'bg-soso-0 text-soso-600' : 'bg-white text-fontColor-gray3'}
  `);

  return (
    <button
      role="menuitem"
      {...bind}
      className={className}
      value={value}
      onClick={() =>
        onClick ? onClick(value) : handleButtonClick(value, router)
      }
    >
      {label}
    </button>
  );
}
