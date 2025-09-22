'use client';

import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * 댓글 입력 컴포넌트
 *
 * - 텍스트 입력 길이에 따라 높이가 자동으로 늘어나는 textarea 패턴
 * - Enter로 제출(Shift+Enter는 줄바꿈 용도로 비워둠)
 * - 입력 길이 제한
 * - 외곽 래퍼가 디자인(배경/패딩/라운드/포커스 링)을 담당, textarea는 투명
 */
interface CommentInputProps {
  /** 댓글이 달릴 게시글 ID */
  postId: number;
  /**
   * 제출 콜백(실제 API 연동 지점)
   * - 성공 시 CommentInput이 내부 상태를 비움
   */
  onSubmit?: (
    postId: number,
    content: string,
  ) => Promise<void> | void;
  /**
   * 입력 가능한 최대 글자 수(기본 300)
   * - TextArea에는 넘기지 않고 handleChange에서 강제로 자름
   */
  limit?: number;
}

export default function CommentInput({
  postId,
  onSubmit,
  limit = 300,
}: CommentInputProps) {
  /** 현재 입력 값(컨트롤드) */
  const [value, setValue] = useState('');
  /** 제출 중 스피너 등을 띄우기 위한 submission 상태 */
  const [submitting, setSubmitting] = useState(false);
  /** 실패 등 메시지 노출용 에러 상태 */
  const [error, setError] = useState<string>();

  /** 실제 textarea DOM 참조(자동 리사이즈용) */
  const taRef = useRef<HTMLTextAreaElement>(null);

  /**
   * 입력 길이 변화에 따라 높이를 자동으로 맞춘다.
   * 1. height='auto'로 리셋 (shrink 허용)
   * 2. height=scrollHeight로 확장 (expand)
   *
   */
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = 'auto'; // 초기화(줄어들기 허용)
    el.style.height = `${el.scrollHeight}px`; // 내용 높이에 맞춰 확장
  }, [value]);

  /**
   * onChange: 입력 변화 처리
   * - limit를 초과하면 잘라서 저장(hard cut)
   * - 에러 메시지는 사용자가 다시 타이핑하면 숨김
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const next = e.target.value;
    setValue(next.length > limit ? next.slice(0, limit) : next);
    if (error) setError(undefined);
  };

  /**
   * handleSubmit: 실제 제출 로직
   * - 공백만 있을 경우 제출하지 않음
   * - onSubmit 콜백을 await(또는 호출) 후 성공 시 입력 초기화
   * - 실패 시 에러 메시지 세팅
   */
  const handleSubmit = async () => {
    if (!value.trim()) return;
    try {
      setSubmitting(true);
      setError(undefined);
      await onSubmit?.(postId, value.trim());
      setValue('');
    } catch {
      setError(
        '댓글 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.',
        //낙관적업데이트 - 롤백
        // 댓글 비우지 않기
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={twMerge('mx-auto w-full max-w-screen-md px-5 py-3')}
    >
      {/* 래퍼: 패딩/둥근모서리/배경/포커스 링 담당 */}
      <div
        className={twMerge(
          'rounded-3xl bg-white border-1 border-gray-200',
          'transition-shadow focus-within:ring-1 ring-neutral-400',
          'px-3 py-1', // 바깥 패딩(상하/좌우) -> 시각적 1줄 높이에 포함
        )}
      >
        <textarea
          ref={taRef}
          rows={1} // 1줄 기준 시작
          placeholder="댓글을 입력하세요"
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => {
            // 한글/IME 조합 중에는 Enter 처리하지 않음
            if (e.nativeEvent.isComposing) return;
            // Enter로 제출 / Shift+Enter는 줄바꿈
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void handleSubmit();
            }
          }}
          disabled={submitting}
          className={twMerge(
            '!border-0 hover:!border-0 focus:!border-0 focus:!ring-0 focus:!outline-none',
            'bg-transparent px-1 text-[14px] flex',
            // 자동 확장
            'resize-none max-h-[68px] w-full',
            '[scrollbar-width:none]', // Firefox에서 스크롤바 숨김
            '[&::-webkit-scrollbar]:hidden', // Webkit (Chrome/Safari)에서 스크롤바 숨김
          )}
        />
      </div>
    </div>
  );
}
