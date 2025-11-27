// apps/web/src/providers/QueryProvider.tsx
'use client';
import React, { ReactNode, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { retryFn, retryDelayFn } from '@/utils/query';
import { ApiError } from '@/lib/api-error';
import { useToast } from '@/hooks/ui/useToast';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const toast = useToast();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            const apiError = ApiError.wrap(error);

            // 초기 로드 실패는 각 컴포넌트에서 처리
            if (query.state.data !== undefined) {
              // 401 에러는 api-client에서 처리
              if (apiError.isAuthError()) return;

              // 네트워크 에러
              if (apiError.isNetworkError()) {
                toast('네트워크 연결을 확인해주세요.', 'error');
                return;
              }

              // 서버 에러
              if (apiError.isServerError()) {
                toast(
                  '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                  'error',
                );
                return;
              }
              // 기타 에러 (4xx 등)
              console.error('[Query Error]', apiError);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            const apiError = ApiError.wrap(error);
            console.error('[Mutation Error]', apiError);

            // 401은 api-client에서 처리
            if (apiError.isAuthError()) return;

            // 사용자에게 에러 알림
            const errorMessage =
              (apiError.data as { message?: string })?.message ||
              '요청 처리 중 오류가 발생했습니다.';
            toast(errorMessage, 'error');
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 데이터가 5분 동안 신선하다고 간주
            gcTime: 30 * 60 * 1000, // 30분 후에 가비지 컬렉션
            refetchOnWindowFocus: false, // 창이 포커스될 때 자동으로 다시 가져오지 않음
            refetchOnReconnect: true, // 네트워크가 다시 연결될 때 자동으로 다시 가져오기
            // 에러 발생 시 재시도 설정
            retry: (failureCount, error) => {
              try {
                const apiError = ApiError.wrap(error);
                return retryFn(failureCount, apiError);
              } catch {
                // ApiError로 변환 실패 시 재시도하지 않음
                return false;
              }
            },
            retryDelay: retryDelayFn,
            // 5xx 서버 에러만 Error Boundary로 전파 (선택 사항)
            throwOnError: (error) => {
              const apiError = ApiError.wrap(error);
              return apiError.isServerError();
            },
          },
          mutations: {
            retry: 1,
            retryDelay: 500,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
