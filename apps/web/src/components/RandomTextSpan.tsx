'use client';
import { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * RandomTextSpan 컴포넌트의 props 인터페이스
 */
interface RandomTextSpanProps {
  options: string[];
  targetText: string;
  className?: string;
  duration?: number;
  speed?: number;
}

/**
 * 슬롯머신 스타일의 텍스트 애니메이션 컴포넌트
 */
export function RandomTextSpan({
  options,
  targetText,
  className = '',
  duration = 2500,
  speed = 100,
}: RandomTextSpanProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    // 타겟 텍스트가 아닌 다른 옵션으로 시작
    const targetIndex = options.findIndex(
      (option) => option === targetText,
    );
    return targetIndex === 0 ? 1 : 0;
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 애니메이션 시작
   */
  const startAnimation = () => {
    setIsVisible(true);
    setIsAnimating(true);
    setIsComplete(false);

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        // 점진적으로 속도 감소
        const currentSpeed = speed + progress * speed * 2;

        setCurrentIndex((prev) => (prev + 1) % options.length);
        timeoutRef.current = setTimeout(animate, currentSpeed);
      } else {
        // 타겟 텍스트로 완료
        const targetIndex = options.findIndex(
          (option) => option === targetText,
        );
        if (targetIndex !== -1) {
          setCurrentIndex(targetIndex);
        }
        setIsAnimating(false);
        setIsComplete(true);
      }
    };

    animate();
  };

  useEffect(() => {
    const timer = setTimeout(startAnimation, 500);

    return () => {
      clearTimeout(timer);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 초기에는 보이지 않음
  if (!isVisible) {
    return (
      <span
        className={`inline-block min-w-[10ch] text-center ${className}`}
      >
        <span className="opacity-0">{targetText}</span>
      </span>
    );
  }

  const currentText = options[currentIndex];

  return (
    <span
      className={`inline-block min-w-[10ch] text-center ${className}`}
    >
      <span
        className={twMerge(
          'transition-all duration-200 ease-out',
          isAnimating ? 'text-soso-400 scale-95' : '',
          isComplete ? 'text-soso-600 font-bold scale-105' : '',
        )}
        style={{
          filter: isAnimating ? 'blur(1px)' : 'none',
          textShadow: isComplete
            ? '0 0 8px rgba(34, 197, 94, 0.2)'
            : 'none',
        }}
      >
        {currentText}
      </span>
    </span>
  );
}
