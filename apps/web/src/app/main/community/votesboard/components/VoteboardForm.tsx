'use client';

import React, { useMemo, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import Input from '@/components/inputs/Input';
import TextArea from '@/components/inputs/TextArea';
import { Button } from '@/components/buttons/Button';
import { useVoteboardMutation } from '@/hooks/useVoteboardMutation';
import {
  type VoteboardFormData,
  voteboardSchema,
} from '../schema/voteboardSchema';
import type { VoteboardDetailResponse } from '@/generated/api/models';
import { Plus } from 'lucide-react';
import { VoteboardOptionField } from './VoteoptionField';
import { CATEGORIES, Category } from '../../constants/categories';
import { ImageUploader } from '@/components/ImageUploader';
import { Select } from '@/components/select/Select';
import { RoundCheckbox } from '@/components/inputs/RoundCheckbox';

export interface VoteboardFormProps {
  /** 수정할 투표 게시글 ID (없으면 생성 모드) */
  voteboardId?: number;
  /** 초기 폼 데이터 (수정 모드에서 사용) */
  initialData?: VoteboardDetailResponse;
  /** 초기 선택된 카테고리 (생성 모드에서 사용) */
  initialCategory?: Category;
}

/**
 * VoteboardForm 컴포넌트
 * 자유게시판 게시글 작성 및 수정 폼
 *
 * @description
 * 투표 게시글을 작성하거나 수정할 수 있는 폼 컴포넌트입니다.
 * react-hook-form과 zod를 사용하여 폼 상태 관리 및 유효성 검사를 수행합니다.
 * voteboardId가 주어지면 수정 모드로 동작하며, 그렇지 않으면 생성 모드로 동작합니다.
 *
 * @remarks
 * - 이미지 업로드 기능 포함
 * - 동적 투표 옵션 필드 추가/삭제 지원
 * - 생성 및 수정 모드 모두 지원
 *
 */
export function VoteboardForm({
  voteboardId,
  initialData,
  initialCategory,
}: VoteboardFormProps) {
  const isEdit = !!voteboardId;

  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

  const defaultVals = useMemo<VoteboardFormData>(
    () => ({
      title: initialData?.title ?? '',
      content: initialData?.content ?? '',
      category:
        initialData?.category ??
        initialCategory ??
        CATEGORIES[0].value,
      duration: '3d',
      allowMultipleChoice: initialData?.allowMultipleChoice ?? false,
      allowRevote: initialData?.allowRevote ?? false,
      voteOptions: initialData?.voteOptions ?? [
        { content: '찬성' },
        { content: '반대' },
      ],
    }),
    [initialData, initialCategory],
  );

  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, touchedFields, isValid },
  } = useForm<VoteboardFormData>({
    resolver: zodResolver(voteboardSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: defaultVals,
  });

  // 새 이미지 선택 핸들러
  const handleImageSelect = (files: File[]) => {
    setValue('images', files, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // 기존 이미지 삭제 핸들러(수정용)
  const handleDeleteExisting = (deletedIds: number[]) => {
    setDeleteImageIds(deletedIds);
  };

  // 동적 옵션 필드
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'voteOptions',
  });

  const watchedOptions = watch('voteOptions');
  const optionCount = watchedOptions?.length ?? fields.length;

  const MAX_OPTIONS = 5;
  const MIN_OPTIONS = 2;

  // 옵션 추가 가능 여부 (생성 모드 + 최대 5개)
  const canAddMore = !isEdit && optionCount < MAX_OPTIONS;

  // 옵션 추가/제거 핸들러
  const handleAddOption = () => {
    const current = getValues('voteOptions') ?? [];
    if (current.length >= MAX_OPTIONS) return;
    append({ content: '' });
  };

  const handleRemoveOption = (index: number) => {
    const current = getValues('voteOptions') ?? [];
    if (current.length <= MIN_OPTIONS) return;
    remove(index);
  };

  // 생성/수정 mutation 훅
  const { submitPost, isPending } = useVoteboardMutation(voteboardId);

  // 폼 제출 핸들러
  const onSubmit = (data: VoteboardFormData) => {
    console.log(
      '폼 제출 데이터:',
      data,
      '삭제 이미지 IDs:',
      deleteImageIds,
    );
    submitPost(data, deleteImageIds);
  };

  return (
    <div className="relative flex flex-col h-full w-full overflow-y-auto">
      <form
        id="vote-form"
        aria-label={isEdit ? '투표 게시글 수정' : '투표 게시글 작성'}
        className="flex flex-col gap-4 w-full p-1 transition-transform duration-300 ease-in-out"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-neutral-1000 dark:text-neutral-200 mb-2"
          >
            카테고리
            <span className="ml-1 text-red-500" aria-label="필수">
              *
            </span>
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <Select.Trigger
                  placeholder="카테고리를 선택하세요"
                  className="w-full border border-gray-300 dark:border-neutral-700 rounded-lg"
                />
                <Select.Portal>
                  <Select.Content>
                    {CATEGORIES.map((category) => (
                      <Select.Item
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Portal>
              </Select>
            )}
          />
        </div>
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

        {/* 마감 시간 선택 */}
        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-neutral-1000 dark:text-neutral-200 mb-2"
          >
            마감 기간
            <span className="ml-1 text-red-500" aria-label="필수">
              *
            </span>
          </label>

          <Controller
            name="duration"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <Select.Trigger
                  placeholder="마감 기간을 선택하세요"
                  className="w-full border border-gray-300 dark:border-neutral-700 rounded-lg"
                />
                <Select.Portal>
                  <Select.Content>
                    <Select.Item value="1d">1일 후 마감</Select.Item>
                    <Select.Item value="3d">3일 후 마감</Select.Item>
                    <Select.Item value="7d">1주 후 마감</Select.Item>
                    <Select.Item value="14d">2주 후 마감</Select.Item>
                  </Select.Content>
                </Select.Portal>
              </Select>
            )}
          />

          {errors.duration && (
            <p className="mt-1 text-xs text-red-500">
              {errors.duration.message}
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

            <AnimatePresence initial={false}>
              {canAddMore && (
                <motion.button
                  key="add-option"
                  type="button"
                  className="text-xs text-soso-500"
                  aria-label="투표 옵션 추가"
                  onClick={handleAddOption}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  whileTap={{ scale: 1.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Plus className="inline-block w-3 h-3 mr-1" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* 옵션 필드 */}
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                >
                  <VoteboardOptionField
                    index={index}
                    register={register}
                    errorMessage={
                      errors.voteOptions?.[index]?.content?.message
                    }
                    editable={!isEdit}
                    canRemove={!isEdit && optionCount > MIN_OPTIONS}
                    onRemove={() => handleRemoveOption(index)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {typeof errors.voteOptions?.message === 'string' && (
            <p className="text-xs text-red-500">
              {errors.voteOptions?.message}
            </p>
          )}
        </div>

        {/* 설정 (복수 선택 / 재투표) */}
        <div className="flex flex-col gap-2 text-sm">
          <RoundCheckbox
            label="복수 선택 허용"
            {...register('allowMultipleChoice')}
          />
          <RoundCheckbox
            label="재투표 허용"
            {...register('allowRevote')}
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-neutral-1000 dark:text-neutral-200">
            사진 첨부 (선택)
          </label>
          <ImageUploader
            initialImages={initialData?.images}
            onFileSelect={handleImageSelect}
            onDeleteExisting={handleDeleteExisting}
          />
        </div>

        {/* 버튼 */}
        <div className="sticky bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 pt-2">
          <Button
            type="submit"
            disabled={!isValid || isPending}
            isLoading={isPending}
            className="w-full"
          >
            저장하기
          </Button>
        </div>
      </form>
    </div>
  );
}
