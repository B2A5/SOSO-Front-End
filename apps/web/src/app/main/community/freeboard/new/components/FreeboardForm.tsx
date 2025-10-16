'use client';

import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/inputs/Input';
import { CATEGORIES, Category } from '../../../constants/categories';
import SelectDropdown from '@/components/dropdown/SelectDropdown';
import TextArea from '@/components/inputs/TextArea';
import { ImageUploader } from '@/components/ImageUploader';
import { Button } from '@/components/buttons/Button';
import type { FreeboardDetailResponse } from '@/generated/api/models';
import { useFreeboardMutation } from '@/hooks/useFreeboardMutation';
import {
  freeboardSchema,
  type FreeboardFormData,
} from '../../../schema/freeboardSchema';

/**
 * FreeboardForm 컴포넌트
 * 자유게시판 게시글 작성 및 수정 폼
 *
 * @param freeboardId - 수정할 게시글 ID (없으면 생성 모드)
 * @param initialData - 초기 폼 데이터 (수정 모드에서 사용)
 * @param initialCategory - 초기 선택된 카테고리 (생성 모드에서 사용)
 *
 */

export interface FreeboardFormProps {
  freeboardId?: number;
  initialData?: FreeboardDetailResponse;
  initialCategory?: Category;
}

export function FreeboardForm({
  freeboardId,
  initialData,
  initialCategory,
}: FreeboardFormProps) {
  // 삭제할 기존 이미지 ID 목록
  const [deleteImageIds, setDeleteImageIds] = useState<number[]>([]);

  const defaultVals = useMemo<FreeboardFormData>(
    () => ({
      title: initialData?.title ?? '',
      content: initialData?.content ?? '',
      category:
        initialData?.category ??
        initialCategory ??
        CATEGORIES[0].value,
    }),
    [initialCategory, initialData],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
  } = useForm<FreeboardFormData>({
    resolver: zodResolver(freeboardSchema),
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

  // 기존 이미지 삭제 핸들러
  const handleDeleteExisting = (deletedIds: number[]) => {
    setDeleteImageIds(deletedIds);
  };

  // 게시글 생성/수정 mutation
  const { submitPost, isPending } = useFreeboardMutation(freeboardId);

  // form 제출 핸들러
  const onSubmit = (data: FreeboardFormData) => {
    submitPost(data, deleteImageIds);
  };

  return (
    <div className="relative flex flex-col h-full w-full">
      <form
        id="freeboard-form"
        aria-label={
          freeboardId
            ? '자유게시판 게시글 수정'
            : '자유게시판 게시글 작성'
        }
        className="flex flex-col gap-5 w-full h-full overflow-auto p-1 transition-transform duration-300 ease-in-out"
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
              <SelectDropdown
                options={CATEGORIES}
                placeholder="원하는 카테고리를 선택하세요"
                onChange={field.onChange}
                className="w-full border border-gray-300 dark:border-neutral-700 rounded-lg"
                value={field.value}
                id="category"
                aria-required="true"
              />
            )}
          />
        </div>
        <Input
          id="title"
          label="제목"
          required
          isError={!!errors.title}
          isSuccess={touchedFields.title && !errors.title}
          errorMessage={errors.title?.message}
          {...register('title')}
        />
        <TextArea
          id="content"
          label="내용"
          required
          maxLength={500}
          rows={8}
          isError={!!errors.content}
          isSuccess={touchedFields.content && !errors.content}
          errorMessage={errors.content?.message}
          placeholder="내용을 입력하세요..."
          {...register('content')}
        />

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
      </form>
      <Button
        type="submit"
        form="freeboard-form"
        disabled={!isValid || isPending}
        isLoading={isPending}
        loadingText="게시글 작성 중..."
        className="absolute bottom-0 w-full"
        onClick={handleSubmit(onSubmit)}
      >
        저장하기
      </Button>
    </div>
  );
}
