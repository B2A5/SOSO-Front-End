import type {
  UserResponse,
  UserTypeRequestUserType,
} from '@/generated/api/models';

/** 사용자 유형을 나타내는 타입 (FOUNDER 또는 INHABITANT) */
export type UserType = UserTypeRequestUserType;
/** 서비스 내 회원 정보를 나타내는 타입 */
export type User = UserResponse;
