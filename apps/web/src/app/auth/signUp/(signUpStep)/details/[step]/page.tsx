'use client';
import React, { useCallback, useEffect } from 'react';
import Button from '@/components/buttons/Button';
import ProgressBar from '@/components/loadings/ProgressBar';
import Contents from './components/Contents';
import { useUserType } from '@/app/auth/signup/UserTypeContext';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import type { SignupStep } from '@/hooks/useSignupStep';
import { StepRequestMap, useSignupStep } from '@/hooks/useSignupStep';

export default function DetailsPage() {
  const router = useRouter();
  const params = useParams();
  const stepParam = params.step;
  const rawStep = Array.isArray(stepParam) // 배열이면 첫 번째 요소
    ? stepParam[0]
    : stepParam; // 아니면 그대로
  const stepNum = parseInt(rawStep ?? '1', 10);

  // 주민인지 창업자인지에 따라 총 스텝을 결정합니다.
  const { userType } = useUserType();
  const totalStep = userType === 'FOUNDER' ? 5 : 2;
  const step = Math.min(
    Math.max(stepNum, 1),
    totalStep,
  ) as SignupStep;

  // 현재 스텝에 해당하는 뮤테이션을 사용합니다.
  const { submit, isLoading } = useSignupStep(step);

  const handleSelected = useCallback(
    (value: StepRequestMap[typeof step]) => {
      submit(value as StepRequestMap[typeof step]);
      console.log('선택된 항목이 업데이트되었습니다.', value);
    },
    [submit],
  );

  const handleNext = useCallback(() => {
    if (isLoading) return;
    if (step < totalStep) {
      router.push(`/auth/signup/details/${step + 1}`);
    } else {
      console.log('회원가입 완료');
    }
  }, [isLoading, router, step, totalStep]);

  useEffect(() => {
    if (step === 3) {
      // 다중 선택 스텝
      submit([] as unknown as StepRequestMap[typeof step]);
    } else {
      // 단일 선택 스텝
      submit('' as unknown as StepRequestMap[typeof step]);
    }
  }, [step, submit]);

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

      <Button className="w-full mb-2" size="lg" onClick={handleNext}>
        다음
      </Button>
    </div>
  );
}
