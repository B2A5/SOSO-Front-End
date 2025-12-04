import { Select } from '@/components/select/Select';
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
      <p className="text-body2 text-neutral-800 dark:text-white">
        총 {totalCount}개 게시글
      </p>

      <Select
        value={currentValue ?? undefined}
        onValueChange={(value) => onFilterChange(value as SortValue)}
        size="sm"
      >
        <Select.Trigger
          className="border-none text-neutral-800 dark:text-white justify-end text-sm"
          placeholder="정렬 선택"
        />
        <Select.Portal>
          <Select.Content>
            {sortOptions.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Portal>
      </Select>
    </header>
  );
}
