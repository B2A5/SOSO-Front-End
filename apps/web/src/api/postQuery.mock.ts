// src/api/posts.mock.ts
import type {
  CursorQuery,
  PostCursorResponse,
  PostSummary,
  CursorDto,
} from './posts';

// 1) 목업용 포스트 배열 (5개)
export const mockPosts: PostSummary[] = [
  {
    postId: 1,
    title: '우리 동네 중고거래 꿀팁',
    content: '안심 거래 방법 및 추천 장소 공유합니다.',
    category: 'LIFE',
    likeCount: 12,
    commentCount: 3,
    createdAt: '2025-07-28T10:15:00',
    user: {
      nickname: '개발자A',
      location: '서울 강남구',
      profileImageUrl: 'https://example.com/avatarA.jpg',
      userType: 'INHABITANT',
    },
  },
  {
    postId: 2,
    title: '오늘 맛집 탐방기',
    content: '역삼동에 새로 생긴 분식집 후기 올려요~',
    category: 'FOOD',
    likeCount: 5,
    commentCount: 1,
    createdAt: '2025-07-28T09:30:00',
    user: {
      nickname: '맛집러B',
      location: '서울 서초구',
      profileImageUrl: 'https://example.com/avatarB.jpg',
      userType: 'INHABITANT',
    },
  },
  {
    postId: 3,
    title: '스타트업 아이디어 공유',
    content: '지역 기반 커뮤니티 플랫폼 기획안입니다.',
    category: 'STARTUP',
    likeCount: 20,
    commentCount: 8,
    createdAt: '2025-07-27T20:45:00',
    user: {
      nickname: '창업자C',
      location: '경기도 성남시',
      profileImageUrl: 'https://example.com/avatarC.jpg',
      userType: 'FOUNDER',
    },
  },
  {
    postId: 4,
    title: '주말 행사 정보',
    content: '인근 공원 플리마켓 일정 공유해요.',
    category: 'DAILY_HOBBY',
    likeCount: 3,
    commentCount: 0,
    createdAt: '2025-07-26T14:00:00',
    user: {
      nickname: '이벤트러D',
      location: '서울 송파구',
      profileImageUrl: 'https://example.com/avatarD.jpg',
      userType: 'INHABITANT',
    },
  },
  {
    postId: 5,
    title: '소소한 뉴스 브리핑',
    content: '오늘 주요 정치·경제 이슈 정리합니다.',
    category: 'NEWS',
    likeCount: 15,
    commentCount: 4,
    createdAt: '2025-07-28T08:00:00',
    user: {
      nickname: '뉴스봇E',
      location: '서울 중구',
      profileImageUrl: 'https://example.com/avatarE.jpg',
      userType: 'INHABITANT',
    },
  },
];

// 2) 다음 커서 정보
const mockCursor: CursorDto = {
  hasNext: true,
  cursor: '2025-07-26T14:00:00', // 마지막 포스트(createdAt) 기준
  idAfter: 4, // 같은 createdAt인 경우 분기용
};

// 3) 완성된 목업 응답
export const mockPostCursorResponse: PostCursorResponse = {
  posts: mockPosts,
  nextCursor: mockCursor,
};

/**
 * getPostsByCursor 대체용 목업 함수
 */
export const getPostsByCursorMock = async (
  params: CursorQuery,
): Promise<PostCursorResponse> => {
  console.log('🃏 목업 params:', params);
  // 실제 환경처럼 약간의 딜레이 추가
  await new Promise((r) => setTimeout(r, 300));
  return mockPostCursorResponse;
};
