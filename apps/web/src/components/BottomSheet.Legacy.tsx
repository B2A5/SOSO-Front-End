'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useOverlay } from '@/hooks/ui/useOverlay';
import Pressable from './Pressable';

/**
 * 바텀시트 메뉴의 개별 액션을 정의하는 인터페이스
 */
export interface MenuAction {
  /** 메뉴 항목에 표시될 텍스트 */
  label: string;
  /** 메뉴 항목 클릭 시 실행될 함수 */
  onClick: () => void;
  /** 위험한 액션인지 여부 (삭제, 신고 등). true일 경우 빨간색으로 표시 */
  destructive?: boolean;
}

/**
 * BottomSheetMenu 컴포넌트의 Props 타입 정의
 */
export interface BottomSheetMenuProps {
  /** 바텀시트 표시 여부 */
  isOpen: boolean;
  /** 바텀시트에 표시될 메뉴 액션들의 배열 */
  actions: MenuAction[];
  /** 바텀시트 상단에 표시될 제목 (선택사항) */
  title?: string;
  /** 추가 CSS 클래스명 (선택사항) */
  className?: string;
}

/**
 * 상황에 맞는 메뉴를 바텀에서 슬라이드업으로 보여주는 바텀시트 컴포넌트
 *
 * @features
 * - Props 기반의 유연한 메뉴 구성
 * - useOverlay 훅과 연동하여 오버레이 관리
 * - Destructive 액션에 대한 시각적 구분 (빨간색)
 * - 부드러운 슬라이드 애니메이션 효과
 * - 고정된 닫기 버튼 제공
 *
 * @example
 * ```tsx
 * const actions = [
 *   { label: '수정하기', onClick: handleEdit },
 *   { label: '삭제하기', onClick: handleDelete, destructive: true }
 * ];
 *
 * <BottomSheetMenu
 *   isOpen={isOpen}
 *   actions={actions}
 *   title="게시글 관리"
 * />
 * ```
 */
export default function BottomSheetMenu({
  isOpen,
  actions,
  title,
  className,
}: BottomSheetMenuProps) {
  // useOverlay 훅에서 오버레이 닫기 함수 가져오기
  const { closeOverlay } = useOverlay();

  // 바텀시트가 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div
      className={twMerge(
        // 기본 포지셔닝: 화면 하단에 고정
        'fixed bottom-0 left-0 right-0 z-bottom-sheet px-5 py-4 flex flex-col gap-4',
        // 배경 및 테두리: 흰색 배경, 상단 모서리 둥글게, 그림자 효과
        ' bg-white rounded-t-2xl  shadow-2xl',
        // 애니메이션: 부드러운 슬라이드업 효과
        ' transform transition-transform duration-300 ease-out',
        // 표시 상태에 따른 위치 조정
        isOpen ? 'translate-y-0' : 'translate-y-full',
        // 외부에서 전달받은 추가 클래스명
        className,
      )}
    >
      {/* 바텀시트 제목 영역 (선택사항) */}
      {title && (
        <div className="px-6 py-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </div>
      )}

      {/* 메뉴 액션들을 담는 컨테이너 */}
      <div className="border border-neutral-0 rounded-2xl flex flex-col gap-1 p-1">
        {actions.map((action, index) => (
          // Pressable 컴포넌트로 터치 피드백 제공
          <Pressable key={`action-${index}`}>
            <button
              onClick={() => {
                // 메뉴 액션 실행
                action.onClick();
                // 바텀시트 닫기
                closeOverlay();
              }}
              className={twMerge(
                // 기본 버튼 스타일: 전체 너비, 중앙 정렬, 패딩, 둥근 모서리
                'w-full flex items-center justify-center px-4 py-4 rounded-2xl transition-colors duration-200',
                // 기본 호버/액티브 상태
                'hover:bg-gray-50 active:bg-gray-100',
                // 위험한 액션의 경우 빨간색으로 표시
                action.destructive
                  ? 'text-red-600 hover:bg-red-50 active:bg-red-100'
                  : 'text-gray-900',
              )}
            >
              {/* 메뉴 항목 텍스트 */}
              <span className="font-medium">{action.label}</span>
            </button>
          </Pressable>
        ))}
      </div>

      {/* 바텀시트를 닫는 전용 버튼 - 항상 하단에 고정 */}
      <div className=" pt-2">
        <button
          onClick={closeOverlay}
          className="w-full flex items-center justify-center px-4 py-3  hover:bg-gray-50 active:bg-gray-100 rounded-2xl transition-colors duration-200"
        >
          <span className="font-medium text-gray-800">닫기</span>
        </button>
      </div>
    </div>
  );
}
