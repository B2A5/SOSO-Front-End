// apps/web/src/providers/QueryProvider.tsx
'use client';
import React, { ReactNode, useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
              let apiErr: ApiError;
              try {
                apiErr = ApiError.wrap(error);
              } catch {
                // AxiosError가 아닌 경우 재시도하지 않음
                return false;
              }
              // 401 (인증 실패)이면 재시도 금지
              if (apiErr.isAuthError()) return false;
              // 네트워크/서버 오류면 최대 2회 재시도
              if (apiErr.isNetworkError() || apiErr.isServerError()) {
                return failureCount < 2;
              }
              return false;
            },
            // 재시도 간격 설정
            retryDelay: (attempt) =>
              Math.min(1000 * 2 ** attempt, 5000),
          },
          mutations: {
            retry: false,
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
