import { twMerge } from 'tailwind-merge';
import {
  Category,
  CATEGORY_LIST,
  CategoryContent,
} from '@/constants/categorys';
interface CategoryBadgeProps {
  category: Category;
}

/**
 * 카테고리 배지 컴포넌트
 * 주어진 카테고리에 따라 배지와 아이콘을 표시
 */

export function CategoryBadge({ category }: CategoryBadgeProps) {
  if (!CATEGORY_LIST[category]) {
    return null; // 카테고리가 정의되지 않은 경우 null 반환
  }
  const { color, label, icon } = CATEGORY_LIST[
    category
  ] as CategoryContent;

  return (
    <div className="flex items-center gap-2">
      <span
        className={twMerge(
          'px-2 py-1 text-xs bg-gray-200 rounded-full',
          color,
        )}
      >
        {label}
      </span>
      {icon && <span className="text-gray-500">{icon}</span>}
    </div>
  );
}
