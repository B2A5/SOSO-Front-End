'use client';
import Button from '@/components/buttons/Button';
import ProgressBar from '@/components/loadings/ProgressBar';

export function profilesPage() {
  return (
    <div>
      <ProgressBar startStep={2} endStep={3} totalStep={5} />

      <Button className="w-full mb-2" size="lg">
        다음
      </Button>
    </div>
  );
}
