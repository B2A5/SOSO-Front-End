import { Card } from '@/components/Card';

export function SelectCard({
  title,
  description,
  onClick,
  isSelected = false,
}: {
  title: string;
  description: string;
  onClick: () => void;
  isSelected?: boolean;
}) {
  return (
    <Card
      className={`w-full max-w-md flex gap-4 items-center p-10 cursor-pointer ${
        isSelected ? 'border-2 border-soso-700' : ''
      }`}
      onClick={onClick}
    >
      <div className="size-20 bg-neutral-200"></div>
      <div className="flex flex-col gap-2 ">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Card>
  );
}
