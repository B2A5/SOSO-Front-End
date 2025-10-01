import { useParams, useRouter } from 'next/navigation';
import type { UserType } from '@/types/user.types';

/**
 * 회원가입 플로우에서 사용 가능한 라우트 타입
 */
export type SignupRoute =
  | 'region'
  | 'details'
  | 'complete'
  | `details/${number}`;

/**
 * 회원가입 플로우의 공통 로직을 관리하는 훅
 * - URL params에서 userType 파싱
 * - 타입 안전한 라우팅 유틸리티 제공
 */
export function useSignupFlow() {
  const router = useRouter();
  const params = useParams();

  // params에서 userType 파싱
  const rawType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;
  const paramType = rawType?.toLowerCase();

  const userType: UserType | null =
    paramType === 'founder'
      ? 'FOUNDER'
      : paramType === 'inhabitant'
        ? 'INHABITANT'
        : null;

  // 타입별 경로 prefix (소문자)
  const typePrefix = userType?.toLowerCase();

  /**
   * 회원가입 플로우 내에서 다음 페이지로 이동
   * @param route - 이동할 라우트 ('region', 'details', 'complete', 'details/1' 등)
   */
  const pushNext = (route: SignupRoute) => {
    if (!typePrefix) {
      console.error('Invalid user type, cannot navigate');
      return;
    }
    router.push(`/auth/signup/${typePrefix}/${route}`);
  };

  /**
   * 현재 스텝을 기준으로 다음 단계로 자동 이동
   * - 마지막 스텝이면 complete 페이지로
   * - 아니면 다음 스텝으로
   * @param currentStep - 현재 스텝 번호
   * @param totalSteps - 전체 스텝 수
   */
  const pushNextStep = (currentStep: number, totalSteps: number) => {
    if (currentStep < totalSteps) {
      pushNext(`details/${currentStep + 1}`);
    } else {
      pushNext('complete');
    }
  };

  return {
    /** 파싱된 유저 타입 (FOUNDER | INHABITANT | null) */
    userType,
    /** 소문자 타입 prefix (founder | inhabitant | undefined) */
    typePrefix,
    /** 회원가입 플로우 내 페이지로 이동 */
    pushNext,
    /** 현재 스텝 기준으로 다음 페이지로 자동 이동 */
    pushNextStep,
  };
}
