import SelectDropdown from '@/components/dropdown/SelectDropdown';
import { twMerge } from 'tailwind-merge';

interface FilterHeaderProps {
  className?: string;
  totalCount?: number;
  onFilterChange?: (filter: string) => void;
}

export function FilterHeader({
  className,
  totalCount,
  onFilterChange,
}: FilterHeaderProps) {
  return (
    <div
      className={twMerge(
        'flex items-center justify-between p-4',
        className,
      )}
    >
      <p>총 {totalCount}개 게시글</p>
      <SelectDropdown className="ml-4" onChange={onFilterChange} />
    </div>
  );
}
