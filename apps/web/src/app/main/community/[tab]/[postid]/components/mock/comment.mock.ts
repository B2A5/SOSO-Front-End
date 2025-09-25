import type {
  Comment,
  CommentCursorResponse,
} from '@/types/comment.types';
import { UserType } from '@/types/user.types';

// 랜덤 댓글/유저 데이터
const mockCommentContents = [
  '너무 맛있어 보여요!',
  '여기 저도 가봤어요!',
  '좋은 정보 감사합니다 :)',
  '사진 퀄리티 최고네요!',
  '시간 나면 꼭 가볼게요~',
  '요즘 이런 데 인기 많죠!',
  '아침 공기는 늘 하루의 시작을 새롭게 느끼게 한다.',
  '주말 아침은 평일과 다르게 여유롭다.',
  '아침 햇살이 창문을 통해 들어와 방 안을 환하게 밝혔다.',
  '오늘은 아침에 일찍 일어나 따뜻한 커피를 마셨다.',
];

const mockUsernames = [
  '김민지',
  '이수현',
  '박지훈',
  '최예린',
  '정유진',
  '강현우',
  '한지훈',
  '홍서연',
  '윤아름',
  '백준서',
];

// 단일 댓글 생성
function generateMockComment(
  id: number,
  content?: string,
  nickname?: string,
): Comment {
  const randomContent =
    content ??
    mockCommentContents[
      Math.floor(Math.random() * mockCommentContents.length)
    ];

  const randomNickname =
    nickname ??
    mockUsernames[Math.floor(Math.random() * mockUsernames.length)];

  const createdAt = new Date(
    Date.now() - Math.random() * 1000000000,
  ).toISOString();
  const randomUserType: UserType =
    Math.random() > 0.5 ? 'founder' : 'resident';

  return {
    id,
    content: randomContent,
    likeCount: Math.floor(Math.random() * 20),
    createdAt,
    user: {
      nickname: randomNickname,
      profileImageUrl: '/somoon/default_somoon.svg',
      userType: randomUserType,
    },
  };
}

// 댓글 목록(Mock 조회)
export function generateMockCommentsPage(
  cursor: string = '1',
  size: number = 10,
): CommentCursorResponse {
  const startId = parseInt(cursor);
  const endId = startId + size;

  const comments: Comment[] = [];
  for (let i = startId; i < endId; i++) {
    comments.push(generateMockComment(i));
  }

  const hasNext = endId < 30;
  return {
    comments,
    nextCursor: {
      hasNext,
      cursor: endId.toString(),
      idAfter: endId,
    },
  };
}

// 댓글 목록 조회(Mock API)
export const mockGetCommentsByCursor = async (params: {
  postId: number;
  cursor?: string;
  size?: number;
}): Promise<CommentCursorResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // 지연
  const size = params.size || 10;
  const cursor = params.cursor || '1';
  return generateMockCommentsPage(cursor, size);
};

// 댓글 작성(Mock 등록)
let mockIdCounter = 1000; // 등록 시점 기준 ID 증가

export const mockCreateComment = async (
  postId: number,
  content: string,
): Promise<Comment> => {
  console.log('[MOCK] 댓글 등록:', { postId, content });
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (content.toLowerCase().includes('error')) {
    throw new Error('MOCK 서버 에러 발생');
  }

  mockIdCounter += 1;
  return generateMockComment(mockIdCounter, content, '테스트 유저');
};
