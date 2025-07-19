// app/auth/signup/[type]/details/page.tsx
import { redirect } from 'next/navigation';

// 회원가입 상세 페이지의 인덱스 페이지
// 디테일 페이지로 리다이렉트합니다.
export default function DetailsIndexPage({
  params,
}: {
  params: { type: string };
}) {
  const t = params.type?.toLowerCase();
  const typePath = t === 'founder' ? 'founder' : 'inhabitant'; // fallback
  redirect(`/auth/signup/${typePath}/details/1`);
}
