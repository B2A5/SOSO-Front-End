import { Header } from '@/components/header/Header';
import { VoteboardForm } from '../components/VoteboardForm';
import { CATEGORIES, Category } from '../../constants/categories';

/**
 * 투표 글 작성 페이지
 *
 * @description
 * 새 투표 게시글을 작성하는 페이지입니다.
 * 상단 헤더와 VoteboardForm 컴포넌트로 구성됩니다.
 *
 */
export default function VoteboardNewPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const rawCategory = searchParams.category;

  // 유효한 카테고리인지 검증
  const category: Category | undefined =
    rawCategory &&
    CATEGORIES.some((category) => category.value === rawCategory)
      ? (rawCategory as Category)
      : undefined;

  return (
    <div className="flex flex-col w-full h-full">
      <Header>
        <Header.Left>
          <Header.CancelButton />
        </Header.Left>
        <Header.Center>투표 글 작성</Header.Center>
      </Header>

      <main className="flex-1 w-full overflow-hidden p-layout">
        <VoteboardForm initialCategory={category} />
      </main>
    </div>
  );
}
