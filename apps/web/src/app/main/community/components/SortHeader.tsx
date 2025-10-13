import SelectDropdown from '@/components/dropdown/SelectDropdown';
import { twMerge } from 'tailwind-merge';
import { SortOption, SortValue } from '@/types/options.types';
/**
 * 게시글 정렬 헤더 컴포넌트
 * - 게시글 목록 상단에 정렬 옵션을 제공
 */

interface SortHeaderProps {
  className?: string;
  totalCount?: number;
  sortOptions: SortOption[];
  currentValue: SortValue | null;
  onFilterChange: (filter: SortValue) => void;
}

export function SortHeader({
  className,
  totalCount,
  sortOptions,
  currentValue,
  onFilterChange,
}: SortHeaderProps) {
  return (
    <header
      className={twMerge(
        'flex items-center justify-between p-4',
        className,
      )}
      aria-label="정렬 옵션"
    >
      <p className="text-body2 dark:text-white">
        총 {totalCount}개 게시글
      </p>

      <SelectDropdown
        options={sortOptions}
        value={currentValue}
        onChange={onFilterChange}
      />
    </header>
  );
}
