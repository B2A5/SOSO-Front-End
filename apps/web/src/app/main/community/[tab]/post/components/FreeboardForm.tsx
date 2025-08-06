import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  useSearchParams,
  useRouter,
  usePathname,
} from 'next/navigation';
import Input from '@/components/inputs/Input';
import { PostFormData, GetPostResponse } from '@/api/posts';
import { CATEGORIES, Category } from '@/constants/categories';
import SelectDropdown from '@/components/dropdown/SelectDropdown';
import TextArea from '@/components/inputs/TextArea';

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
    formState: { errors, touchedFields },
  } = useForm<PostFormData>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: defaultVals,
  });

  // 드롭다운 변경 시 URL 업데이트
  const handleCategoryChange = (value: Category) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', value);
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="flex flex-col h-full w-full">
      <form
        className="space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full border border-gray-300 rounded-lg"
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
            minLength: {
              value: 10,
              message: '내용은 최소 10자 이상 입력해야 합니다.',
            },
            maxLength: {
              value: 500,
              message: '내용은 최대 500자까지 입력 가능합니다.',
            },
          })}
        />
      </form>
    </div>
  );
}
