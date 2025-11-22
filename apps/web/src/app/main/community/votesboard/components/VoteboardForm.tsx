'use client';

import React, { useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/inputs/Input';
import TextArea from '@/components/inputs/TextArea';
import { Button } from '@/components/buttons/Button';
import { useVoteMutation } from '@/hooks/useVoteMutation';
import {
  type VoteFormData,
  voteboardSchema,
} from '../schema/voteboardSchema';
import type { VotePostDetailResponse } from '@/generated/api/models';
import { Plus } from 'lucide-react';
import { VoteboardOptionField } from './VoteoptionField';

export interface VoteboardFormProps {
  /** 수정할 투표 게시글 ID (없으면 생성 모드) */
  voteId?: number;
  /** 수정 모드일 때 상세 응답 데이터 */
  initialData?: VotePostDetailResponse;
}

/**
 * VoteboardForm 컴포넌트
 * 투표 게시글 작성 및 수정 폼
 *
 * @param voteId - 수정할 투표 게시글 ID (없으면 생성 모드)
 * @param initialData - 초기 폼 데이터 (수정 모드에서 사용)
 *
 * @remarks
 * - 현재는 이미지 업로드 UI를 제공하지 않습니다.
 * - TODO: 백엔드 이미지 스펙 확정 후, FreeboardForm과 동일한 패턴으로 ImageUploader 연동
 */
export function VoteboardForm({
  voteId,
  initialData,
}: VoteboardFormProps) {
  const isEdit = !!voteId;

  // 생성/수정 mutation 훅
  const { submitPost, isPending } = useVoteMutation(voteId);

  /**
   * 기본 값 메모이제이션
   *
   * @remarks
   * - 현재는 imageUrls를 사용하지 않고, 텍스트/옵션/설정 필드만 초기화합니다.
   */
  const defaultVals = useMemo<VoteFormData>(
    () => ({
      title: initialData?.title ?? '',
      content: initialData?.content ?? '',
      endTime: initialData?.endTime ?? '',
      allowRevote: initialData?.allowRevote ?? false,
      allowMultipleChoice: initialData?.allowMultipleChoice ?? false,
      voteOptions: initialData?.voteOptions?.map((opt) => ({
        content: opt.content,
      })) ?? [
        { content: '' },
        { content: '' }, // 기본 2개
      ],
      // TODO: 이미지 스펙 확정 시 imageUrls 또는 images 기본값 추가
    }),
    [initialData],
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
  } = useForm<VoteFormData>({
    resolver: zodResolver(voteboardSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: defaultVals,
  });

  // 동적 옵션 필드
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'voteOptions',
  });

  // 폼 제출 핸들러
  const onSubmit = (data: VoteFormData) => {
    console.log('투표 폼 제출 데이터:', data);
    submitPost(data);
  };

  return (
    <div className="relative flex flex-col h-full w-full ">
      <form
        id="vote-form"
        aria-label={isEdit ? '투표 게시글 수정' : '투표 게시글 작성'}
        className="flex flex-col gap-4 w-full flex-1 overflow-auto p-1 transition-transform duration-300 ease-in-out pb-16"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* 제목 */}
        <Input
          id="title"
          label="제목"
          required
          isError={!!errors.title}
          isSuccess={touchedFields.title && !errors.title}
          errorMessage={errors.title?.message}
          placeholder="투표 제목을 입력하세요"
          {...register('title')}
        />

        {/* 내용 */}
        <TextArea
          id="content"
          label="내용"
          required
          maxLength={5000}
          rows={6}
          isError={!!errors.content}
          isSuccess={touchedFields.content && !errors.content}
          errorMessage={errors.content?.message}
          placeholder="투표에 대한 설명을 입력하세요..."
          {...register('content')}
        />

        {/* 마감 시간 
        TODO: 사용자에게 일정 기간을 선택 받고 프론트에서 시간으로 바꿔 서버로 보내기*/}
        <div>
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-neutral-1000 dark:text-neutral-200 mb-2"
          >
            마감 시간
            <span className="ml-1 text-red-500" aria-label="필수">
              *
            </span>
          </label>
          <input
            id="endTime"
            type="datetime-local"
            className="w-full border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm"
            {...register('endTime')}
          />
          {errors.endTime && (
            <p className="mt-1 text-xs text-red-500">
              {errors.endTime.message}
            </p>
          )}
        </div>

        {/* 옵션들 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-neutral-1000 dark:text-neutral-200">
              투표 옵션
              <span className="ml-1 text-red-500" aria-label="필수">
                *
              </span>
            </label>
            <button
              type="button"
              className="text-xs text-soso-500"
              onClick={() => {
                if (fields.length >= 5) return;
                append({ content: '' });
              }}
            >
              <Plus className="inline-block w-3 h-3 mr-1" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <VoteboardOptionField
                key={field.id}
                index={index}
                register={register}
                errorMessage={
                  errors.voteOptions?.[index]?.content?.message
                }
                // 삭제 허용 여부
                // 현재는 "옵션이 3개 이상일 때만 삭제 가능" 로직 유지
                // 기본 2개를 항상 남기고 싶다면: fields.length > 2 && index >= 2 로 변경
                canRemove={fields.length > 2}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
          {typeof errors.voteOptions?.message === 'string' && (
            <p className="text-xs text-red-500">
              {errors.voteOptions?.message}
            </p>
          )}
        </div>

        {/* 설정 (복수 선택 / 재투표) */}
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4"
              {...register('allowMultipleChoice')}
            />
            <span>복수 선택 허용</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4"
              {...register('allowRevote')}
            />
            <span>재투표 허용</span>
          </label>
        </div>

        {/* TODO: 이미지 업로드
         * - 백엔드에서 투표 이미지 스펙이 확정되면,
         *   FreeboardForm의 ImageUploader 사용 예시를 참고해
         *   투표 폼에도 이미지 첨부 UI를 추가할 예정입니다.
         */}
      </form>

      <Button
        type="submit"
        form="vote-form"
        disabled={!isValid || isPending}
        isLoading={isPending}
        className="absolute bottom-0 w-full"
      >
        저장하기
      </Button>
    </div>
  );
}
