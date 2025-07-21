'use client';
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';

/**
 * 탭 컴포넌트의 언더라인 스타일 타입
 */
interface UnderlineStyle {
  width?: number;
  left?: number;
}

/**
 * 탭 컴포넌트 Props 인터페이스
 */
export interface TabProps {
  /** 탭 목록 배열 */
  tabs?: string[];
  /** 현재 활성화된 탭 */
  activeTab?: string;
  /** 탭 변경 시 호출될 콜백 함수 */
  onTabChange?: (tab: string) => void;
  /** 추가 CSS 클래스명 */
  className?: string;
}

/**
 * 커뮤니티 탭 컴포넌트
 */
export function Tab({
  tabs = ['전체'],
  activeTab = '전체',
  onTabChange,
  className = '',
}: TabProps) {
  const [underlineStyle, setUnderlineStyle] =
    useState<UnderlineStyle>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>(
    {},
  );
  const containerRef = useRef<HTMLDivElement | null>(null);

  /**
   * 언더바 위치 업데이트 함수
   */
  const updateUnderlinePosition = useCallback(() => {
    const validActiveTab = tabs.includes(activeTab)
      ? activeTab
      : tabs[0];
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
  const handleTabClick = (tab: string): void => {
    onTabChange?.(tab);
  };

  /**
   * 탭 키보드 네비게이션 핸들러
   */
  const handleKeyDown = (
    event: React.KeyboardEvent,
    tab: string,
  ): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabClick(tab);
    }
  };

  return (
    <div
      className={`relative bg-white border-b border-gray-100 ${className}`}
    >
      {/* 탭 컨테이너 */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto tab-scrollbar-hide relative"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            ref={(element) => {
              tabRefs.current[tab] = element;
            }}
            onClick={() => handleTabClick(tab)}
            onKeyDown={(event) => handleKeyDown(event, tab)}
            className={`
              flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
              ${
                activeTab === tab
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }
            `}
            role="tab"
            tabIndex={activeTab === tab ? 0 : -1}
            aria-selected={activeTab === tab}
            aria-controls={`tabpanel-${tab}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 언더바 */}
      <div
        className={`
          absolute bottom-0 h-0.5 bg-gray-900 transition-all duration-300 ease-out
          ${!isInitialized ? 'opacity-0' : 'opacity-100'}
        `}
        style={underlineStyle}
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
