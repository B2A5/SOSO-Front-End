// stepsData.ts
import type {
  AgeRangeRequestAgeRange,
  GenderRequestGender,
  InterestRequestInterestsItem,
  BudgetRequestBudget,
  ExperienceRequestExperience,
} from '@/generated/api/models';

export type Option<T> = { label: string; value: T };

// StepsData 타입 정의
type StepsData = {
  1: {
    title: string;
    isRequired: true;
    isCommon: true;
    multiple: false;
    contents: Option<AgeRangeRequestAgeRange>[];
  };
  2: {
    title: string;
    isRequired: true;
    isCommon: true;
    multiple: false;
    contents: Option<GenderRequestGender | null>[];
  };
  3: {
    title: string;
    isRequired: false;
    isCommon: false;
    multiple: true;
    contents: Option<InterestRequestInterestsItem>[];
  };
  4: {
    title: string;
    isRequired: false;
    isCommon: false;
    multiple: false;
    contents: Option<BudgetRequestBudget | null>[];
  };
  5: {
    title: string;
    isRequired: true;
    isCommon: false;
    multiple: false;
    contents: Option<ExperienceRequestExperience>[];
  };
};

const stepsData: StepsData = {
  1: {
    title: '고객님의 연령대를 선택해 주세요',
    isRequired: true,
    isCommon: true,
    multiple: false,
    contents: [
      { label: '10대입니다.', value: 'TEENS' },
      { label: '20대입니다.', value: 'TWENTIES' },
      { label: '30대입니다.', value: 'THIRTIES' },
      { label: '40대입니다.', value: 'FORTIES' },
      { label: '50대입니다.', value: 'FIFTIES' },
      { label: '60대 이상입니다.', value: 'SIXTIES_AND_OVER' },
    ],
  },
  2: {
    title: '고객님의 성별을 선택해 주세요',
    isRequired: true,
    isCommon: true,
    multiple: false,
    contents: [
      { label: '남성입니다.', value: 'MALE' },
      { label: '여성입니다.', value: 'FEMALE' },
      { label: '선택하지 않겠습니다.', value: null },
    ],
  },
  3: {
    title: '고객님의 관심업종를 선택해 주세요',
    isRequired: false,
    isCommon: false,
    multiple: true,
    contents: [
      { label: '식료품 등 제조업', value: 'MANUFACTURING' },
      { label: '도매 및 소매업', value: 'WHOLESALE_RETAIL' },
      { label: '운수업', value: 'TRANSPORT' },
      { label: '숙박 및 음식업', value: 'ACCOMMODATION_FOOD' },
      { label: '보건 및 사회복지업', value: 'WELFARE' },
      { label: '예술 및 스포츠업', value: 'ART_SPORTS' },
      { label: '기타', value: 'OTHER' },
    ],
  },
  4: {
    title: '고객님의 예산을 선택해 주세요',
    isRequired: false,
    isCommon: false,
    multiple: false,
    contents: [
      { label: '1,000만원 이하', value: '1천 이하' },
      { label: '1,000만원 ~ 3,000만원', value: '2천대' },
      {
        label: '3,000만원 ~ 5,000만원',
        value: '3~5천',
      },
      {
        label: '5,000만원 ~ 7,000만원',
        value: '5천~7천',
      },
      { label: '7,000만원 ~ 1억원', value: '7천~1억' },
      { label: '1억원 이상', value: '1억 이상' },
    ],
  },
  5: {
    title: '고객님의 창업 경험을 선택해 주세요',
    isRequired: true,
    isCommon: false,
    multiple: false,
    contents: [
      { label: '창업 경험이 있어요', value: 'YES' },
      { label: '창업 경험이 없어요', value: 'NO' },
    ],
  },
};

export default stepsData;
export type StepValue<S extends keyof StepsData> =
  StepsData[S]['contents'][number]['value'];
