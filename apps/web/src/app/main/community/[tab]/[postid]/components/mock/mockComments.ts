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
  '아침 공기는 늘 하루의 시작을 새롭게 느끼게 한다. 창밖에서 들려오는 새소리와 따뜻한 햇살이 기분을 밝게 만들어 준다. 나는 조용히 커피를 내리고 향긋한 향을 즐기며 오늘 하루를 어떻게 보낼지 떠올렸다. 작은 계획들이 모여 큰 성취로 이어지듯, 오늘도 책을 읽고 운동을 하며 하루를 채워가기로 했다. 그렇게 쌓인 하루하루가 결국 나를 더 나은 사람으로 변화시킨다고 믿는다. 일상은 단순해 보이지만 그 안에 성장의 기회가 가득하다.',
  '주말 아침은 평일과 다르게 여유롭다. 창문을 열어 시원한 바람을 맞으며 깊게 숨을 들이켰다. 커피 향이 퍼지며 머리가 맑아지는 기분이 들었다. 오늘은 책을 읽고 산책을 하며 시간을 보내고 싶다. 일상 속 작은 습관이 나를 단단하게 만든다고 믿는다. 앞으로도 꾸준히 나 자신을 성장시켜 나갈 것이다.',
  '아침 햇살이 창문을 통해 들어와 방 안을 환하게 밝혔다. 커피 한 잔을 마시며 새로운 하루를 준비했다. 오늘은 어제보다 조금 더 나은 내가 되기를 바라며, 작은 목표 하나라도 달성하기 위해 노력하기로 다짐했다.',
  '오늘은 아침에 일찍 일어나 따뜻한 커피를 마셨다. 창밖의 하늘은 맑고 푸르러 기분이 상쾌했다.',
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
