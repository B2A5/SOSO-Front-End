// src/components/ui/Pressable.tsx
'use client';
import React, { ElementType, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useTap } from '@/hooks/ui/useTap';

/**
 * Pressable: 누를 때 스케일 애니메이션이 적용되는 범용 래퍼 컴포넌트
 * @param as 렌더링할 요소 타입 (기본 'div')
 * @param className 추가 클래스
 * @param children 자식 노드
 * @param rest 기타 HTML 속성
 */
interface PressableProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export const Pressable = forwardRef<HTMLElement, PressableProps>(
  ({ as: Component = 'div', className, children, ...rest }, ref) => {
    const [pressed, bind] = useTap();
    const classList = twMerge(
      'inline-block transition-transform duration-150 ease-out',
      pressed ? 'scale-95' : 'scale-100',
      className,
    );

    return (
      <Component ref={ref} className={classList} {...bind} {...rest}>
        {children}
      </Component>
    );
  },
);

Pressable.displayName = 'Pressable';
export default Pressable;
