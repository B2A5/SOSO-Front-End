import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/inputs/Input';
import { PostFormData, GetPostResponse } from '@/api/posts';

export interface FreeboardFormProps {
  postData: GetPostResponse | null;
}

export function FreeboardForm({
  postData = null,
}: FreeboardFormProps) {
  const defaultVals = useMemo<PostFormData>(
    () =>
      postData ?? {
        title: '',
        content: '',
        category: '',
        images: [],
      },
    [postData],
  );
  const { register } = useForm<PostFormData>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: defaultVals,
  });
  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="text-2xl font-bold mb-4">자유 글 작성</h1>

      <form className="space-y-4">
        <Input
          label="제목"
          {...register('title', {
            required: '제목은 필수입니다.',
            maxLength: {
              value: 20,
              message: '제목은 최대 20자까지 입력 가능합니다.',
            },
          })}
        />
      </form>
    </div>
  );
}
