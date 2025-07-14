// src/components/ui/Card.tsx
'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTap } from '@/hooks/ui/useTap';

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...rest }, ref) => {
    const [pressed, bind] = useTap();

    const classes = twMerge(
      'bg-white p-4 rounded-xl shadow transition-transform duration-150 ease-out',
      pressed ? 'scale-95' : 'scale-100',
      className,
    );

    return (
      <div
        ref={ref}
        className={classes}
        data-pressed={pressed || undefined}
        {...bind}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
