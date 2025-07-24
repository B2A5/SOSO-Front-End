import Card from '@/components/Card';
import { CategoryBadge } from './CategoryBadge';
import { Category } from '@/constants/categorys';

export interface CommunityCardProps {
  title: string;
  description: string;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  isCommented: boolean;
  updatedAt: string;
  userName: string;
  category: Category;
}

export function CommunityCard(props: CommunityCardProps) {
  return (
    <Card className="w-full max-w-[316px]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <CategoryBadge category={props.category} />
        </div>
        <h3 className="text-title2">{props.title}</h3>
      </div>
      <div></div>
    </Card>
  );
}
