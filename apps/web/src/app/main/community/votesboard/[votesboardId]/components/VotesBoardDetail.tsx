import { CategoryChip } from '@/components/chips/CategoryChip';
import {
  getPoll,
  getGetPollQueryKey,
} from '@/generated/api/endpoints/poll/poll';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { UserProfile } from '@/components/users/UserProfile';
import { UserTypeBadge } from '@/components/users/UserTypeBadge';
import { formatTimeAgo } from '@/utils/relativeTime';
import ImageSlider from '@/components/ImageSlider';
import { VoteSection } from '../../components/VoteSection';
import { formatCappedCount } from '@/utils/formatCount';
import { VoteStatusChip } from '@/components/chips/VoteStatusChip';
import VotesBoardDetailSkeleton from './VotesBoardDetailSkeleton';
import VotesBoardLike from './VotesBoardLike';

export interface VoteBoardDetailProps {
  votesboardId: number;
}

export default function VoteBoardDetail({
  votesboardId,
}: VoteBoardDetailProps) {
  const { data: votesBoardDetail } = useSuspenseQuery({
    queryKey: getGetPollQueryKey(votesboardId),
    queryFn: () => getPoll(votesboardId),
  });

  const {
    author,
    category,
    title,
    content,
    images,
    viewCount,
    voteInfo,
    options,
    createdAt,
    updatedAt,
    hasVoted,
    likeCount,
    isLiked,
  } = votesBoardDetail;

  return (
    <ErrorBoundary fallback={<div>오류가 발생했습니다.</div>}>
      <Suspense fallback={<VotesBoardDetailSkeleton />}>
        <article className="p-5 border-b border-neutral-0">
          <address>
            {/* badges */}
            <div className="flex items-center gap-1 pb-2">
              <CategoryChip category={category} />
              <VoteStatusChip
                pollStatus={voteInfo.pollStatus}
                closedAt={voteInfo.closedAt}
              />
            </div>
            {/* 작성자 */}
            <UserProfile className="items-start pb-6">
              <UserProfile.Left>
                <UserProfile.Avatar
                  url={author.profileImageUrl}
                  size={45}
                  alt={`${author.nickname}의 프로필 이미지`}
                />
              </UserProfile.Left>

              <UserProfile.Right>
                <UserProfile.Name
                  nickname={author.nickname}
                  userType={<UserTypeBadge type={author.userType} />}
                />
                <UserProfile.SubContents>
                  <div className="text-input2 text-neutral-500">
                    <span>{author.location}</span>
                    <span className="mx-1">·</span>
                    <time
                      dateTime={new Date(updatedAt).toISOString()}
                    >
                      {formatTimeAgo(createdAt, updatedAt)}
                    </time>
                  </div>
                </UserProfile.SubContents>
              </UserProfile.Right>
            </UserProfile>
          </address>
          {/* 본문 */}
          <section className="flex flex-col space-y-2 pb-6">
            <h1 className="text-2xl font-bold">Q. {title}</h1>

            {images.length > 0 && (
              <ImageSlider
                images={images.map((img) => img.imageUrl)}
                className="w-full min-h-[200px]"
              />
            )}
            <p className="text-textBox text-neutral-1000">
              {content}
            </p>
            {/* 투표 섹션 */}
            <VoteSection
              pollId={votesboardId}
              hasVoted={hasVoted ?? false}
              voteInfo={voteInfo}
              options={options}
            />
          </section>

          <footer className="flex items-center justify-between">
            <VotesBoardLike
              postId={votesboardId}
              initialLikeCount={likeCount}
              initialLiked={isLiked ?? false}
            />
            <div className="flex items-center gap-1.5">
              <Eye className="inline w-6 h-6 text-neutral-200" />
              <span className="text-neutral-500 text-input2">
                {formatCappedCount(viewCount)}
              </span>
            </div>
          </footer>
        </article>
      </Suspense>
    </ErrorBoundary>
  );
}
