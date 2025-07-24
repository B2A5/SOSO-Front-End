import Card from '@/components/Card';
import { MapPin } from 'lucide-react';

export const SUMMERY = {};

export function HeroCard() {
  return (
    <Card className="w-full max-w-[316px]">
      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-neutral-700" />
        <h4 className="text-input">00시 00동</h4>
      </div>
      <div></div>
    </Card>
  );
}
