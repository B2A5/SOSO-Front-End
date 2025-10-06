import RedirectIfAuthed from './components/RedirectIfAuthed';
/**
 * 회원가입 레이아웃
 */

export const metadata = {
  title: '회원가입',
};
interface SignUpLayoutProps {
  children: React.ReactNode;
}
export default function SignUpLayout({
  children,
}: SignUpLayoutProps) {
  return (
    <div className="flex flex-col items-center h-full">
      <RedirectIfAuthed className="w-full flex-1 h-full">
        {children}
      </RedirectIfAuthed>
    </div>
  );
}
