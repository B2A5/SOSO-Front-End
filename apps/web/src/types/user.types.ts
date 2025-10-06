
import type { UserTypeRequestUserType } from '@/generated/api/models';

/** 사용자 유형을 나타내는 타입 (FOUNDER 또는 INHABITANT) */
export type UserType = UserTypeRequestUserType;

/** 서비스 내 회원 정보를 나타내는 타입 */
export interface User {
  /** 내부 고유 회원번호 */
  userId: number;
  /** 사용자 유형 (FOUNDER 또는 INHABITANT) */
  userType: UserType;
  /** 사용자 닉네임 */
  nickname: string;
  /** 이메일 (카카오에서 받은 경우) */
  email?: string;
  /** 프로필 이미지 URL */
  profileImageUrl?: string;
  /** 계정 생성 일시 (ISO 8601) */
  createdAt?: string;
  /** 계정 정보 최신화 일시 (ISO 8601) */
  updatedAt?: string;
}

