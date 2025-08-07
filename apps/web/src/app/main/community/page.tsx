// app/main/community/page.tsx
import { redirect } from 'next/navigation';

export default function CommunityPage() {
  // 기본값으로 투표 게시판(votesboard)으로 리디렉션
  redirect('/main/community/votesboard');
}
