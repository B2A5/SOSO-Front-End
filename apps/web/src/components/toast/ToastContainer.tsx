// apps/web/src/components/ToastContainer.tsx
'use client';

import React from 'react';
import { useToastStore } from '@/stores/toastStore';
import { Toast } from './Toast';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  // 한 번에 하나씩 보여주기 위해서 큐의 첫 번째만 렌더링
  const next = toasts[0];

  return (
    <div className="fixed top-4 right-4 z-50">
      {next && (
        <Toast
          key={next.id}
          id={next.id}
          message={next.message}
          type={next.type}
          onRemove={removeToast}
        />
      )}
    </div>
  );
};
