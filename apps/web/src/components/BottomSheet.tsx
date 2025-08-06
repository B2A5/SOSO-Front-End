'use client';

import React from 'react';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface MenuAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

export interface BottomSheetMenuProps {
  isOpen: boolean;
  onClose: () => void;
  actions: MenuAction[];
  title?: string;
  className?: string;
}

export default function BottomSheetMenu({
  isOpen,
  onClose,
  actions,
  title,
  className,
}: BottomSheetMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className={twMerge(
        'fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-out',
        isOpen ? 'translate-y-0' : 'translate-y-full',
        className
      )}
    >
      {/* Handle bar */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      {/* Header */}
      {title && (
        <div className="px-6 py-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}

      {/* Menu Actions */}
      <div className="px-4 pb-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.onClick();
              onClose();
            }}
            className={twMerge(
              'w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-colors duration-200',
              'hover:bg-gray-50 active:bg-gray-100',
              action.destructive
                ? 'text-red-600 hover:bg-red-50 active:bg-red-100'
                : 'text-gray-900'
            )}
          >
            <div
              className={twMerge(
                'flex-shrink-0',
                action.destructive ? 'text-red-600' : 'text-gray-600'
              )}
            >
              {action.icon}
            </div>
            <span className="text-left font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Close Button - Always at bottom */}
      <div className="px-4 pb-6 pt-2 border-t border-gray-100">
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800">닫기</span>
        </button>
      </div>
    </div>
  );
}
