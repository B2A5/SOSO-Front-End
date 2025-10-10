import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * className 유틸리티 함수
 * clsx와 tailwind-merge를 조합하여 className을 안전하게 병합합니다.
 *
 * @example
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4' (tailwind-merge로 충돌 해결)
 * cn('text-red-500', { 'text-blue-500': true }) // 'text-blue-500'
 * cn('base-class', condition && 'conditional-class') // clsx 조건부 지원
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
