'use client';
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { TabItem } from '@/types/tab.types';

/**
 * 탭 컴포넌트의 언더라인 스타일 타입
 */
interface UnderlineStyle {
  width?: number;
  left?: number;
}

/**
 * 언더라인 탭 컴포넌트 Props 인터페이스
 */
export interface UnderlineTabProps<T> {
  /** 탭 목록 배열 */
  tabs: TabItem<T>[];
  /** 현재 활성화된 탭 */
  activeTab?: TabItem<T>['value'];
  /** 탭 변경 시 호출될 콜백 함수 */
  onTabChange?: (tab: TabItem<T>['value']) => void;
  /** 추가 CSS 클래스명 */
  className?: string;
}

/**
 * 언더라인 애니메이션이 있는 탭 컴포넌트
 *
 * @template T - 탭 value 타입 (string을 확장해야 함)
 */
export function UnderlineTab<T extends string = string>({
  tabs,
  activeTab = tabs?.[0]?.value,
  onTabChange,
  className = '',
}: UnderlineTabProps<T>) {
  const [underlineStyle, setUnderlineStyle] =
    useState<UnderlineStyle>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>(
    {},
  );
  const containerRef = useRef<HTMLDivElement | null>(null);

  /**
   * 언더바 위치 업데이트 함수
   */
  const updateUnderlinePosition = useCallback(() => {
    const validActiveTab = tabs.find((tab) => tab.value === activeTab)
      ? activeTab
      : tabs[0].value;
    const activeTabElement = tabRefs.current[validActiveTab];

    if (activeTabElement && containerRef.current) {
      const containerRect =
        containerRef.current.getBoundingClientRect();
      const tabRect = activeTabElement.getBoundingClientRect();

      setUnderlineStyle({
        width: tabRect.width,
        left:
          tabRect.left -
          containerRect.left +
          containerRef.current.scrollLeft,
      });

      if (!isInitialized) {
        setIsInitialized(true);
      }
    }
  }, [activeTab, tabs, isInitialized]);

  /**
   * 언더바 위치 업데이트 (의존성: activeTab, tabs 변경 시)
   */
  useEffect(() => {
    // DOM이 렌더링된 후 실행하기 위해 requestAnimationFrame 사용
    const timeoutId = requestAnimationFrame(updateUnderlinePosition);
    return () => cancelAnimationFrame(timeoutId);
  }, [updateUnderlinePosition]);

  /**
   * 윈도우 리사이즈 시 언더바 위치 재계산
   */
  useEffect(() => {
    const handleResize = () => updateUnderlinePosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateUnderlinePosition]);

  /**
   * 탭 클릭 핸들러
   */
  const handleTabClick = (tab: T): void => {
    onTabChange?.(tab);
  };

  /**
   * 탭 키보드 네비게이션 핸들러
   */
  const handleKeyDown = (
    event: React.KeyboardEvent,
    tab: T,
  ): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabClick(tab);
    }
  };

  return (
    <div className={`relative bg-transparent  ${className}`}>
      {/* 탭 컨테이너 */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto tab-scrollbar-hide relative"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            ref={(element) => {
              tabRefs.current[tab.value] = element;
            }}
            onClick={() => handleTabClick(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, tab.value)}
            className={`
              flex-shrink-0 px-4 py-3 text-md font-bold transition-colors duration-200 whitespace-nowrap
             
              ${
                activeTab === tab.value
                  ? 'text-gray-900 dark:text-neutral-100'
                  : 'text-gray-500 hover:text-gray-700 dark:text-neutral-500 dark:hover:text-gray-300'
              }
            `}
            role="tab"
            tabIndex={activeTab === tab.value ? 0 : -1}
            aria-selected={activeTab === tab.value}
            aria-controls={`tabpanel-${tab.value}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 언더바 */}
      <div
        className={twMerge(
          'absolute bottom-0 h-0.5 bg-soso-600 transition-all duration-300 ease-out',
          !isInitialized ? 'opacity-0' : 'opacity-100',
        )}
        style={{
          width: underlineStyle.width
            ? `${underlineStyle.width}px`
            : 0,
          left: underlineStyle.left ? `${underlineStyle.left}px` : 0,
        }}
        aria-hidden="true"
      />

      {/* 스타일 정의 */}
      <style jsx>{`
        .tab-scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .tab-scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
