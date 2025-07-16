/**
 * 모바일 팝업 API 응답 항목 인터페이스
 */
export interface DaumPostcodeResponse {
  /** 국가기초구역번호 (2015년 8월 1일부터 시행된 새 우편번호) */
  zonecode?: string;

  /** 기본 주소 (검색 결과 첫 줄에 표시되는 주소) */
  address?: string;

  /** 기본 영문 주소 */
  addressEnglish?: string;

  /** 검색된 기본 주소 타입: 'R'(도로명) | 'J'(지번) */
  addressType: 'R' | 'J';

  /** 사용자가 선택한 주소 타입: 'R'(도로명) | 'J'(지번) */
  userSelectedType?: 'R' | 'J';

  /** 연관 주소에서 "선택 안함" 선택 시 구분하는 상태 변수: 'Y' | 'N' */
  noSelected?: 'Y' | 'N';

  /** 사용자가 선택한 주소 언어 타입: 'K'(한글) | 'E'(영문) */
  userLanguageType?: 'K' | 'E';

  /** 도로명 주소 (지번→도로명 매핑 시 1:N의 경우 공백 가능) */
  roadAddress?: string;

  /** 영문 도로명 주소 */
  roadAddressEnglish?: string;

  /** 지번 주소 (도로명→지번 매핑 시 1:N의 경우 공백 가능) */
  jibunAddress?: string;

  /** 영문 지번 주소 */
  jibunAddressEnglish?: string;

  /**
   * 자동 매핑 도로명 주소
   * (지번주소에 매핑된 도로명 주소가 여러 개인 경우 첫 번째 항목)
   */
  autoRoadAddress?: string;

  /** 자동 매핑 영문 도로명 주소 */
  autoRoadAddressEnglish?: string;

  /**
   * 자동 매핑 지번 주소
   * (도로명주소에 매핑된 지번 주소가 여러 개인 경우 첫 번째 항목)
   */
  autoJibunAddress?: string;

  /** 자동 매핑 영문 지번 주소 */
  autoJibunAddressEnglish?: string;

  /** 건물관리번호 */
  buildingCode?: string;

  /** 건물명 */
  buildingName?: string;

  /** 공동주택 여부: 'Y' | 'N' */
  apartment?: 'Y' | 'N';

  /** 도/시 이름 */
  sido?: string;

  /** 도/시 이름 영문 */
  sidoEnglish?: string;

  /** 시/군/구 이름 */
  sigungu?: string;

  /** 시/군/구 이름 영문 */
  sigunguEnglish?: string;

  /** 시/군/구 코드 (5자리) */
  sigunguCode?: string;

  /** 도로명 코드 (7자리, 추후 확장 가능) */
  roadnameCode?: string;

  /** 법정동/법정리 코드 */
  bcode?: string;

  /** 도로명 (건물번호 제외) */
  roadname?: string;

  /** 도로명 영문 (건물번호 제외) */
  roadnameEnglish?: string;

  /** 법정동/법정리 이름 */
  bname?: string;

  /** 법정동/법정리 영문 이름 */
  bnameEnglish?: string;

  /** 법정리 읍/면 이름 (동 지역은 빈 문자열) */
  bname1?: string;

  /** 법정리 읍/면 이름 영문 (동 지역은 빈 문자열) */
  bname1English?: string;

  /** 법정동/법정리 이름 (중복 제공) */
  bname2?: string;

  /** 법정동/법정리 영문 이름 (중복 제공) */
  bname2English?: string;

  /** 행정동 이름 (법정동과 다를 때만 제공) */
  hname?: string;

  /** 사용자가 입력한 검색어 */
  query?: string;
}

/**
 * 응답 예시
 *
 * {
 *   "zonecode": "13529",
 *   "address": "경기 성남시 분당구 판교역로 166",
 *   "addressEnglish": "166 Pangyoyeok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea",
 *   "addressType": "R",
 *   "userSelectedType": "R",
 *   "noSelected": "N",
 *   "userLanguageType": "K",
 *   "roadAddress": "경기 성남시 분당구 판교역로 166",
 *   "roadAddressEnglish": "166 Pangyoyeok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea",
 *   "jibunAddress": "경기 성남시 분당구 백현동 532",
 *   "jibunAddressEnglish": "532 Baekhyeon-dong, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea",
 *   "autoRoadAddress": "경기 성남시 분당구 판교역로 166",
 *   "autoRoadAddressEnglish": "166 Pangyoyeok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea",
 *   "autoJibunAddress": "경기 성남시 분당구 백현동 532",
 *   "autoJibunAddressEnglish": "532 Baekhyeon-dong, Bundang-gu, Seongnam-si, Gyeonggi-do, Republic of Korea",
 *   "buildingCode": "4113511000105320000000002",
 *   "buildingName": "카카오 판교 아지트",
 *   "apartment": "Y",
 *   "sido": "경기",
 *   "sidoEnglish": "Gyeonggi-do",
 *   "sigungu": "성남시 분당구",
 *   "sigunguEnglish": "Bundang-gu Seongnam-si",
 *   "sigunguCode": "41135",
 *   "roadnameCode": "3179025",
 *   "bcode": "4113511000",
 *   "roadname": "판교역로",
 *   "roadnameEnglish": "Pangyoyeok-ro",
 *   "bname": "백현동",
 *   "bnameEnglish": "Baekhyeon-dong",
 *   "bname1": "",
 *   "bname1English": "",
 *   "bname2": "백현동",
 *   "bname2English": "Baekhyeon-dong",
 *   "hname": "",
 *   "query": "판교역로 166",
 *
 * }
 */
