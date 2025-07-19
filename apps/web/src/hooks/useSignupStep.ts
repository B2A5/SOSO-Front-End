import { useMutation } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';

import {
  postAgeRange,
  postGender,
  postInterests,
  postBudget,
  postExperience,
} from '@/api/signup';

/**
 * useSignupStep 훅을 사용하여 회원가입 스텝별 API 호출을 관리합니다.
 * step-1 : 나이대 선택
 * step-2 : 성별 선택
 * step-3 : 관심사 선택
 * step-4 : 예산 입력
 * step-5 : 창업 경험 입력
 *
 * @param step - 현재 스텝 번호 (1 ~ 5)
 * @returns
 *   - submit: 해당 스텝의 API 호출 함수
 *   - isLoading: 요청 진행 중 여부
 *   - mutation: React Query useMutation 결과 객체
 */

// 스텝별 요청 파라미터 타입 매핑
export interface StepRequestMap {
  1: Parameters<typeof postAgeRange>[0]; // AgeRange
  2: Parameters<typeof postGender>[0]; // Gender
  3: Parameters<typeof postInterests>[0]; // Interest[]
  4: Parameters<typeof postBudget>[0]; // Budget | null
  5: Parameters<typeof postExperience>[0]; // Experience
}

export type SignupStep = keyof StepRequestMap;

// 2️⃣ 스텝별 응답 데이터 타입 매핑
interface StepResponseMap {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
}

/**
 * useSignupStep 훅
 * @param step - 가입 스텝 번호 (1 ~ 5)
 * @returns
 *   - submit: 해당 스텝의 API 호출 함수
 *   - isLoading: 요청 진행 중 여부
 *   - mutation: React Query useMutation 결과 객체
 */
export function useSignupStep<Step extends keyof StepRequestMap>(
  step: Step,
): {
  /** API 호출을 트리거하는 함수 */
  mutate: (
    value: StepRequestMap[Step],
    options?: {
      onSuccess?: () => void;
      onError?: (error: unknown) => void;
    },
  ) => void;
  /** 요청 진행 중 여부 */
  isPending: boolean;
} {
  // 3️⃣ 스텝에 따라 적절한 API 호출 분기
  const mutationFn = (
    value: StepRequestMap[Step],
  ): Promise<AxiosResponse<StepResponseMap[Step]>> => {
    switch (step) {
      case 1:
        return postAgeRange(value as StepRequestMap[1]);
      case 2:
        return postGender(value as StepRequestMap[2]);
      case 3:
        return postInterests(value as StepRequestMap[3]);
      case 4:
        return postBudget(value as StepRequestMap[4]);
      case 5:
        return postExperience(value as StepRequestMap[5]);
      default:
        return Promise.reject(new Error('잘못된 스텝 번호입니다.')); // 예외 처리
    }
  };

  // 4️⃣ React Query mutation 설정
  const { mutate, isPending } = useMutation({
    mutationFn: mutationFn as (
      val: StepRequestMap[Step],
    ) => Promise<AxiosResponse<StepResponseMap[Step]>>,
  });

  return { mutate, isPending };
}
