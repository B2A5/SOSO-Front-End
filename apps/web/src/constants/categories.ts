export type Category =
  | 'all'
  | 'daily-hobby'
  | 'restaurant'
  | 'living-convenience'
  | 'neighborhood-news'
  | 'startup'
  | 'others';
export interface Categories {
  value: Category;
  label: string;
}
export const CATEGORIES: Categories[] = [
  { value: 'daily-hobby', label: '일상/취미' },
  { value: 'restaurant', label: '맛집' },
  { value: 'living-convenience', label: '생활/꿀팁' },
  { value: 'neighborhood-news', label: '동네소식' },
  { value: 'startup', label: '창업' },
  { value: 'others', label: '기타' },
];
