// src/app/auth/signup/[type]/details/[step]/page.tsx
'use client';
import React, { useCallback, useState, useEffect } from 'react';
import Button from '@/components/buttons/Button';
import ProgressBar from '@/components/loadings/ProgressBar';
import Contents from './components/Contents';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import type { SignupStep } from '@/hooks/useSignupStep';
import { StepRequestMap, useSignupStep } from '@/hooks/useSignupStep';
import stepsData from './stepsData';
import type { UserType } from '@/api/signup';
import TextButton from '@/components/buttons/TextButton';

export default function DetailsPage() {
  const router = useRouter();
  const params = useParams();
  const rawType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;
  const paramType = rawType?.toLowerCase();

  const derivedUserType: UserType | null =
    paramType === 'founder'
      ? 'FOUNDER'
      : paramType === 'inhabitant'
        ? 'INHABITANT'
        : null;
  const rawStep = Array.isArray(params.step)
    ? params.step[0]
    : params.step;
  const stepNum = parseInt(rawStep ?? '1', 10);

  const totalStep = derivedUserType === 'FOUNDER' ? 5 : 2;
  const step = Math.min(
    Math.max(stepNum, 1),
    totalStep,
  ) as SignupStep;
  // 현재 스텝에 대한 데이터
  const { isRequired } = stepsData[step];

  // 현재 스텝에 해당하는 뮤테이션을 사용합니다.
  const { mutate, isPending } = useSignupStep(step);
  const [selectedValue, setSelectedValue] = useState<
    StepRequestMap[typeof step] | null
  >(null);

  // 잘못된 스텝 번호로 접근 시 첫 번째 스텝으로 리다이렉트
  useEffect(() => {
    if (derivedUserType == null) {
      router.replace('/auth/signup'); // 잘못된 type
    } else if (stepNum < 1 || stepNum > totalStep) {
      // 잘못된 스텝 번호로 접근 시 첫 번째 스텝으로 리다이렉트
      router.push(
        `/auth/signup/${derivedUserType.toLowerCase()}/details`,
      );
      console.warn(
        `잘못된 스텝 번호 ${stepNum}으로 접근했습니다. 처음으로 리다이렉트합니다.`,
      );
    }
  }, [stepNum, totalStep, router, derivedUserType]);

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
    if (isPending) return;
    if (selectedValue == null) return; // 값이 없으면 무시

    // API 요청 후 성공 시 다음 단계로 이동
    mutate(selectedValue, {
      onSuccess: () => {
        if (step < totalStep) {
          router.push(
            `/auth/signup/${derivedUserType!.toLowerCase()}/details/${step + 1}`,
          );
        } else {
          console.log('회원가입 완료!');
          router.push(
            `/auth/signup/${derivedUserType!.toLowerCase()}/complete`,
          );
        }
      },
      onError: (err) => {
        console.error('회원가입 스텝 저장 실패', err);
      },
    });
  }, [
    isPending,
    mutate,
    selectedValue,
    router,
    step,
    totalStep,
    derivedUserType,
  ]);

  const handleSkip = useCallback(() => {
    if (isPending) return;

    // 스킵 시 빈 값으로 API 요청
    // 스텝 3의 경우 빈 배열,
    // 스텝 4의 경우 빈 문자열
    const value = step === 3 ? [] : null;

    mutate(value, {
      onSuccess: () => {
        if (step < totalStep) {
          router.push(
            `/auth/signup/${derivedUserType!.toLowerCase()}/details/${step + 1}`,
          );
        } else {
          console.log('회원가입 완료');
        }
      },
      onError: (err) => {
        console.error('회원가입 스텝 스킵 실패', err);
      },
    });
  }, [isPending, mutate, router, step, totalStep, derivedUserType]);

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
          <TextButton className="text-sm" onClick={handleSkip}>
            건너뛰기
          </TextButton>
        )}

        <Button
          className="w-full mb-2"
          size="lg"
          onClick={handleNext}
          isLoading={isPending}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
