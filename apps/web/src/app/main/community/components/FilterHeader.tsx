import SelectDropdown from '@/components/dropdown/SelectDropdown';
import { twMerge } from 'tailwind-merge';
import { SortOption, SortValue } from '@/types/options.types';
/**
 * 필터 헤더 컴포넌트
 * - 게시글 목록 상단에 필터링 옵션을 제공
 */

interface FilterHeaderProps {
  className?: string;
  totalCount?: number;
  options: SortOption[];
  filterValue: SortValue | null;
  onFilterChange: (filter: SortValue) => void;
}

export function FilterHeader({
  className,
  totalCount,
  options,
  filterValue,
  onFilterChange,
}: FilterHeaderProps) {
  return (
    <div
      className={twMerge(
        'flex items-center justify-between p-4',
        className,
      )}
    >
      <p className="text-body2 dark:text-white">
        총 {totalCount}개 게시글
      </p>

      <SelectDropdown
        options={options}
        value={filterValue}
        onChange={onFilterChange}
      />
    </div>
  );
}
