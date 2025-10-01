// src/app/auth/signup/[type]/details/[step]/page.tsx
'use client';
import React, { useCallback, useState, useEffect } from 'react';
import Button from '@/components/buttons/Button';
import ProgressBar from '@/components/loadings/ProgressBar';
import Contents from './components/Contents';
import TextButton from '@/components/buttons/TextButton';

import { useRouter, useParams } from 'next/navigation';
import type { SignupStep } from '@/hooks/useSignupStep';
import { StepRequestMap, useSignupStep } from '@/hooks/useSignupStep';
import { useSignupFlow } from '@/hooks/useSignupFlow';
import stepsData from './stepsData';

export default function DetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { userType, pushNext, pushNextStep } = useSignupFlow();

  const rawStep = Array.isArray(params.step)
    ? params.step[0]
    : params.step;
  const stepNum = parseInt(rawStep ?? '1', 10);

  const totalStep = userType === 'FOUNDER' ? 5 : 2;
  const step = Math.min(
    Math.max(stepNum, 1),
    totalStep,
  ) as SignupStep;

  const { isRequired } = stepsData[step];

  // 현재 스텝에 해당하는 뮤테이션을 사용합니다.
  const { mutate, isPending } = useSignupStep(step, {
    onSuccess: () => pushNextStep(step, totalStep),
    onError: (err) => console.error('회원가입 스텝 저장 실패', err),
  });

  const [selectedValue, setSelectedValue] = useState<
    StepRequestMap[typeof step] | null
  >(null);

  // 잘못된 스텝 번호로 접근 시 첫 번째 스텝으로 리다이렉트
  useEffect(() => {
    if (userType == null) {
      router.replace('/signup'); // 잘못된 유저 타입 시
    } else if (stepNum < 1 || stepNum > totalStep) {
      pushNext('details');
      console.warn(
        `잘못된 스텝 번호 ${stepNum}으로 접근했습니다. 처음으로 리다이렉트합니다.`,
      );
    }
  }, [stepNum, totalStep, router, userType, pushNext]);

  useEffect(() => {
    setSelectedValue(null);
  }, [step]);

  const handleSelected = useCallback(
    (value: StepRequestMap[typeof step]) => {
      setSelectedValue(value);
      console.log('선택된 항목이 업데이트되었습니다.', value);
    },
    [],
  );

  const handleNext = useCallback(() => {
    if (isPending || selectedValue == null) return;
    mutate(selectedValue);
  }, [isPending, mutate, selectedValue]);

  const handleSkip = useCallback(() => {
    if (isPending) return;
    // 스킵 시 빈 값으로 API 요청
    const value = (
      step === 3 ? [] : null
    ) as StepRequestMap[typeof step];
    mutate(value);
  }, [isPending, mutate, step]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between">
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex justify-end">
          <p className="text-xs text-fontColor-gray2">
            {step}/{totalStep}
          </p>
        </div>
        <ProgressBar
          startStep={step - 1}
          endStep={step}
          totalStep={totalStep}
        />
      </div>
      <div className="flex-1 w-full mt-6">
        <Contents step={step} onSelected={handleSelected} />
      </div>
      <div className="w-full flex flex-col gap-2 items-center p-1">
        {!isRequired && (
          <TextButton
            className="text-sm text-neutral-300"
            onClick={handleSkip}
          >
            건너뛰기
          </TextButton>
        )}

        <Button
          className="w-full mb-2"
          size="lg"
          onClick={handleNext}
          isLoading={isPending}
          disabled={selectedValue == null}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
