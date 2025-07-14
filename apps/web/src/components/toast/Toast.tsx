// apps/web/src/components/Toast.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ToastMessage } from '@/stores/toastStore';

interface Props extends ToastMessage {
  onRemove: (id: number) => void;
}

export const Toast = ({ id, message, type, onRemove }: Props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 2.5초 후에 fade out 시작
    const hideTimer = setTimeout(() => setVisible(false), 2500);
    // 3초 후에 컨테이너에서 제거
    const removeTimer = setTimeout(() => onRemove(id), 3000);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [id, onRemove]);

  const base =
    'max-w-sm w-full mb-4 p-4 rounded shadow-lg flex items-center transition-opacity duration-500';
  const typeClass = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  }[type];

  return (
    <div
      className={`${base} ${typeClass} ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={() => onRemove(id)}
    >
      <span className="flex-1 truncate">{message}</span>
      <button className="ml-2 font-bold">X</button>
    </div>
  );
};
