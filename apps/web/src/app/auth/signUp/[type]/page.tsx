import { redirect } from 'next/navigation';

export default function SignUpTypePage({
  params,
}: {
  params: { type: string };
}) {
  const t = params.type?.toLowerCase();
  const typePath = t === 'founder' ? 'founder' : 'inhabitant'; // fallback
  redirect(`/auth/signup/${typePath}/region`);
}
