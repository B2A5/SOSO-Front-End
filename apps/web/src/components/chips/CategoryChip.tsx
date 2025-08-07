import { Category, CATEGORIES } from '@/constants/categories';
import { twMerge } from 'tailwind-merge';

/**
 * 카테고리에 알맞는 칩 컴포넌트
 * - 각 카테고리마다 고유한 색상 제공
 */

// 카테고리별 색상 매핑
const CATEGORY_COLORS: Record<Category, string> = {
  'daily-hobby': 'bg-blue-100 text-blue-800',
  restaurant: 'bg-orange-100 text-orange-800',
  'living-convenience': 'bg-green-100 text-green-800',
  'neighborhood-news': 'bg-purple-100 text-purple-800',
  startup: 'bg-red-100 text-red-800',
  others: 'bg-gray-100 text-gray-800',
};

/**
 * 카테고리 값으로 라벨을 가져오는 유틸 함수
 */
export function getCategoryLabel(category: Category): string {
  const categoryItem = CATEGORIES.find(
    (item) => item.value === category,
  );
  return categoryItem?.label || category;
}

/**
 * 카테고리 값으로 색상 클래스를 가져오는 유틸 함수
 */
export function getCategoryColor(category: Category): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.others;
}

export function CategoryChip({ category }: { category: Category }) {
  return (
    <span
      className={twMerge(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getCategoryColor(category),
      )}
    >
      {getCategoryLabel(category)}
    </span>
  );
}
