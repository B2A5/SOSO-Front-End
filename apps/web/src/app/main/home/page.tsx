'use client';
import { useEffect, useState } from 'react';
import { MotionSlotMachineText } from '@/components/MotionSlotMachineText';
import { SlotMachineText } from '@/components/SlotMachineText';

/**
 * 비동기 닉네임 생성 목업 함수
 * 실제 API 호출을 시뮬레이션
 */
async function fetchNickname(): Promise<string> {
  // 2초 지연 후 랜덤 닉네임 반환
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const nicknames = [
    '멋진 문어',
    '용감한 문어',
    '행복한 문어',
    '신나는 문어',
    '귀여운 문어',
    '똑똑한 문어',
    '즐거운 문어',
  ];

  return nicknames[Math.floor(Math.random() * nicknames.length)];
}

export default function HomePage() {
  const [nickname, setNickname] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const words = [
    '행복한 문어',
    '쓸쓸한 문어',
    '화려한 문어',
    '슬픈 문어',
    '귀여운 문어',
  ];

  const handleFetchNickname = async () => {
    setIsLoading(true);
    setNickname(null);

    const result = await fetchNickname();
    setNickname(result);
    setIsLoading(false);
  };

  const handleReset = () => {
    setNickname(null);
  };

  useEffect(() => {
    // 마운트 시 자동으로 닉네임 생성
    handleFetchNickname();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        SlotMachine 애니메이션 테스트
      </h1>

      {/* Framer Motion 버전 */}
      <section className="flex flex-col items-center gap-6 p-8 bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-700">
          ⚡ Framer Motion 버전
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-lg text-gray-600">닉네임:</span>
          <div className="min-h-[3rem] flex items-center">
            <MotionSlotMachineText
              options={words}
              targetText={nickname}
              className="text-2xl"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleFetchNickname}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '생성 중...' : '새 닉네임 생성'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            초기화
          </button>
        </div>
      </section>

      {/* 원본 RAF 버전 (비교용) */}
      <section className="flex flex-col items-center gap-6 p-8 bg-gray-50 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-700">
          🎯 원본 RAF 버전 (비교용)
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-lg text-gray-600">닉네임:</span>
          <div className="min-h-[3rem] flex items-center">
            <SlotMachineText
              options={words}
              targetText={nickname}
              className="text-2xl"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 text-center max-w-md">
          두 버전을 비교해보세요! Motion 버전은 코드가 60% 더
          간단하지만, 두 버전 모두 부드럽게 작동합니다.
        </p>
      </section>

      {/* 상태 정보 */}
      <section className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 w-full max-w-2xl">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          📊 상태 정보
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">로딩 중:</span>{' '}
            {isLoading ? '✅ Yes' : '❌ No'}
          </p>
          <p>
            <span className="font-medium">닉네임:</span>{' '}
            {nickname || '(없음)'}
          </p>
          <p className="text-gray-600 mt-4">
            💡 버튼을 눌러 새로운 닉네임을 생성하거나 초기화해보세요!
          </p>
        </div>
      </section>

      {/* 코드 비교 */}
      <section className="p-6 bg-purple-50 rounded-lg border border-purple-200 w-full max-w-2xl">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">
          📈 성능 비교
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">
              원본 RAF 버전
            </h4>
            <ul className="space-y-1 text-gray-600">
              <li>✅ 코드: 248줄</li>
              <li>✅ 번들: +0KB</li>
              <li>✅ 성능: 최고</li>
              <li>❌ 복잡도: 높음</li>
            </ul>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">
              Motion 버전
            </h4>
            <ul className="space-y-1 text-gray-600">
              <li>✅ 코드: 95줄</li>
              <li>⚠️ 번들: +58KB</li>
              <li>✅ 성능: 우수</li>
              <li>✅ 복잡도: 낮음</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
