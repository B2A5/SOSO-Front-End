import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/inputs/Input';
import { PostFormData, GetPostResponse } from '@/api/posts';

export interface VotesboardFormProps {
  postData: GetPostResponse | null;
}

export function VotesboardForm({
  postData = null,
}: VotesboardFormProps) {
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
      <h1 className="text-2xl font-bold mb-4">투표 글 작성</h1>

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
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            투표 옵션
          </label>
          <Input
            placeholder="옵션 1"
            {...register('option1' as keyof PostFormData, {
              required: '최소 2개의 옵션이 필요합니다.',
            })}
          />
          <Input
            placeholder="옵션 2"
            {...register('option2' as keyof PostFormData, {
              required: '최소 2개의 옵션이 필요합니다.',
            })}
          />
        </div>
      </form>
    </div>
  );
}