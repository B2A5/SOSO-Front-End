'use client';
import React, { createContext, useContext, useRef } from 'react';

// CommunityLayout의 overflow-y-auto div ref를 하위 컴포넌트에 제공하는 Context
const ScrollContainerContext =
  createContext<React.RefObject<HTMLDivElement> | null>(null);

/** 커뮤니티 스크롤 컨테이너 ref를 읽는 훅 */
export function useScrollContainerRef() {
  return useContext(ScrollContainerContext);
}

/** CommunityLayout의 overflow-y-auto div를 감싸는 클라이언트 컴포넌트 */
export function CommunityScrollContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <ScrollContainerContext.Provider value={ref}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </ScrollContainerContext.Provider>
  );
}
