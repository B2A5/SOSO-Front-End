import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  useSearchParams,
  useRouter,
  usePathname,
} from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Input from '@/components/inputs/Input';
import {
  PostFormData,
  GetPostResponse,
  createPost,
} from '@/api/posts';
import { CATEGORIES, Category } from '@/constants/categories';
import SelectDropdown from '@/components/dropdown/SelectDropdown';
import TextArea from '@/components/inputs/TextArea';
import { ImageInput } from '@/components/ImageInput';
import { Button } from '@/components/buttons/Button';
import { useToast } from '@/hooks/ui/useToast';

export interface FreeboardFormProps {
  postData: GetPostResponse | null;
}

export function FreeboardForm({
  postData = null,
}: FreeboardFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryCategory = searchParams.get('category') as Category;
  const defaultVals = useMemo<PostFormData>(
    () =>
      postData ?? {
        title: '',
        content: '',
        category: queryCategory ?? CATEGORIES[0].value,
        images: [],
      },
    [postData, queryCategory],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting, isValid },
  } = useForm<PostFormData>({
    mode: 'onChange', // 실시간 validation을 위해 onChange로 변경
    reValidateMode: 'onChange',
    defaultValues: defaultVals,
  });

  const toast = useToast();

  // 드롭다운 변경 시 URL 업데이트
  const handleCategoryChange = (value: Category) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  // 이미지 선택 핸들러
  const handleImageSelect = (files: File[]) => {
    setValue('images', files, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // 게시글 작성 mutation
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast('게시글이 성공적으로 작성되었습니다!', 'success');
      // 작성 완료 후 해당 게시글로 이동 또는 목록으로 이동
      router.push(`/main/community/`);
    },
    onError: (error) => {
      console.error('게시글 작성 실패:', error);
      toast(
        '게시글 작성에 실패했습니다. 다시 시도해주세요.',
        'error',
      );
    },
  });

  // form 제출 핸들러
  const onSubmit = (data: PostFormData) => {
    createPostMutation.mutate(data);
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
                onChange={(value) => {
                  field.onChange(value);
                  handleCategoryChange(value as Category);
                }}
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
        disabled={!isValid}
        isLoading={isSubmitting}
        loadingText="게시글 작성 중..."
        className="absolute bottom-0 w-full"
        onClick={handleSubmit(onSubmit)}
      >
        저장하기
      </Button>
    </div>
  );
}
