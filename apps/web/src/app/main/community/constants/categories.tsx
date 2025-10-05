import {
  Coffee,
  Utensils,
  Dumbbell,
  CakeSlice,
  Guitar,
  Palette,
} from 'lucide-react';
import type { GetPostsByCursorCategory } from '@/generated/api/models';
import type { TabItem } from '@/types/tab.types';

/**
 * 카테고리 타입
 *
 * @description
 * API의 GetPostsByCursorCategory 타입을 사용합니다.
 * 'all' 타입은 없으며, '전체' 선택 시 null 값을 사용합니다.
 */
export type Category = GetPostsByCursorCategory;

/**
 * 카테고리 탭 아이템 타입
 *
 * @description
 * TabItem<Category>의 별칭으로, 가독성을 위해 제공됩니다.
 */
export type CategoryTabItem = TabItem<Category>;

/**
 * 카테고리 상세 정보 (아이콘, 색상 포함)
 */
export interface CategoryContent {
  label: string;
  icon: React.ReactNode;
  color: string;
}

/**
 * 카테고리 목록
 *
 * @description
 * '전체' 카테고리는 포함되지 않습니다.
 * PillChipsTab 컴포넌트의 showAll 옵션을 사용하세요.
 */
export const CATEGORIES: TabItem<Category>[] = [
  { label: '일상/취미', value: 'daily-hobby' },
  { label: '맛집', value: 'restaurant' },
  { label: '생활/꿀팁', value: 'living-convenience' },
  { label: '동네소식', value: 'neighborhood-news' },
  { label: '창업', value: 'startup' },
  { label: '기타', value: 'others' },
];

/**
 * 카테고리 상세 정보 (아이콘, 색상 포함)
 *
 * @description
 * CategoryBadge 에서 사용됩니다.
 */
export const CATEGORY_DETAILS: Record<Category, CategoryContent> = {
  'daily-hobby': {
    label: '일상/취미',
    icon: <Coffee />,
    color: 'bg-yellow-100',
  },
  restaurant: {
    label: '맛집',
    icon: <Utensils />,
    color: 'bg-red-100',
  },
  'living-convenience': {
    label: '생활/꿀팁',
    icon: <CakeSlice />,
    color: 'bg-pink-100',
  },
  'neighborhood-news': {
    label: '동네소식',
    icon: <Dumbbell />,
    color: 'bg-green-100',
  },
  startup: {
    label: '창업',
    icon: <Palette />,
    color: 'bg-blue-100',
  },
  others: {
    label: '기타',
    icon: <Guitar />,
    color: 'bg-purple-100',
  },
};

/**
 * 카테고리 value로 상세 정보 조회
 */
export function getCategoryDetails(
  category: Category,
): CategoryContent {
  return CATEGORY_DETAILS[category];
}

/**
 * 카테고리 value로 라벨 조회
 */
export function getCategoryLabel(category: Category): string {
  return CATEGORY_DETAILS[category].label;
}
