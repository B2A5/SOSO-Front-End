// src/components/CommunityCard.tsx
import Image from 'next/image';
import Card from '@/components/Card';
import { CategoryChip } from '@/components/chips/CategoryChip';
import { Category } from '../../constants/categories';
import { LaptopMinimalCheck, MessageSquareMore } from 'lucide-react';
//import { useRouter } from 'next/navigation';
import { formatCount } from '@/utils/formatCount';
import type { VoteboardSummary } from '@/generated/api/models';
import { formatVoteDeadline } from '@/utils/vote-deadline';
import { VoteStatusChip } from '@/components/chips/VoteStatusChip';
import { cn } from '@/utils/cn';
export interface VoteBoardCardProps {
  post: VoteboardSummary;
}

export function VoteBoardCard({ post }: VoteBoardCardProps) {
  const {
    postId,
    title,
    contentPreview,
    category,
    thumbnailUrl,
    commentCount,
    voteInfo,
    hasVoted,
  } = post;

  const { totalVotes, voteStatus, endTime } = voteInfo;

  // const router = useRouter();

  const handleOnClick = () => {
    console.warn(
      '추후 투표 상세 페이지로 이동할 예정입니다. => postId:',
      postId,
    );
    //router.push(`/main/community/votesboard/${postId}`);
  };

  return (
    <Card
      className="w-full flex flex-col gap-2"
      onClick={handleOnClick}
    >
      <div className="flex items-center gap-1">
        <CategoryChip category={category as Category} />
        <VoteStatusChip voteStatus={voteStatus} endTime={endTime} />
      </div>

      <div className="flex flex-row justify-between items-center gap-4">
        <section className="flex flex-col gap-1">
          <h3 className="text-title2 truncate" title={title}>
            {title}
          </h3>
          <p className="text-body truncate" title={contentPreview}>
            {contentPreview}
          </p>
        </section>
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt="게시글 썸네일 이미지"
            width={55}
            height={55}
            className="w-[55px] h-[55px] object-cover rounded-md flex-shrink-0"
          />
        )}
      </div>

      <section className="flex justify-between items-center">
        {/* 남은시간 */}
        <span className="text-neutral-500 text-xs">
          {formatVoteDeadline(endTime)}
        </span>
        <div className="flex items-center gap-2">
          {/* 득표수 */}
          <div
            className="flex items-center gap-1"
            aria-label={`투표수 ${totalVotes ?? 0}개`}
          >
            <LaptopMinimalCheck
              className={cn(
                'w-4 h-4 ',
                hasVoted ? 'text-primary-500' : 'text-neutral-500',
              )}
            />
            <span className="text-xs">{formatCount(totalVotes)}</span>
          </div>
          {/* 댓글 */}
          <div
            className="flex items-center gap-1"
            aria-label={`댓글 ${commentCount ?? 0}개`}
          >
            <MessageSquareMore className="w-4 h-4 text-neutral-500" />
            <span className="text-xs">
              {formatCount(commentCount)}
            </span>
          </div>
        </div>
      </section>
    </Card>
  );
}
