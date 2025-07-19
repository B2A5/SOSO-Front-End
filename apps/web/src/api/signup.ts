// src/api/signup.ts
import apiClient from './axios';

/** 1️⃣ 유저 타입 입력 */
export type UserType = 'FOUNDER' | 'INHABITANT';
export function postUserType(userType: UserType) {
  return apiClient.post<string>('/signup/user-type', { userType });
}

/** 2️⃣ 지역 선택 */
export function postRegion(regionId: string) {
  return apiClient.post<string>('/signup/region', { regionId });
}

/** 3️⃣ 나이대 선택 */
export type AgeRange =
  | 'TEENS'
  | 'TWENTIES'
  | 'THIRTIES'
  | 'FORTIES'
  | 'FIFTIES'
  | 'SIXTIES_PLUS';
export function postAgeRange(ageRange: AgeRange) {
  return apiClient.post<string>('/signup/age-range', { ageRange });
}

/** 4️⃣ 성별 선택 */
export type Gender = 'MALE' | 'FEMALE';
export function postGender(gender: Gender) {
  return apiClient.post<string>('/signup/gender', { gender });
}

/** 5️⃣ 관심사 선택 */
// 스킵 가능
export type Interest =
  | 'MANUFACTURING' // 식료품 등 제조업
  | 'WHOLESALE_RETAIL' // 도매 및 소매업
  | 'TRANSPORT' // 운수업
  | 'ACCOMMODATION_FOOD' // 숙박업 및 음식점업
  | 'WELFARE' // 보건 및 사회 복지업
  | 'ART_SPORTS' // 예술 및 스포츠업
  | 'OTHER' // 기타
  | ''; // 스킵
export function postInterests(interests: Interest[]) {
  return apiClient.post<string>('/signup/interests', { interests });
}

/** 6️⃣ 예산 입력 */
// 스킵 가능
export type Budget =
  | 'UNDER_1000' // 1천 이하
  | 'THOUSANDS_2000' // 2천대
  | 'THOUSANDS_3000_5000' // 3~5천
  | 'THOUSANDS_5000_7000' // 5천~7천
  | 'THOUSANDS_7000_TO_1B' // 7천~1억
  | 'OVER_1B' // 1억 이상
  | ''; // 스킵
export function postBudget(budget: Budget | null) {
  // null 이면 서버에서 “건너뛰기” 처리
  return apiClient.post<string>('/signup/budget', { budget });
}

/** 7️⃣ 창업 경험 입력 */
export type Experience = 'YES' | 'NO';
export function postExperience(experience: Experience) {
  return apiClient.post<string>('/signup/experience', { experience });
}

/** 8️⃣ 닉네임 자동 생성 */
export async function postNickname() {
  // 요청 바디 없음
  const response = await apiClient.post<string>('/signup/nickname');
  return response.data;
}

/** 9️⃣ 최종 회원가입 완료 */
export interface SignupCompleteResponse {
  JwtAccessToken: string;
}
export async function postSignupComplete() {
  // 요청 바디 없음
  const response = await apiClient.post<SignupCompleteResponse>(
    '/signup/complete',
  );
  return response.data;
}
