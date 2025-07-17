// 카테고리 목록을 정의한 상수 배열
// - value: 쿼리스트링 또는 내부 로직에서 사용할 영문 식별자
// - label: 사용자 UI에 표시될 한글 라벨
// - as const: 배열 요소의 타입을 리터럴로 고정하여 타입 추출 가능하게 함
export const CATEGORY_LIST = [
  { value: 'daily-hobby', label: '일상/취미' },
  { value: 'restaurants', label: '맛집' },
  { value: 'living-convenience', label: '생활/꿀팁' },
  { value: 'neighborhood-news', label: '동네소식' },
  { value: 'startup', label: '창업' },
  { value: 'others', label: '기타' },
] as const;

// CATEGORY_LIST의 value 필드들만 뽑아 유니언 타입으로 구성
// => 'daily-hobby' | 'restaurants' | 'living-convenience' | ...
// 타입 안정성을 높이고, 오타를 방지하며 자동 완성 지원
export type CategoryValue = (typeof CATEGORY_LIST)[number]['value'];
