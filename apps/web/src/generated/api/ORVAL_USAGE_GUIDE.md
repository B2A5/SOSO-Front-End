# Orval 사용 가이드

> https://orval.dev/guides/react-query

## 📚 목차

1. [생성된 코드 구조](#생성된-코드-구조)
2. [Query 사용법 (GET)](#query-사용법-get)
3. [Mutation 사용법 (POST/PUT/PATCH/DELETE)](#mutation-사용법-postputpatchdelete)
4. [고급 사용법](#고급-사용법)
5. [타입 정의](#타입-정의)
6. [실전 예제](#실전-예제)

---

## 생성된 코드 구조

```
src/generated/api/
├── endpoints/              # API hooks (태그별로 분리)
│   ├── auth/
│   │   └── auth.ts        # 인증 관련 hooks
│   ├── freeboard/
│   │   └── freeboard.ts   # 자유게시판 hooks
│   ├── freeboard-comment/
│   │   └── freeboard-comment.ts
│   ├── freeboard-like/
│   ├── freeboard-comment-like/
│   └── signup/
│       └── signup.ts
└── models/                # TypeScript 타입 정의
    ├── index.ts           # 모든 타입 export
    ├── jwt-token-dto.ts
    ├── freeboard-detail-response.ts
    └── ...
```

---

## Query 사용법 (GET)

### 기본 사용법

```typescript
import { useGetCommentsByCursor } from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';

function CommentList({ freeboardId }: { freeboardId: number }) {
  const { data, isLoading, error } = useGetCommentsByCursor(
    freeboardId,
    {
      size: 20,
      sort: 'LATEST',
    }
  );

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <div>
      {data?.comments.map(comment => (
        <div key={comment.commentId}>{comment.content}</div>
      ))}
    </div>
  );
}
```

### 옵션 활용

```typescript
const { data, isLoading, error, refetch } = useGetCommentsByCursor(
  freeboardId,
  { size: 20 },
  {
    query: {
      // 자동 리패치 설정
      refetchOnWindowFocus: true,
      refetchInterval: 10000, // 10초마다

      // 캐시 설정
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분

      // 조건부 실행
      enabled: !!freeboardId, // freeboardId가 있을 때만 실행

      // 성공/실패 콜백
      onSuccess: (data) => {
        console.log('데이터 로드 성공:', data);
      },
      onError: (error) => {
        console.error('데이터 로드 실패:', error);
      },
    },
  },
);
```

### 무한 스크롤 (Cursor 기반)

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getCommentsByCursor,
  getGetCommentsByCursorQueryKey
} from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';

function InfiniteCommentList({ freeboardId }: { freeboardId: number }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: getGetCommentsByCursorQueryKey(freeboardId),
    queryFn: ({ pageParam }) =>
      getCommentsByCursor(freeboardId, {
        cursor: pageParam,
        size: 20,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <div>
      {data?.pages.map((page) =>
        page.comments.map((comment) => (
          <div key={comment.commentId}>{comment.content}</div>
        ))
      )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? '로딩 중...' : '더보기'}
        </button>
      )}
    </div>
  );
}
```

---

## Mutation 사용법 (POST/PUT/PATCH/DELETE)

### 1. 댓글 작성 (POST)

```typescript
import { useCreateComment } from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';
import type { FreeboardCommentCreateRequest } from '@/generated/api/models';

function CommentForm({ freeboardId }: { freeboardId: number }) {
  const { mutate, isPending, isError, error } = useCreateComment({
    mutation: {
      onSuccess: (data) => {
        console.log('댓글 작성 성공:', data);
        // 캐시 무효화 (댓글 목록 다시 불러오기)
      },
      onError: (error) => {
        console.error('댓글 작성 실패:', error);
      },
    },
  });

  const handleSubmit = (content: string) => {
    mutate({
      freeboardId,
      data: {
        content,
        parentCommentId: null, // 대댓글이면 부모 댓글 ID
      },
    });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(e.currentTarget.content.value);
    }}>
      <textarea name="content" />
      <button type="submit" disabled={isPending}>
        {isPending ? '작성 중...' : '댓글 작성'}
      </button>
      {isError && <p>에러: {error.message}</p>}
    </form>
  );
}
```

### 2. 댓글 수정 (PATCH)

```typescript
import { useUpdateComment } from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';

function EditComment({ freeboardId, commentId }: Props) {
  const { mutate: updateComment, isPending } = useUpdateComment({
    mutation: {
      onSuccess: () => {
        alert('댓글이 수정되었습니다');
      },
    },
  });

  const handleUpdate = (newContent: string) => {
    updateComment({
      freeboardId,
      commentId,
      data: { content: newContent },
    });
  };

  return (
    <button onClick={() => handleUpdate('수정된 내용')} disabled={isPending}>
      수정
    </button>
  );
}
```

### 3. 댓글 삭제 (DELETE)

```typescript
import { useDeleteComment } from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';

function DeleteButton({ freeboardId, commentId }: Props) {
  const { mutate: deleteComment } = useDeleteComment({
    mutation: {
      onSuccess: () => {
        alert('댓글이 삭제되었습니다');
      },
    },
  });

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteComment({ freeboardId, commentId });
    }
  };

  return <button onClick={handleDelete}>삭제</button>;
}
```

---

## 고급 사용법

### 1. QueryClient를 사용한 캐시 무효화

```typescript
import { useQueryClient } from '@tanstack/react-query';
import {
  useCreateComment,
  getGetCommentsByCursorQueryKey
} from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';

function CommentForm({ freeboardId }: { freeboardId: number }) {
  const queryClient = useQueryClient();

  const { mutate } = useCreateComment({
    mutation: {
      onSuccess: () => {
        // 특정 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: getGetCommentsByCursorQueryKey(freeboardId),
        });
      },
    },
  });

  return <form>...</form>;
}
```

### 2. Optimistic Update (낙관적 업데이트)

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { useUpdateComment } from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';

function OptimisticUpdate({ freeboardId, commentId }: Props) {
  const queryClient = useQueryClient();

  const { mutate } = useUpdateComment({
    mutation: {
      // 요청 전: UI 먼저 업데이트
      onMutate: async (variables) => {
        const queryKey = getGetCommentsByCursorQueryKey(freeboardId);

        // 진행 중인 쿼리 취소
        await queryClient.cancelQueries({ queryKey });

        // 이전 데이터 백업
        const previousData = queryClient.getQueryData(queryKey);

        // 낙관적 업데이트
        queryClient.setQueryData(queryKey, (old: any) => {
          return {
            ...old,
            comments: old.comments.map((c: any) =>
              c.commentId === commentId
                ? { ...c, content: variables.data.content }
                : c
            ),
          };
        });

        return { previousData };
      },

      // 에러 시: 롤백
      onError: (err, variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            getGetCommentsByCursorQueryKey(freeboardId),
            context.previousData
          );
        }
      },

      // 성공/실패 관계없이: 데이터 다시 가져오기
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getGetCommentsByCursorQueryKey(freeboardId),
        });
      },
    },
  });

  return <button onClick={() => mutate({ freeboardId, commentId, data: { content: '수정' } })}>
    수정
  </button>;
}
```

### 3. 에러 처리

```typescript
import { ErrorResponse } from '@/generated/api/models';

function CommentList({ freeboardId }: { freeboardId: number }) {
  const { data, error } = useGetCommentsByCursor(freeboardId, { size: 20 });

  if (error) {
    const errorResponse = error as ErrorResponse;

    // 백엔드에서 정의한 에러 구조
    return (
      <div>
        <h3>에러 발생</h3>
        <p>상태 코드: {errorResponse.status}</p>
        <p>메시지: {errorResponse.message}</p>
      </div>
    );
  }

  return <div>...</div>;
}
```

### 4. 인증 토큰 사용

인증 토큰은 `src/lib/api-client.ts`의 인터셉터에서 자동으로 추가됩니다:

```typescript
// src/lib/api-client.ts (이미 설정됨)
AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

로그인 후 토큰 저장:

```typescript
import { useLoginWithKakao } from '@/generated/api/endpoints/auth/auth';

function LoginButton() {
  const { mutate: login } = useLoginWithKakao({
    mutation: {
      onSuccess: (data) => {
        // 토큰 저장
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      },
    },
  });

  return <button onClick={() => login({ data: { code: 'kakao_code' } })}>
    카카오 로그인
  </button>;
}
```

---

## 타입 정의

### 자동 생성된 타입 사용

```typescript
import type {
  FreeboardCommentCreateRequest,
  FreeboardCommentCreateResponse,
  FreeboardCommentCursorResponse,
  ErrorResponse,
} from '@/generated/api/models';

// 요청 타입
const createRequest: FreeboardCommentCreateRequest = {
  content: '댓글 내용',
  parentCommentId: null,
};

// 응답 타입
function handleSuccess(response: FreeboardCommentCreateResponse) {
  console.log('생성된 댓글 ID:', response.commentId);
}

// 에러 타입
function handleError(error: ErrorResponse) {
  console.error('에러 코드:', error.status);
  console.error('에러 메시지:', error.message);
}
```

### Mutation/Query 결과 타입

```typescript
import type {
  CreateCommentMutationResult,
  GetCommentsByCursorQueryResult,
} from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';

// Mutation 결과 타입
const result: CreateCommentMutationResult = {
  commentId: 123,
  createdAt: '2025-01-01T00:00:00Z',
};

// Query 결과 타입
const queryResult: GetCommentsByCursorQueryResult = {
  comments: [],
  nextCursor: 'abc123',
  hasNext: true,
};
```

---

## 실전 예제

### 예제 1: 게시글 상세 페이지

```typescript
'use client';

import { useGetFreeboardDetail } from '@/generated/api/endpoints/freeboard/freeboard';
import { useGetCommentsByCursor } from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';

export default function FreeboardDetailPage({ params }: { params: { id: string } }) {
  const freeboardId = parseInt(params.id);

  // 게시글 조회
  const { data: post, isLoading: postLoading } = useGetFreeboardDetail(freeboardId);

  // 댓글 조회
  const { data: comments, isLoading: commentsLoading } = useGetCommentsByCursor(
    freeboardId,
    { size: 20, sort: 'LATEST' }
  );

  if (postLoading || commentsLoading) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>

      <h2>댓글 {comments?.comments.length}개</h2>
      {comments?.comments.map(comment => (
        <div key={comment.commentId}>
          <p>{comment.content}</p>
          <span>{comment.author.nickname}</span>
        </div>
      ))}
    </div>
  );
}
```

### 예제 2: 좋아요 토글

```typescript
import { useTogglePostLike } from '@/generated/api/endpoints/freeboard-like/freeboard-like';
import { useQueryClient } from '@tanstack/react-query';

function LikeButton({ freeboardId, initialLiked }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const queryClient = useQueryClient();

  const { mutate: toggleLike } = useTogglePostLike({
    mutation: {
      onMutate: () => {
        // 즉시 UI 업데이트
        setLiked(!liked);
      },
      onError: () => {
        // 에러 시 롤백
        setLiked(liked);
      },
      onSuccess: () => {
        // 게시글 데이터 갱신
        queryClient.invalidateQueries({
          queryKey: [`/community/freeboard/${freeboardId}`],
        });
      },
    },
  });

  return (
    <button onClick={() => toggleLike({ freeboardId })}>
      {liked ? '❤️' : '🤍'} 좋아요
    </button>
  );
}
```

### 예제 3: 폼 유효성 검사와 함께 사용

```typescript
import { useForm } from 'react-hook-form';
import { useCreateComment } from '@/generated/api/endpoints/freeboard-comment/freeboard-comment';
import type { FreeboardCommentCreateRequest } from '@/generated/api/models';

function CommentForm({ freeboardId }: { freeboardId: number }) {
  const { register, handleSubmit, reset } = useForm<FreeboardCommentCreateRequest>();

  const { mutate, isPending } = useCreateComment({
    mutation: {
      onSuccess: () => {
        reset(); // 폼 초기화
        alert('댓글이 작성되었습니다');
      },
    },
  });

  const onSubmit = (data: FreeboardCommentCreateRequest) => {
    mutate({ freeboardId, data });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea {...register('content', { required: true })} />
      <button type="submit" disabled={isPending}>
        {isPending ? '작성 중...' : '댓글 작성'}
      </button>
    </form>
  );
}
```

---

## 📝 정리

### Query (GET)

- `useGetXXX()` - 데이터 조회
- 자동 캐싱 & 리패치
- `isLoading`, `error`, `data` 제공

### Mutation (POST/PUT/PATCH/DELETE)

- `useCreateXXX()`, `useUpdateXXX()`, `useDeleteXXX()`
- `mutate()` 함수로 실행
- `onSuccess`, `onError`, `onMutate` 콜백 지원
- `isPending` 상태 제공

### 타입 안정성

- 모든 요청/응답이 완벽하게 타입 추론됨
- Swagger 문서와 항상 동기화
- IDE 자동완성 지원

### 업데이트

```bash
pnpm api:update
```

---

## 🔗 참고 자료

- [Orval 공식 문서](https://orval.dev/)
- [React Query 공식 문서](https://tanstack.com/query/latest)
- [프로젝트 Swagger 문서](https://soso.dreampaste.com/swagger-ui/index.html)
