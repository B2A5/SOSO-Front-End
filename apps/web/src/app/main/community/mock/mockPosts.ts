import {
  PostSummary,
  PostCursorResponse,
  CursorDto,
} from '@/api/posts';
import { Category } from '../constants/categories';

// 목업 사용자 데이터
const mockUsers = [
  {
    nickname: '김철수',
    location: '서울시 강남구',
    profileImageUrl: '',
    userType: 'FOUNDER',
  },
  {
    nickname: '이영희',
    location: '부산시 해운대구',
    profileImageUrl: '',
    userType: 'INHABITANT',
  },
  {
    nickname: '박민수',
    location: '대구시 중구',
    profileImageUrl: '',
    userType: 'FOUNDER',
  },
  {
    nickname: '정수진',
    location: '인천시 송도',
    profileImageUrl: '',
    userType: 'INHABITANT',
  },
  {
    nickname: '최동원',
    location: '광주시 서구',
    profileImageUrl: '',
    userType: 'FOUNDER',
  },
];

// 목업 카테고리
const mockCategories: Category[] = [
  'daily-hobby',
  'restaurant',
  'living-convenience',
  'neighborhood-news',
  'startup',
  'others',
];

// 목업 제목과 내용
const mockTitles = [
  '오늘 날씨가 정말 좋네요!',
  '새로운 취미를 찾고 있어요',
  '최신 기술 트렌드에 대해 이야기해요',
  '맛집 추천 부탁드립니다',
  '여행 계획 세우는 중이에요',
  '주말에 뭐 하시나요?',
  '운동 시작하려고 하는데 조언 부탁해요',
  '책 추천해주세요',
  '영화 리뷰 나눠요',
  '요리 레시피 공유해요',
];

const mockContents = [
  '정말 오랜만에 맑은 하늘을 보니까 기분이 너무 좋아요. 다들 어떻게 보내고 계신가요?',
  '집에서만 있다보니 답답해서 새로운 취미를 찾고 있어요. 혹시 추천해주실만한 것 있나요?',
  'AI 기술이 정말 빠르게 발전하고 있는 것 같아요. 여러분은 어떤 기술에 관심이 있으신가요?',
  '이번 주말에 맛집 탐방을 해보려고 하는데, 혹시 좋은 곳 아시는 분 계신가요?',
  '다음 달에 여행을 계획하고 있어요. 국내 여행지 중에서 추천해주실 곳이 있나요?',
  '주말마다 집에서 넷플릭스만 보고 있는데, 뭔가 의미있는 활동을 하고 싶어요.',
  '건강을 위해서 운동을 시작하려고 하는데, 초보자에게 좋은 운동이 뭐가 있을까요?',
  '요즘 읽을 책을 찾고 있어요. 재밌게 읽으신 책 있으시면 추천 부탁드려요!',
  '어제 본 영화가 너무 인상깊었어요. 다들 최근에 본 좋은 영화 있나요?',
  '집에서 간단하게 만들 수 있는 요리 레시피가 있다면 공유해주세요!',
];

// 목업 게시글 생성 함수
function generateMockPost(id: number): PostSummary {
  const randomUser =
    mockUsers[Math.floor(Math.random() * mockUsers.length)];
  const randomCategory =
    mockCategories[Math.floor(Math.random() * mockCategories.length)];
  const randomTitle =
    mockTitles[Math.floor(Math.random() * mockTitles.length)];
  const randomContent =
    mockContents[Math.floor(Math.random() * mockContents.length)];

  // 랜덤 날짜 생성 (최근 30일 내)
  const now = new Date();
  const randomDays = Math.floor(Math.random() * 30);
  const randomDate = new Date(
    now.getTime() - randomDays * 24 * 60 * 60 * 1000,
  );

  return {
    postId: id,
    title: randomTitle,
    content: randomContent,
    category: randomCategory,
    likeCount: Math.floor(Math.random() * 100),
    commentCount: Math.floor(Math.random() * 50),
    createdAt: randomDate.toISOString(),
    user: randomUser,
  };
}

// 목업 커서 페이지네이션 응답 생성
export function generateMockPostsPage(
  cursor?: string,
  size: number = 10,
): PostCursorResponse {
  const startId = cursor ? parseInt(cursor) : 1;
  const endId = startId + size;

  const posts: PostSummary[] = [];
  for (let i = startId; i < endId; i++) {
    posts.push(generateMockPost(i));
  }

  const hasNext = endId < 100; // 총 100개의 게시글이 있다고 가정
  const nextCursor: CursorDto = {
    hasNext,
    cursor: endId.toString(),
    idAfter: endId,
  };

  return {
    posts,
    nextCursor,
  };
}

// 목업 API 함수 (실제 API 대신 사용)
export const mockGetPostsByCursor = async (params: {
  category?: string;
  sort?: 'LATEST' | 'LIKE' | 'COMMENT';
  cursor?: string;
  idAfter?: number;
  size?: number;
}): Promise<PostCursorResponse> => {
  // 실제 API 호출 시뮬레이션을 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 800));

  const size = params.size || 10;
  const cursor = params.cursor || '1';

  return generateMockPostsPage(cursor, size);
};
