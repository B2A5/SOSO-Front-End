interface ContentsData {
  [key: number]: {
    title: string;
    isRequired: boolean;
    isCommon: boolean;
    multiple: boolean; // true면 다중 선택 가능
    contents: string[];
  };
}

const contentsData: ContentsData = {
  1: {
    title: '고객님의 연령대를 선택해 주세요',
    isRequired: true,
    isCommon: true,
    multiple: false, // 단일 선택
    contents: [
      '10대입니다.',
      '20대입니다.',
      '30대입니다.',
      '40대입니다.',
      '50대입니다.',
      '60대 이상입니다.',
    ],
  },
  2: {
    title: '고객님의 성별을 선택해 주세요',
    isRequired: true,
    isCommon: true,
    multiple: false,
    contents: ['남성입니다.', '여성입니다.', '선택하지 않겠습니다.'],
  },
  3: {
    title: '고객님의 관심업종를 선택해 주세요',
    isRequired: false,
    isCommon: false,
    multiple: true, // 다중 선택 가능
    contents: [
      '식료품 등 제조업',
      '도매 및 소매업',
      '운수업',
      '숙박 및 음식업',
      '보건 및 사회복지업',
      '예술 및 스포츠업',
      '기타',
    ],
  },
  4: {
    title: '고객님의 예산을 선택해 주세요',
    isRequired: false,
    isCommon: false,
    multiple: false, // 단일 선택
    contents: [
      '~ 1,000만원 이하',
      '1,000만원 ~ 3,000만원',
      '3,000만원 ~ 5,000만원',
      '5,000만원 ~ 7,000만원',
      '7,000만원 ~ 1억원',
      '1억원 이상',
    ],
  },
  5: {
    title: '고객님의 창업 경험을 선택해 주세요',
    isRequired: true,
    isCommon: false,
    multiple: false, // 단일 선택
    contents: ['창업 경험이 있어요', '창업 경험이 없어요'],
  },
};

export default contentsData;
