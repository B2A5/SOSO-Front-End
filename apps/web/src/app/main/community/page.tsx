// app/main/community/page.tsx
import { redirect } from 'next/navigation';

// 기본값으로 투표 게시판으로 이동
export default function CommunityPage() {
  redirect('/main/community/votesboard');
}
