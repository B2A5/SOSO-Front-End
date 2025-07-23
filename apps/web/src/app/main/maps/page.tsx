import { Map } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Map className="w-16 h-16 text-gray-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800">
        지도 페이지
      </h1>
      <p className="text-gray-600 mt-2">
        이곳은 지도 관련 기능이 구현될 예정입니다.
      </p>
    </div>
  );
}
