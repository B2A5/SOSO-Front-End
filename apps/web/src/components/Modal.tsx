'use client';

import { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Modal 컴포넌트 (단독 렌더링용 - 오버레이 없음)
 *
 * @param isOpen - 모달 열림 여부
 * @param onClose - 닫기 콜백
 * @param children - 모달 내부 콘텐츠
 * @param className - 커스텀 클래스 (선택)
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  className = '',
}: ModalProps) {
  const [show, setShow] = useState(false);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 애니메이션 트리거
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setShow(true));
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        bg-modal p-5 rounded-2xl shadow-2xl w-72 min-h-44 flex justify-center align-middle
        ${className}
      `}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}
