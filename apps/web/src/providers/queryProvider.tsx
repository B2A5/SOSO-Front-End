// apps/web/src/providers/QueryProvider.tsx
'use client';
import React, { ReactNode, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { retryFn, retryDelayFn } from '@/utils/query';
import { ApiError } from '@/api/error';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
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
          },
          mutations: {
            retry: 1,
            retryDelay: 500,
            onError: (err) => console.error('뮤테이션 오류:', err),
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
