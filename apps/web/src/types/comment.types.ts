import { UserType } from './user.types';

export interface Comment {
  id: number;
  content: string;
  likeCount: number;
  createdAt: string;
  user: {
    nickname: string;
    profileImageUrl: string;
    userType: UserType;
  };
}

export interface CommentCursorResponse {
  comments: Comment[];
  nextCursor: {
    hasNext: boolean;
    cursor: string;
    idAfter: number;
  };
}
