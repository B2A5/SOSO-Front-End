import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/components/inputs/Input';
import { CATEGORIES, Category } from '../../../constants/categories';
import SelectDropdown from '@/components/dropdown/SelectDropdown';
import TextArea from '@/components/inputs/TextArea';
import { ImageInput } from '@/components/ImageInput';
import { Button } from '@/components/buttons/Button';
import { useToast } from '@/hooks/ui/useToast';
import type { FreeboardCreateRequest } from '@/generated/api/models';
import { useCreatePost } from '@/generated/api/endpoints/freeboard/freeboard';

/**
 * FreeboardForm 컴포넌트
 * 자유게시판 게시글 작성 및 수정 폼
 *
 */
export interface FreeboardFormProps {
  initialData: FreeboardCreateRequest | null;
  initialCategory?: Category;
}

export function FreeboardForm({
  initialData = null,
  initialCategory,
}: FreeboardFormProps) {
  const router = useRouter();
  const toast = useToast();

  const selectedCategory = initialCategory || CATEGORIES[0].value;
  const defaultVals = useMemo<FreeboardCreateRequest>(
    () =>
      initialData ?? {
        title: '',
        content: '',
        category: selectedCategory as Category,
        images: [],
      },
    [selectedCategory, initialData],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
  } = useForm<FreeboardCreateRequest>({
    mode: 'onChange', // 실시간 validation을 위해 onChange로 변경
    reValidateMode: 'onChange',
    defaultValues: defaultVals,
  });

  // 이미지 선택 핸들러
  const handleImageSelect = (files: File[]) => {
    setValue('images', files, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // 게시글 작성 mutation
  const { mutate: createPost, isPending } = useCreatePost({
    mutation: {
      onSuccess: () => {
        toast('게시글이 성공적으로 작성되었습니다.', 'success');
        router.push('/community/freeboard');
      },
      onError: () => {
        toast(
          '게시글 작성 중 오류가 발생했습니다. 다시 시도해주세요.',
          'error',
        );
      },
    },
  });

  // form 제출 핸들러
  const onSubmit = (data: FreeboardCreateRequest) => {
    createPost({ data });
  };

  return (
    <div className="relative flex flex-col h-full w-full">
      <form
        id="freeboard-form"
        className="flex flex-col gap-5 w-full h-full overflow-auto p-1 transition-transform duration-300 ease-in-out"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label className="block text-sm font-medium text-neutral-1000 dark:text-neutral-200 mb-2">
            카테고리
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
              />
            )}
          />
        </div>
        <Input
          label="제목"
          isError={!!errors.title}
          isSuccess={touchedFields.title && !errors.title}
          errorMessage={errors.title?.message}
          {...register('title', {
            required: '제목은 필수입니다.',
            validate: (value) =>
              value?.trim().length > 0 || '제목을 입력해주세요.',
            maxLength: {
              value: 20,
              message: '제목은 최대 20자까지 입력 가능합니다.',
            },
          })}
        />
        <TextArea
          label="내용"
          maxLength={500}
          rows={8}
          isError={!!errors.content}
          isSuccess={touchedFields.content && !errors.content}
          errorMessage={errors.content?.message}
          placeholder="내용을 입력하세요..."
          {...register('content', {
            required: '내용은 필수입니다.',
            validate: (value) =>
              value?.trim().length >= 5 ||
              '내용을 5자 이상 입력해주세요.',
            minLength: {
              value: 5,
              message: '내용은 최소 5자 이상 입력해야 합니다.',
            },
            maxLength: {
              value: 500,
              message: '내용은 최대 500자까지 입력 가능합니다.',
            },
          })}
        />

        {/* 이미지 업로드 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-neutral-1000 dark:text-neutral-200 mb-2">
            사진 첨부 (선택)
          </label>
          <ImageInput onFileSelect={handleImageSelect} />
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
