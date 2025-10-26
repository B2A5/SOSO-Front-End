'use client';

/**
 * AnimatedMessage 컴포넌트
 *
 * Layout shift 없이 부드럽게 나타나고 사라지는 메시지 컴포넌트
 * error/help/success 메시지 표시에 사용
 */

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { MESSAGE_ANIMATION } from '@/styles/tokens/animation';

// ============================================
// Types
// ============================================

/**
 * 메시지 타입
 */
export type MessageType = 'error' | 'success' | 'help' | 'info';

/**
 * AnimatedMessage 컴포넌트의 Props
 */
export interface AnimatedMessageProps {
  /**
   * 메시지 내용
   * 제공되지 않으면 메시지가 표시되지 않습니다
   */
  message?: string;

  /**
   * 메시지 타입
   * 타입에 따라 색상이 자동으로 결정됩니다
   * @default 'help'
   */
  type?: MessageType;

  /**
   * 메시지의 고유 ID
   * aria-describedby와 연결할 때 사용합니다
   */
  id?: string;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;

  /**
   * 아이콘 요소
   * 메시지 앞에 표시할 아이콘을 제공할 수 있습니다
   */
  icon?: React.ReactNode;

  /**
   * error 타입일 때 role="alert" 사용 여부
   * @default true (error 타입일 때)
   */
  useAlert?: boolean;
}

// ============================================
// Style Utilities
// ============================================

/**
 * 메시지 타입별 색상 클래스
 */
const messageTypeClasses: Record<MessageType, string> = {
  error: 'text-red-600 dark:text-red-400',
  success: 'text-soso-600 dark:text-soso-400',
  help: 'text-gray-500 dark:text-gray-400',
  info: 'text-blue-600 dark:text-blue-400',
};

// ============================================
// Component
// ============================================

/**
 * AnimatedMessage 컴포넌트
 *
 * Layout shift 없이 부드럽게 나타나고 사라지는 메시지를 표시합니다.
 * Framer Motion의 AnimatePresence와 layout 애니메이션을 사용하여
 * 메시지 추가/제거 시 자연스러운 확장/축소 효과를 제공합니다.
 *
 * 주요 기능:
 * - Layout shift 방지 (AnimatePresence)
 * - 타입별 색상 자동 적용 (error, success, help, info)
 * - 접근성 지원 (role="alert", aria-live)
 * - 아이콘 지원
 * - 부드러운 fade + slide 애니메이션
 *
 * @component
 * @example
 * // 에러 메시지
 * <AnimatedMessage
 *   message="이메일 형식이 올바르지 않습니다"
 *   type="error"
 *   id="email-error"
 * />
 *
 * @example
 * // 성공 메시지
 * <AnimatedMessage
 *   message="저장되었습니다"
 *   type="success"
 * />
 *
 * @example
 * // 도움말 메시지
 * <AnimatedMessage
 *   message="영문, 숫자, 특수문자를 포함하세요"
 *   type="help"
 * />
 *
 * @example
 * // 아이콘과 함께
 * <AnimatedMessage
 *   message="필수 입력 항목입니다"
 *   type="error"
 *   icon={<AlertIcon />}
 * />
 */
export function AnimatedMessage({
  message,
  type = 'help',
  id,
  className,
  icon,
  useAlert = type === 'error',
}: AnimatedMessageProps) {
  const colorClass = messageTypeClasses[type];

  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={message}
          initial={{
            opacity: 0,
            height: 0,
            y: MESSAGE_ANIMATION.exit.y,
          }}
          animate={MESSAGE_ANIMATION.enter}
          exit={MESSAGE_ANIMATION.exit}
          transition={MESSAGE_ANIMATION.transition}
          className="overflow-hidden"
        >
          <p
            id={id}
            role={useAlert ? 'alert' : undefined}
            aria-live={useAlert ? 'polite' : undefined}
            className={twMerge(
              'flex items-center gap-1 text-xs',
              'pt-2', // 상단 간격
              colorClass,
              className,
            )}
          >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{message}</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

AnimatedMessage.displayName = 'AnimatedMessage';
