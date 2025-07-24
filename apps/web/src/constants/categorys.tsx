import {
  Coffee,
  Utensils,
  Dumbbell,
  CakeSlice,
  Guitar,
  Palette,
} from 'lucide-react';

export type Category =
  | 'daily-hobby'
  | 'restaurant'
  | 'living-convenience'
  | 'neighborhood-news'
  | 'startup'
  | 'others';

export interface CategoryContent {
  label: string;
  icon: React.ReactNode;
  color: string;
}

export const CATEGORY_LIST: Record<Category, CategoryContent> = {
  'daily-hobby': {
    label: '일상 취미',
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
