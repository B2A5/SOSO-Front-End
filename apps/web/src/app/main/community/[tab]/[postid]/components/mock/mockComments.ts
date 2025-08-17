import type {
  Comment,
  CommentCursorResponse,
} from '@/types/comment.types';
import { UserType } from '@/types/user.types';

const mockCommentContents = [
  '너무 맛있어 보여요!',
  '여기 저도 가봤어요!',
  '좋은 정보 감사합니다 :)',
  '사진 퀄리티 최고네요!',
  '시간 나면 꼭 가볼게요~',
  '요즘 이런 데 인기 많죠!',
  '글 잘 읽었습니다!',
  '친절한 후기 감사해요!',
  '공감되네요!',
  '여기 예약 어려운가요?',
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

/**
 * 주어진 ID를 기반으로 랜덤한 댓글 데이터를 생성합니다.
 * @param id 댓글 ID
 * @returns Comment 객체
 */
function generateMockComment(id: number): Comment {
  const randomContent =
    mockCommentContents[
      Math.floor(Math.random() * mockCommentContents.length)
    ];
  const randomNickname =
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

/**
 * 커서 기반으로 mock 댓글 페이지를 생성합니다.
 * @param cursor 시작 커서 (기본값: '1')
 * @param size 페이지 당 댓글 수 (기본값: 10)
 * @returns CommentCursorResponse 객체
 */
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

/**
 * 댓글을 커서 기반으로 mock API처럼 비동기 반환합니다.
 * @param params postId, cursor, size를 포함하는 객체
 * @returns CommentCursorResponse 객체 (Promise)
 */
export const mockGetCommentsByCursor = async (params: {
  postId: number;
  cursor?: string;
  size?: number;
}): Promise<CommentCursorResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const size = params.size || 10;
  const cursor = params.cursor || '1';
  return generateMockCommentsPage(cursor, size);
};
