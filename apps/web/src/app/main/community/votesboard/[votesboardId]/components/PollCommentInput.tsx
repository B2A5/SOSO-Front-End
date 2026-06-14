'use client';

import {
  createPollComment,
  getGetPollCommentsByCursorQueryKey,
} from '@/generated/api/endpoints/poll-comment/poll-comment';
import {
  getGetPollQueryKey,
  getGetPollsByCursorQueryKey,
} from '@/generated/api/endpoints/poll/poll';
import { useToast } from '@/hooks/ui/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAuthGuard } from '@/hooks/useAuth';
import { useScrollContainerRef } from '@/app/main/community/ScrollContainer';

interface PollCommentInputProps {
  pollId: number;
  limit?: number;
}

export default function PollCommentInput({
  pollId,
  limit = 300,
}: PollCommentInputProps) {
  const [value, setValue] = useState('');
  const targetRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { requireAuth } = useAuthGuard();
  const scrollContainerRef = useScrollContainerRef();

  const { mutate, isPending } = useMutation({
    mutationFn: (content: string) =>
      createPollComment(pollId, { content }),
    onSuccess: () => {
      toast('댓글이 등록되었습니다', 'success');
      setValue('');
      queryClient.invalidateQueries({
        queryKey: getGetPollCommentsByCursorQueryKey(pollId),
      });
      // 게시글 상세(commentCount) 및 목록 캐시 동기화
      queryClient.invalidateQueries({
        queryKey: getGetPollQueryKey(pollId),
      });
      queryClient.invalidateQueries({
        queryKey: getGetPollsByCursorQueryKey(),
      });
      scrollContainerRef?.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    onError: () => {
      toast('댓글 등록에 실패했습니다.', 'error');
    },
  });

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    });
  }, [value]);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const next = e.target.value;
    setValue(next.length > limit ? next.slice(0, limit) : next);
  };

  const handleSubmit = requireAuth(() => {
    if (!value.trim() || isPending) return;
    mutate(value.trim());
  });

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.nativeEvent.isComposing) return;

    const isEnter = e.key === 'Enter';
    const isShift = e.shiftKey;

    if (isEnter && !isShift) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <div className="w-full">
      <div
        className={twMerge(
          'rounded-3xl bg-white border border-gray-200',
          'transition-shadow focus-within:ring-1 ring-neutral-400',
          'px-3 py-1',
        )}
      >
        <textarea
          ref={targetRef}
          rows={1}
          placeholder="댓글을 입력하세요"
          value={value}
          aria-label="댓글 입력"
          onChange={handleChangeInput}
          onKeyDown={handleKeyDown}
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
