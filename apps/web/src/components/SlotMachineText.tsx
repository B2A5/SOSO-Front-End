'use client';
import {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * SlotMachineText 컴포넌트의 props 인터페이스
 */
interface SlotMachineTextProps {
  /** 애니메이션 중 랜덤으로 표시할 텍스트 배열 */
  options: string[];
  /** 최종적으로 표시될 타겟 텍스트 (비동기로 설정될 수 있음) */
  targetText: string | null;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 슬롯머신 스타일의 텍스트 애니메이션 컴포넌트
 * 아래에서 위로 올라오는 애니메이션으로 랜덤 텍스트를 표시하다가
 * targetText가 설정되면 자연스럽게 해당 텍스트에서 멈추는 효과를 제공
 */
export function SlotMachineText({
  options,
  targetText,
  className = '',
}: SlotMachineTextProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationTextRef = useRef<string[]>([]);

  // 애니메이션용 텍스트 배열 생성
  const createAnimationTexts = useCallback(() => {
    // 기본 옵션들을 여러 번 반복
    const repeatedOptions = Array(15).fill(options).flat();

    // targetText가 있으면 마지막에 추가하고 애니메이션 종료 예정
    if (targetText) {
      return [...repeatedOptions, targetText];
    }

    // targetText가 없으면 무한 루프용 배열 (options만 반복)
    return repeatedOptions;
  }, [options, targetText]);

  /**
   * 이징 함수 - 처음에는 빠르게, targetText가 있으면 점점 느려지는 효과
   */
  const easeOut = useCallback(
    (t: number): number => {
      if (!targetText) return t; // targetText가 없으면 일정한 속도
      return 1 - Math.pow(1 - t, 2.5);
    },
    [targetText],
  );

  /**
   * 애니메이션 프레임 핸들러
   */
  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      // 애니메이션 시작 후 경과 시간 계산
      const elapsed = timestamp - startTimeRef.current;

      // targetText가 있으면 3초 후 종료, 없으면 무한 반복
      if (targetText && elapsed > 3000) {
        // 애니메이션 완료 - targetText 위치에서 중앙으로 이동
        const totalItems = animationTextRef.current.length;
        const finalOffset = (totalItems - 1) * 3; // 3rem per item

        // 중앙 정렬 애니메이션 (0.5초 동안)
        const centeringDuration = 500;
        const centeringStart = elapsed - 3000;

        if (centeringStart < centeringDuration) {
          // 현재 위치에서 중앙(0)으로 이동하는 애니메이션
          const centeringProgress =
            centeringStart / centeringDuration;
          const easedCenteringProgress =
            1 - Math.pow(1 - centeringProgress, 3);
          const currentCenterOffset =
            finalOffset * (1 - easedCenteringProgress);

          setCurrentOffset(currentCenterOffset);
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // 중앙 정렬 완료
          setCurrentOffset(0);
          setIsAnimating(false);
          setIsComplete(true);
        }

        return;
      }

      // 진행률 계산
      let progress;
      if (targetText) {
        progress = Math.min(elapsed / 3000, 1);
      } else {
        // 무한 반복 모드: 5초마다 한 사이클
        const cycleDuration = 5000;
        const cycleProgress =
          (elapsed % cycleDuration) / cycleDuration;
        progress = cycleProgress;
      }

      // 오프셋 계산
      const easedProgress = easeOut(progress);
      const totalItems = animationTextRef.current.length;

      let targetOffset;
      if (targetText) {
        // targetText가 있으면 마지막 아이템까지
        targetOffset = (totalItems - 1) * 3 * easedProgress;
      } else {
        // 무한 반복 모드: options만 순환
        const optionsCount = options.length;
        targetOffset =
          (optionsCount * 3 * easedProgress) % (totalItems * 3);
      }

      setCurrentOffset(targetOffset);
      animationRef.current = requestAnimationFrame(animate);
    },
    [easeOut, targetText, options.length],
  );

  /**
   * 애니메이션 시작/재시작
   */
  const startAnimation = useCallback(() => {
    // 이전 애니메이션 정리
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationTextRef.current = createAnimationTexts();
    setIsAnimating(true);
    setIsComplete(false);
    setCurrentOffset(0);
    startTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(animate);
  }, [createAnimationTexts, animate]);

  // targetText 변경될 때마다 바로 시작 (레이아웃 단계)
  useLayoutEffect(() => {
    startAnimation();
    return () => {
      if (animationRef.current)
        cancelAnimationFrame(animationRef.current);
    };
  }, [targetText, startAnimation]);

  const displayText =
    !isAnimating && isComplete && targetText ? targetText : '';

  return (
    <span
      className={twMerge(
        'inline-flex relative min-w-[8ch] text-center items-center',
        className,
      )}
      style={{
        overflow: 'hidden',
        clipPath: 'inset(0)',
      }}
    >
      {/* 마스킹 컨테이너 - 애니메이션 영역 제한 */}
      <span
        className="absolute inset-0 z-10 block"
        style={{
          overflow: 'hidden',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        }}
      >
        {/* 애니메이션용 텍스트 스택 */}
        {isAnimating && (
          <span
            className="flex flex-col items-center w-full"
            style={{
              transform: `translateY(calc(-${currentOffset}rem + 50%))`,
              transition: 'none',
              position: 'relative',
              top: '50%',
            }}
          >
            {animationTextRef.current.map((text, index) => (
              <span
                key={`${text}-${index}`}
                className="flex-shrink-0 h-12 flex items-center justify-center w-full text-gray-400" // h-12로 간격 증가
                style={{
                  filter: 'blur(0.5px)',
                }}
              >
                {text}
              </span>
            ))}
          </span>
        )}
      </span>

      {/* 최종 결과 텍스트 - 애니메이션 완전히 종료 후에만 표시 */}
      <span
        className={twMerge(
          'absolute inset-0 flex items-center justify-center z-20 transition-all duration-300',
          !isAnimating && isComplete ? 'opacity-100' : 'opacity-0',
          isComplete
            ? 'text-green-600 font-bold scale-105'
            : 'text-gray-400',
        )}
        style={{
          textShadow: isComplete
            ? '0 0 8px rgba(34, 197, 94, 0.2)'
            : 'none',
        }}
      >
        {displayText}
      </span>

      {/* )} */}

      {/* 공간 확보용 숨김 텍스트 */}
      <span
        className="opacity-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        {targetText || '••••••••'}
      </span>
    </span>
  );
}
