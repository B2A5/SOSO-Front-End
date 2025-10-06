import {
  useSetAgeRange,
  useSetGender,
  useSetInterests,
  useSetBudget,
  useSetExperience,
} from '@/generated/api/endpoints/signup/signup';
import type {
  AgeRangeRequestAgeRange,
  GenderRequestGender,
  InterestRequestInterestsItem,
  BudgetRequestBudget,
  ExperienceRequestExperience,
} from '@/generated/api/models';

/**
 * 스텝별 요청 데이터 타입 매핑
 * - Orval로 생성된 타입의 필드 타입을 직접 사용
 */
export interface StepRequestMap {
  1: AgeRangeRequestAgeRange; // 'TEENS' | 'TWENTIES' | ...
  2: GenderRequestGender; // 'MALE' | 'FEMALE' | 'NONE'
  3: InterestRequestInterestsItem[]; // Interest[] - 빈 배열 가능
  4: BudgetRequestBudget | null; // Budget | null - 선택 사항
  5: ExperienceRequestExperience; // 'YES' | 'NO'
}

export type SignupStep = keyof StepRequestMap;

/**
 * 회원가입 스텝별 Orval mutation 훅을 통합 관리
 * - React Hooks 규칙 준수: 모든 훅을 무조건 호출
 * - Orval 훅을 직접 반환하여 타입 안전성 보장
 *
 * @param step - 현재 스텝 번호 (1 ~ 5)
 * @returns Orval mutation 훅 결과 (mutate, isPending 등)
 */
export function useSignupStep<Step extends SignupStep>(
  step: Step,
  options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  },
): {
  mutate: (value: StepRequestMap[Step]) => void;
  isPending: boolean;
} {
  // React Hooks 규칙: 모든 훅을 항상 같은 순서로 호출
  const ageRange = useSetAgeRange({ mutation: options });
  const gender = useSetGender({ mutation: options });
  const interests = useSetInterests({ mutation: options });
  const budget = useSetBudget({ mutation: options });
  const experience = useSetExperience({ mutation: options });

  // step에 따라 적절한 훅 선택 및 반환
  switch (step) {
    case 1:
      return {
        mutate: (value: StepRequestMap[Step]) =>
          ageRange.mutate({
            data: { ageRange: value as StepRequestMap[1] },
          }),
        isPending: ageRange.isPending,
      } as {
        mutate: (value: StepRequestMap[Step]) => void;
        isPending: boolean;
      };
    case 2:
      return {
        mutate: (value: StepRequestMap[Step]) =>
          gender.mutate({
            data: { gender: value as StepRequestMap[2] },
          }),
        isPending: gender.isPending,
      } as {
        mutate: (value: StepRequestMap[Step]) => void;
        isPending: boolean;
      };
    case 3:
      return {
        mutate: (value: StepRequestMap[Step]) =>
          interests.mutate({
            data: { interests: value as StepRequestMap[3] },
          }),
        isPending: interests.isPending,
      } as {
        mutate: (value: StepRequestMap[Step]) => void;
        isPending: boolean;
      };
    case 4:
      return {
        mutate: (value: StepRequestMap[Step]) => {
          // null을 undefined로 변환 (BudgetRequest는 optional이므로 undefined 필요)
          const budgetValue =
            value === null
              ? undefined
              : (value as BudgetRequestBudget);
          budget.mutate({ data: { budget: budgetValue } });
        },
        isPending: budget.isPending,
      } as {
        mutate: (value: StepRequestMap[Step]) => void;
        isPending: boolean;
      };
    case 5:
      return {
        mutate: (value: StepRequestMap[Step]) =>
          experience.mutate({
            data: { experience: value as StepRequestMap[5] },
          }),
        isPending: experience.isPending,
      } as {
        mutate: (value: StepRequestMap[Step]) => void;
        isPending: boolean;
      };
    default:
      // 이 부분은 절대 실행되지 않지만 TypeScript 만족용
      throw new Error(`Invalid signup step: ${step}`);
  }
}
