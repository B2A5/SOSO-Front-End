/**
 * 드롭다운에서 선택할 수 있는 정렬 옵션의 타입 정의
 *
 */
export type SortValue = 'LATEST' | 'LIKE' | 'COMMENT' | 'VIEW';
export interface SortOption {
  label: string;
  value: SortValue;
}
