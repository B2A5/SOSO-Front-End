'use client';

import { useState } from 'react';
import Button from '@/components/buttons/Button';
import { PillChipsTab } from '@/components/tabs/PillChipsTab';
import type { TabItem } from '@/types/tab.types';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'filled' | 'outlined' | 'bottom' | 'ghost';

const RESPONSE_TIMES = [50, 100, 300, 500, 1000, 5000] as const;

const SIZE_TABS: TabItem<Size>[] = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
];

const VARIANT_TABS: TabItem<Variant>[] = [
  { label: 'Filled', value: 'filled' },
  { label: 'Outlined', value: 'outlined' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Ghost', value: 'ghost' },
];

export default function HomePage() {
  const [selectedSize, setSelectedSize] = useState<Size>('md');
  const [selectedVariant, setSelectedVariant] =
    useState<Variant>('filled');
  const [loadingStates, setLoadingStates] = useState<
    Record<number, boolean>
  >({});

  const handleClick = async (delay: number) => {
    setLoadingStates((prev) => ({ ...prev, [delay]: true }));
    await new Promise((resolve) => setTimeout(resolve, delay));
    setLoadingStates((prev) => ({ ...prev, [delay]: false }));
  };

  const getDelayDescription = (ms: number) => {
    if (ms < 100) return '즉시 완료 - 로딩 표시 안함';
    if (ms <= 500) return '텍스트 그라데이션 효과';
    return 'Spinner + 로딩 텍스트';
  };

  const getDelayIcon = (ms: number) => {
    if (ms < 100) return '⚡';
    if (ms <= 500) return '✨';
    return '⏳';
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 gap-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          Button Component Tester
        </h1>
        <p className="text-slate-600">
          모든 버튼 스타일과 응답 속도를 테스트하세요
        </p>
      </div>

      {/* 사이즈 선택 탭 */}
      <div className="w-full max-w-4xl">
        <h2 className="text-lg font-semibold text-slate-700 mb-3">
          버튼 사이즈 선택
        </h2>
        <PillChipsTab
          chips={SIZE_TABS}
          activeValue={selectedSize}
          onChange={(value) => setSelectedSize(value ?? 'md')}
          showAll={false}
        />
      </div>

      {/* 테마 선택 탭 */}
      <div className="w-full max-w-4xl">
        <h2 className="text-lg font-semibold text-slate-700 mb-3">
          버튼 테마 선택
        </h2>
        <PillChipsTab
          chips={VARIANT_TABS}
          activeValue={selectedVariant}
          onChange={(value) => setSelectedVariant(value ?? 'filled')}
          showAll={false}
        />
      </div>

      {/* 응답 속도 테스트 */}
      <div className="w-full max-w-4xl">
        <h2 className="text-lg font-semibold text-slate-700 mb-3">
          응답 속도 테스트
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RESPONSE_TIMES.map((delay) => (
            <div
              key={delay}
              className="p-5 bg-white rounded-xl shadow-sm border border-slate-200"
            >
              <div className="mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  {getDelayIcon(delay)} {delay}ms
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {getDelayDescription(delay)}
                </p>
              </div>
              <Button
                variant={selectedVariant}
                size={selectedSize}
                isLoading={loadingStates[delay]}
                onClick={() => handleClick(delay)}
                className="w-full"
              >
                {delay}ms 테스트
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 설명 */}
      <div className="mt-4 p-6 bg-blue-50 rounded-xl border border-blue-200 max-w-4xl w-full">
        <h3 className="font-semibold text-blue-900 mb-2">
          🎯 Progressive Loading 동작 원리
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • <strong>{'< 100ms'}</strong>: 즉각 완료 - 깜빡임 없이
            자연스러운 UX
          </li>
          <li>
            • <strong>100-500ms</strong>: 텍스트 그라데이션 - 우아한
            처리 중 피드백
          </li>
          <li>
            • <strong>{'> 500ms'}</strong>: Spinner 표시 - 명확한 로딩
            상태
          </li>
        </ul>
      </div>
    </div>
  );
}
