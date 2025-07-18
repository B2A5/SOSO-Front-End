// RandomTextSpan.tsx
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
  duration = 2000,
  speed = 100,
}: RandomTextSpanProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    // 타겟 텍스트가 아닌 다른 옵션으로 시작
    const idx = options.findIndex((opt) => opt === targetText);
    return idx === 0 ? 1 : 0;
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<string>(targetText);

  // targetText 변경 시 ref 업데이트
  useEffect(() => {
    targetRef.current = targetText;
  }, [targetText]);

  /**
   * 애니메이션 시작
   */
  const startAnimation = () => {
    setIsVisible(true);
    setIsAnimating(true);
    setIsComplete(false);

    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const targetIdx = options.findIndex(
        (opt) => opt === targetRef.current,
      );

      // duration 경과 후 targetText가 옵션에 있으면 멈춤
      if (elapsed >= duration && targetIdx !== -1) {
        setCurrentIndex(targetIdx);
        setIsAnimating(false);
        setIsComplete(true);
        return;
      }

      // 회전: 경과에 따라 속도 감소
      const currentSpeed = speed + progress * speed * 2;
      setCurrentIndex((prev) => (prev + 1) % options.length);
      timeoutRef.current = setTimeout(animate, currentSpeed);
    };

    animate();
  };

  // 마운트 또는 targetText 변경 시 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(startAnimation, 500);
    return () => {
      clearTimeout(timer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [targetText]);

  // 초기 렌더 시 공간 확보용 투명 텍스트
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
