// app/auth/signup/details/page.tsx
import { redirect } from 'next/navigation';

export default function DetailsIndexPage() {
  // 기본 스텝 1로 이동
  redirect('/auth/signup/details/1');
}