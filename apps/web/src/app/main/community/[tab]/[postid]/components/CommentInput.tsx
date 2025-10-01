'use client';

import { useToast } from '@/hooks/ui/useToast';
//실제 api 연동 시 import 경로 변경 필요
import { mockCreateComment as createComment } from './mock/comment.mock';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface CommentInputProps {
  /** 댓글이 달릴 게시글 ID */
  postId: number;
  limit?: number;
}

/**
 * 댓글 입력 컴포넌트
 *
 * - 텍스트 입력 길이에 따라 높이가 자동으로 늘어나는 textarea 패턴
 * - Enter로 제출(Shift+Enter는 줄바꿈 용도로 비워둠)
 * - 입력 길이 제한
 * - 외곽 래퍼가 디자인(배경/패딩/라운드/포커스 링)을 담당, textarea는 투명
 */
export default function CommentInput({
  postId,
  limit = 300,
}: CommentInputProps) {
  const [value, setValue] = useState('');
  const tagetRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: (content: string) => createComment(postId, content),
    onSuccess: () => {
      toast('댓글이 등록되었습니다', 'success');
      setValue('');
      queryClient.invalidateQueries({
        queryKey: ['comments', postId],
      });
    },
    onError: () => {
      toast('댓글 등록에 실패했습니다.', 'error');
    },
  });

  // textarea 자동 높이 조정
  useEffect(() => {
    const el = tagetRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const next = e.target.value;
    setValue(next.length > limit ? next.slice(0, limit) : next);
  };

  const handleSubmit = () => {
    if (!value.trim()) return;
    mutate(value.trim());
  };

  return (
    <div
      className={twMerge('mx-auto w-full max-w-screen-md px-5 py-3')}
    >
      <div
        className={twMerge(
          'rounded-3xl bg-white border border-gray-200',
          'transition-shadow focus-within:ring-1 ring-neutral-400',
          'px-3 py-1',
        )}
      >
        <textarea
          ref={tagetRef}
          rows={1}
          placeholder="댓글을 입력하세요"
          value={value}
          onChange={handleChangeInput}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void handleSubmit();
            }
          }}
          disabled={isPending}
          className={twMerge(
            '!border-0 focus:!outline-none',
            'bg-transparent px-1 text-[14px] flex',
            'resize-none max-h-[68px] w-full',
            '[scrollbar-width:none]',
            '[&::-webkit-scrollbar]:hidden',
          )}
        />
      </div>
    </div>
  );
}
