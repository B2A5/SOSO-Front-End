'use client';

import { Button } from '@/components/buttons/Button';

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

/** 임시 에러 Fallback UI */
export default function ErrorFallback({
  message,
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="p-6 text-center space-y-4">
      <p className="text-red-500 font-medium">
        {message ?? '문제가 발생했습니다.'}
      </p>

      {onRetry && (
        <Button
          variant="outlined"
          size="sm"
          onClick={onRetry}
          className="mx-auto"
        >
          다시 시도
        </Button>
      )}
    </div>
  );
}
