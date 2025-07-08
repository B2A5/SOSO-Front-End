// apps/web/app/main/page.tsx
import { redirect } from 'next/navigation';

/**
 * /main 기본 페이지
 * 커뮤니티로 리다이렉트
 */
export default function MainPage() {
  redirect('/main/community');
}
