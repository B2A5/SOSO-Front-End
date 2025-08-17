// components/CommentList.tsx
'use client';

import { UserType } from '@/types/user.types';
import CommentProfile from './CommentProfile';
import { MoreVertical } from 'lucide-react';

type CommentUser = {
  nickname: string;
  profileImageUrl: string;
  userType: UserType;
};

type Comment = {
  id: number;
  user: CommentUser;
  content: string;
  likeCount: number;
  edited?: boolean;
  createdAt: string;
};

// 목업 댓글 데이터
const dummyComments: Comment[] = [
  {
    id: 11,
    user: {
      nickname: '민수',
      profileImageUrl: '/somoon/default_somoon.svg',
      userType: 'resident',
    },
    content: '오 여기 가봤는데 줄 길더라구요. 꿀팁 감사!',
    likeCount: 3,
    createdAt: '2025-08-07T03:00:00Z',
  },
  {
    id: 12,
    user: {
      nickname: '앨리스',
      profileImageUrl: '/somoon/default_somoon.svg',
      userType: 'founder',
    },
    content: '사진 보니 또 가고 싶네요 :)',
    likeCount: 1,
    edited: true,
    createdAt: '2025-08-07T05:40:00Z',
  },
];

export default function CommentList() {
  return (
    <section className="pt-6 space-y-4">
      {dummyComments.map((comment) => (
        <CommentProfile
          key={comment.id}
          nickname={comment.user.nickname}
          profileImageUrl={comment.user.profileImageUrl}
          userType={comment.user.userType}
          likeCount={comment.likeCount}
          edited={comment.edited}
          createdAt={comment.createdAt}
          action={<MoreVertical className="w-4 h-4" />}
        >
          {comment.content}
        </CommentProfile>
      ))}
    </section>
  );
}
