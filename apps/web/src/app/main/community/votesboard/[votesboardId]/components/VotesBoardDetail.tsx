import { CategoryChip } from '@/components/chips/CategoryChip';
import {
  getVotePost,
  getGetVotePostQueryKey,
} from '@/generated/api/endpoints/voteboard/voteboard';

import { useSuspenseQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { UserProfile } from '../../../freeboard/[freeboardId]/components/UserProfile';
import { UserTypeBadge } from '../../../freeboard/[freeboardId]/components/UserTypeBadge';
import { relativeTime } from '@/utils/relativeTime';
import ImageSlider from '@/components/ImageSlider';
import { VoteSection } from './VoteSection';
import { formatCappedCount } from '@/utils/formatCount';
import { VoteStatusChip } from '@/components/chips/VoteStatusChip';
import VotesBoardDetailSkeleton from './VotesBoardDetailSkeleton';

export interface VoteBoardDetailProps {
  votesboardId: number;
}

export default function VoteBoardDetail({
  votesboardId,
}: VoteBoardDetailProps) {
  const { data: votesBoardDetailData } = useSuspenseQuery({
    queryKey: getGetVotePostQueryKey(votesboardId),
    queryFn: () => getVotePost(votesboardId),
  });

  const {
    author,
    category,
    title,
    content,
    createdDate,
    images,
    viewCount,
    authorized,
    voteStatus,
    endTime,
  } = votesBoardDetailData;

  return (
    <ErrorBoundary fallback={<div>오류가 발생했습니다.</div>}>
      <Suspense fallback={<VotesBoardDetailSkeleton />}>
        <div className="p-5 border-b border-neutral-0">
          {/* 프로필 */}
          <article className="flex items-center gap-1 pb-2">
            <CategoryChip category={category} />
            <VoteStatusChip
              voteStatus={voteStatus}
              endTime={endTime}
            />
          </article>
          {/* 작성자 */}
          <article>
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
                    <span>{relativeTime(createdDate)}</span>
                  </div>
                </UserProfile.SubContents>
              </UserProfile.Right>
            </UserProfile>
          </article>
          {/* 본문 */}
          <article className="flex flex-col space-y-2 pb-6">
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
          </article>

          {/* 투표 섹션 */}
          <article>
            <VoteSection voteData={votesBoardDetailData} />
          </article>
          <article className="flex items-center gap-1.5">
            <Eye className="inline w-6 h-6 text-neutral-200" />
            <span className="text-neutral-500 text-input2">
              {formatCappedCount(viewCount)}
            </span>
          </article>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
