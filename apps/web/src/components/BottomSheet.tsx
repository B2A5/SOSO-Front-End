'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useOverlay } from '@/hooks/ui/useOverlay';
import Pressable from './Pressable';

export interface MenuAction {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

export interface BottomSheetMenuProps {
  isOpen: boolean;
  actions: MenuAction[];
  title?: string;
  className?: string;
}

export default function BottomSheetMenu({
  isOpen,
  actions,
  title,
  className,
}: BottomSheetMenuProps) {
  const { closeOverlay } = useOverlay();
  if (!isOpen) return null;

  return (
    <div
      className={twMerge(
        'fixed bottom-0 left-0 right-0 z-bottom-sheet px-5 py-4 flex flex-col gap-4',
        ' bg-white rounded-t-2xl  shadow-2xl',
        ' transform transition-transform duration-300 ease-out',
        isOpen ? 'translate-y-0' : 'translate-y-full',
        className,
      )}
    >
      {/* Header */}
      {title && (
        <div className="px-6 py-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </div>
      )}

      {/* Menu Actions */}
      <div className="border border-neutral-0 rounded-2xl flex flex-col gap-1 p-1">
        {actions.map((action, index) => (
          <Pressable key={`action-${index}`}>
            <button
              onClick={() => {
                action.onClick();
                closeOverlay();
              }}
              className={twMerge(
                'w-full flex items-center justify-center px-4 py-4 rounded-2xl transition-colors duration-200',
                'hover:bg-gray-50 active:bg-gray-100',
                action.destructive
                  ? 'text-red-600 hover:bg-red-50 active:bg-red-100'
                  : 'text-gray-900',
              )}
            >
              <span className="font-medium">{action.label}</span>
            </button>
          </Pressable>
        ))}
      </div>

      {/* 닫기 버튼 */}
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
