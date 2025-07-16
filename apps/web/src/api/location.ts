// apps/web/src/api/location.ts
// 주소를 검색하기 위한 API
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface AddressSearchParams {
  confmKey: string; // Y: 승인키
  currentPage: number; // Y: 페이지 번호 (기본 1)
  countPerPage: number; // Y: 페이지당 결과 수 (기본 10)
  keyword: string; // Y: 검색어
  resultType?: 'xml' | 'json'; // N: 결과 형식 (기본 'xml')
  hstryYn?: 'Y' | 'N'; // N: 변동주소 포함 여부 (기본 'N') :contentReference[oaicite:8]{index=8}
  firstSort?: 'none' | 'road' | 'location'; // N: 정렬 옵션 (기본 'none') :contentReference[oaicite:9]{index=9}
  addInfoYn?: 'Y' | 'N'; // N: 추가정보 제공 여부 (기본 'N') :contentReference[oaicite:10]{index=10}
}

export interface AddressSearchResponse {
  results: {
    common: {
      totalCount: string; // 총 건수
      currentPage: number; // 현재 페이지
      countPerPage: number; // 페이지당 건수
      errorCode: string; // API 에러 코드
      errorMessage: string; // 에러 메시지
    };
    juso: Array<{
      roadAddr: string; // 전체 도로명주소
      roadAddrPart1: string; // 도로명주소(기본)
      roadAddrPart2?: string; // 참고항목
      jibunAddr: string; // 지번주소
      engAddr: string; // 영문주소
      zipNo: string; // 우편번호
      admCd: string; // 행정구역코드
      rnMgtSn: string; // 도로명코드
      bdMgtSn: string; // 건물관리번호
      detBdNmList?: string; // 상세건물명
      bdNm?: string; // 건물명
      bdKdcd: string; // 공동주택여부
      siNm: string; // 시도명
      sggNm: string; // 시군구명
      emdNm: string; // 읍면동명
      liNm?: string; // 법정리명
      rn: string; // 도로명
      udrtYn: string; // 지하여부
      buldMnnm: number; // 건물본번
      buldSlno: number; // 건물부번
      mtYn: string; // 산여부
      lnbrMnnm: number; // 지번본번
      lnbrSlno: number; // 지번부번
      emdNo: string; // 읍면동일련번호
      hstryYn: string; // 변동이력여부
      relJibun?: string; // 관련지번
      hemdNm?: string; // 관할주민센터
    }>;
  };
}

// 기본 인스턴스 생성
const jusoClient: AxiosInstance = axios.create({
  baseURL: 'https://business.juso.go.kr/addrlink', // 공통 경로 :contentReference[oaicite:15]{index=15}
  timeout: 5000,
  params: { resultType: 'json' }, // 기본 JSON 포맷 :contentReference[oaicite:16]{index=16}
});
// GET 방식 호출
export async function getAddressSearch(
  params: AddressSearchParams,
): Promise<AddressSearchResponse> {
  try {
    const res: AxiosResponse<AddressSearchResponse> =
      await jusoClient.get('/addrLinkApi.do', { params });
    const { common } = res.data.results;
    if (common.errorCode !== '0') {
      throw new Error(common.errorMessage);
    }
    return res.data;
  } catch (err: unknown) {
    console.error('검색 API 오류(GET):', err);
    throw err;
  }
}
