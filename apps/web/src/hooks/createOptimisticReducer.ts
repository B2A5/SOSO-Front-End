import type { QueryClient } from '@tanstack/react-query';

export type OptimisticContext<TSnapshot> = {
  snapshot: TSnapshot | null;
};

export function createOptimisticReducer<
  TVariables,
  TSnapshot,
  TAction,
>(params: {
  queryClient: QueryClient;
  // 낙관적 업데이트를 적용할 쿼리 키
  queryKey: readonly unknown[];
  // 현재 snapshot과 액션을 받아서 다음 snapshot을 반환
  reducer: (snapshot: TSnapshot, action: TAction) => TSnapshot;
  // 변수를 액션으로 변환하는 함수
  toAction: (variables: TVariables) => TAction;
  onError?: (message: string) => void;
}) {
  const { queryClient, queryKey, reducer, toAction, onError } =
    params;

  return {
    onMutate: async (
      variables: TVariables,
    ): Promise<OptimisticContext<TSnapshot>> => {
      // 현재 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey });
      // 현재 스냅샷 저장
      const snapshot = queryClient.getQueryData<TSnapshot>(queryKey);

      if (!snapshot) return { snapshot: null };
      // 낙관적 업데이트 적용
      const action = toAction(variables);
      const nextSnapshot = reducer(snapshot, action);
      // 캐시에 즉시 반영
      queryClient.setQueryData(queryKey, nextSnapshot);
      // 실패 시 복구를 위해 이전 스냅샷 반환
      return { snapshot };
    },

    onError: (
      _error: unknown,
      _variables: TVariables,
      context?: OptimisticContext<TSnapshot>,
    ) => {
      if (context?.snapshot) {
        queryClient.setQueryData(queryKey, context.snapshot);
      }
      onError?.('작업 중 오류가 발생했습니다. 다시 시도해주세요.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  } as const;
}
