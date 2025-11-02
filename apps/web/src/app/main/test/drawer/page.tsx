'use client';

import { useState } from 'react';
import { Drawer } from '@/components/Drawer';

/**
 * Drawer 컴포넌트 테스트 페이지
 *
 * 테스트 항목:
 * 1. 비제어 모드 (Uncontrolled Mode)
 * 2. 제어 모드 (Controlled Mode)
 * 3. 스냅 포인트 (Snap Points)
 * 4. DrawerSnap 컴포넌트
 * 5. DrawerItems 옵션 (destructive, closeOnClick, disabled)
 * 6. asChild 패턴
 * 7. Position 옵션 (bottom, top, left, right)
 * 8. 기타 옵션 (dismissible, modal)
 */
export default function DrawerTestPage() {
  // 제어 모드 상태
  const [controlledOpen, setControlledOpen] = useState(false);
  const [snapIndex, setSnapIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Drawer Component Test Suite
          </h1>
          <p className="text-gray-600">
            모든 Drawer 기능을 테스트할 수 있는 페이지입니다.
          </p>
        </div>

        {/* 1. 비제어 모드 테스트 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            1. 비제어 모드 (Uncontrolled Mode)
          </h2>
          <p className="text-gray-600 mb-4">
            내부 상태로 관리되며, 초기 열림 상태만 설정할 수 있습니다.
          </p>

          <div className="space-y-4">
            {/* 1.1 기본 사용 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                1.1 기본 사용 (닫힌 상태로 시작)
              </h3>
              <Drawer>
                <Drawer.Trigger className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  기본 Drawer 열기
                </Drawer.Trigger>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    기본 Drawer
                  </h3>
                  <p className="text-gray-600 mb-4">
                    이것은 기본 비제어 모드 Drawer입니다.
                  </p>
                  <Drawer.Items>확인</Drawer.Items>
                </Drawer.Content>
              </Drawer>
            </div>

            {/* 1.2 초기에 열린 상태 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                1.2 초기에 열린 상태로 시작
              </h3>
              <Drawer open={true}>
                <Drawer.Trigger className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  초기 열림 Drawer (이미 열림)
                </Drawer.Trigger>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    초기 열림 Drawer
                  </h3>
                  <p className="text-gray-600 mb-4">
                    페이지 로드 시 이미 열려있습니다.
                  </p>
                  <Drawer.Items>닫기</Drawer.Items>
                </Drawer.Content>
              </Drawer>
            </div>

            {/* 1.3 DrawerItems 옵션 테스트 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                1.3 DrawerItems 옵션 테스트
              </h3>
              <Drawer>
                <Drawer.Trigger className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Items 옵션 테스트
                </Drawer.Trigger>
                <Drawer.Overlay />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    Items 옵션
                  </h3>
                  <div className="space-y-2">
                    <Drawer.Items onClick={() => alert('수정 클릭!')}>
                      일반 아이템 (클릭 후 닫힘)
                    </Drawer.Items>
                    <Drawer.Items
                      closeOnClick={false}
                      onClick={() => alert('계속 열려있음!')}
                    >
                      closeOnClick=false (닫히지 않음)
                    </Drawer.Items>
                    <Drawer.Items
                      destructive
                      onClick={() => alert('삭제!')}
                    >
                      destructive (빨간색)
                    </Drawer.Items>
                    <Drawer.Items disabled>
                      disabled (비활성화)
                    </Drawer.Items>
                  </div>
                </Drawer.Content>
              </Drawer>
            </div>
          </div>
        </section>

        {/* 2. 제어 모드 테스트 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            2. 제어 모드 (Controlled Mode)
          </h2>
          <p className="text-gray-600 mb-4">
            외부 상태로 관리되며, 프로그래밍 방식으로 완전히 제어할 수
            있습니다.
          </p>

          <div className="space-y-4">
            {/* 현재 상태 표시 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">
                현재 상태: {controlledOpen ? '🟢 열림' : '🔴 닫힘'}
              </p>
            </div>

            {/* 제어 버튼들 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setControlledOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                외부에서 열기
              </button>
              <button
                onClick={() => setControlledOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                외부에서 닫기
              </button>
              <button
                onClick={() => setControlledOpen(!controlledOpen)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                토글
              </button>
            </div>

            {/* 제어 모드 Drawer */}
            <Drawer
              open={controlledOpen}
              onOpenChange={setControlledOpen}
            >
              <Drawer.Overlay />
              <Drawer.Content className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4">
                  제어 모드 Drawer
                </h3>
                <p className="text-gray-600 mb-4">
                  외부 버튼으로 제어되는 Drawer입니다.
                </p>
                <div className="space-y-2">
                  <Drawer.Items onClick={() => alert('액션 실행!')}>
                    액션 (Drawer 닫힘)
                  </Drawer.Items>
                  <Drawer.Items
                    onClick={() => {
                      alert('액션 실행!');
                      setControlledOpen(false);
                    }}
                  >
                    수동으로 닫기
                  </Drawer.Items>
                </div>
              </Drawer.Content>
            </Drawer>
          </div>
        </section>

        {/* 3. 스냅 포인트 테스트 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            3. 스냅 포인트 (Snap Points) - Phase 5 ✨
          </h2>
          <p className="text-gray-600 mb-4">
            Drawer를 여러 높이로 고정할 수 있습니다. 스냅 포인트는{' '}
            <strong>화면 높이 기준</strong>입니다.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900 font-medium mb-2">
              📏 <strong>스냅 포인트 기준:</strong>
            </p>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>• 0.3 (30%) = Drawer가 화면 높이의 30%만큼 보임</li>
              <li>• 0.6 (60%) = Drawer가 화면 높이의 60%만큼 보임</li>
              <li>
                • 1.0 (100%) = Drawer가 화면 전체 높이만큼 보임 (완전
                열림)
              </li>
            </ul>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              💡 <strong>테스트 방법:</strong> Drawer를 드래그하여
              놓으면 자동으로 가장 가까운 스냅 포인트로 부드럽게
              이동합니다. 빠르게 드래그하면 관성(momentum)이
              반영됩니다.
            </p>
          </div>

          <div className="space-y-4">
            {/* 3.1 비제어 스냅 포인트 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                3.1 비제어 스냅 포인트 (드래그 테스트)
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                snapPoints={`{[0.25, 0.5, 0.9]}`} - 3개의 스냅
                포인트를 드래그로 테스트
              </p>
              <Drawer snapPoints={[0.25, 0.5, 0.9]}>
                <Drawer.Trigger className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  스냅 포인트 Drawer 열기
                </Drawer.Trigger>
                <Drawer.Overlay />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    스냅 포인트 드래그 테스트
                  </h3>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-indigo-900 font-medium">
                      🎯 25%, 50%, 90% 높이로 자동 고정됩니다
                    </p>
                    <p className="text-xs text-indigo-700 mt-1">
                      드래그 핸들을 잡고 위아래로 드래그해보세요!
                    </p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    드래그하면 자동으로 가장 가까운 스냅 포인트로
                    이동합니다. 빠르게 드래그하면 속도(velocity)가
                    반영되어 더 먼 스냅 포인트로 이동할 수 있습니다.
                  </p>
                  <div className="h-96 overflow-y-auto">
                    <p className="mb-4">스크롤 가능한 콘텐츠</p>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <p key={i} className="py-2 border-b">
                        항목 {i + 1}
                      </p>
                    ))}
                  </div>
                </Drawer.Content>
              </Drawer>
            </div>

            {/* 3.2 제어 스냅 포인트 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                3.2 제어 스냅 포인트 (프로그래밍 방식 + 드래그)
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                activeSnapPoint + onSnapPointChange - 외부 버튼과
                드래그 모두 지원
              </p>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-indigo-900 mb-2">
                  현재 스냅 포인트: 인덱스 {snapIndex} (
                  {[0.3, 0.6, 1][snapIndex] * 100}%)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSnapIndex(0)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                  >
                    30%
                  </button>
                  <button
                    onClick={() => setSnapIndex(1)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                  >
                    60%
                  </button>
                  <button
                    onClick={() => setSnapIndex(2)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                  >
                    100%
                  </button>
                </div>
              </div>

              <Drawer
                snapPoints={[0.3, 0.6, 1]}
                activeSnapPoint={snapIndex}
                onSnapPointChange={setSnapIndex}
              >
                <Drawer.Trigger className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  제어 스냅 포인트 열기
                </Drawer.Trigger>
                <Drawer.Overlay />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    제어 스냅 포인트 테스트
                  </h3>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-indigo-900 font-medium">
                      현재: {[30, 60, 100][snapIndex]}%
                    </p>
                  </div>
                  <p className="text-gray-600 mb-4">
                    🔹 외부 버튼으로 스냅 포인트를 프로그래밍 방식으로
                    제어할 수 있습니다.
                  </p>
                  <p className="text-gray-600 mb-4">
                    🔹 드래그로 스냅 포인트를 변경하면
                    onSnapPointChange 콜백이 호출되어 외부 상태가
                    동기화됩니다.
                  </p>
                  <p className="text-sm text-gray-500">
                    Drawer를 드래그해보고, 외부 버튼도 클릭해보세요!
                  </p>
                </Drawer.Content>
              </Drawer>
            </div>
          </div>
        </section>

        {/* 4. DrawerSnap 컴포넌트 테스트 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            4. DrawerSnap 컴포넌트
          </h2>
          <p className="text-gray-600 mb-4">
            각 스냅 포인트마다 다른 콘텐츠를 선언적으로 표시할 수
            있습니다.
          </p>

          <Drawer snapPoints={[0.3, 0.6, 1]}>
            <Drawer.Trigger className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
              DrawerSnap 테스트
            </Drawer.Trigger>
            <Drawer.Overlay />
            <Drawer.Content className="max-w-md mx-auto">
              <Drawer.Snap index={0}>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    🌸 30% 높이
                  </h3>
                  <p className="text-gray-600">
                    짧은 미리보기 콘텐츠입니다.
                  </p>
                </div>
              </Drawer.Snap>

              <Drawer.Snap index={1}>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    💙 60% 높이
                  </h3>
                  <p className="text-gray-600 mb-4">
                    중간 길이 콘텐츠입니다.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>항목 1</li>
                    <li>항목 2</li>
                    <li>항목 3</li>
                  </ul>
                </div>
              </Drawer.Snap>

              <Drawer.Snap index={2}>
                <div className="p-4 bg-green-50 rounded-lg h-full overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-2">
                    💚 100% 높이
                  </h3>
                  <p className="text-gray-600 mb-4">
                    전체 높이 콘텐츠입니다.
                  </p>
                  <div className="space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="border-b pb-2">
                        <h4 className="font-medium">섹션 {i + 1}</h4>
                        <p className="text-sm text-gray-600">
                          긴 콘텐츠 섹션입니다...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Drawer.Snap>
            </Drawer.Content>
          </Drawer>
        </section>

        {/* 5. Position 옵션 테스트 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            5. Position 옵션
          </h2>
          <p className="text-gray-600 mb-4">
            Drawer를 다양한 위치에서 열 수 있습니다.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Bottom */}
            <Drawer position="bottom">
              <Drawer.Trigger className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full">
                ⬇️ Bottom (기본)
              </Drawer.Trigger>
              <Drawer.Overlay />
              <Drawer.Content className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4">
                  Bottom Drawer
                </h3>
                <p className="text-gray-600">아래에서 올라옵니다.</p>
                <Drawer.Items>확인</Drawer.Items>
              </Drawer.Content>
            </Drawer>

            {/* Top */}
            <Drawer position="top">
              <Drawer.Trigger className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full">
                ⬆️ Top
              </Drawer.Trigger>
              <Drawer.Overlay />
              <Drawer.Content className="max-w-md mx-auto rounded-t-none rounded-b-3xl">
                <h3 className="text-lg font-semibold mb-4">
                  Top Drawer
                </h3>
                <p className="text-gray-600">위에서 내려옵니다.</p>
                <Drawer.Items>확인</Drawer.Items>
              </Drawer.Content>
            </Drawer>

            {/* Left */}
            <Drawer position="left">
              <Drawer.Trigger className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-full">
                ⬅️ Left
              </Drawer.Trigger>
              <Drawer.Overlay />
              <Drawer.Content className="h-full w-80">
                <h3 className="text-lg font-semibold mb-4">
                  Left Drawer
                </h3>
                <p className="text-gray-600 mb-4">
                  왼쪽에서 나타납니다.
                </p>
                <nav className="space-y-2">
                  <a
                    href="#"
                    className="block px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    메뉴 1
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    메뉴 2
                  </a>
                </nav>
              </Drawer.Content>
            </Drawer>

            {/* Right */}
            <Drawer position="right">
              <Drawer.Trigger className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 w-full">
                ➡️ Right
              </Drawer.Trigger>
              <Drawer.Overlay />
              <Drawer.Content className="h-full w-80">
                <h3 className="text-lg font-semibold mb-4">
                  Right Drawer
                </h3>
                <p className="text-gray-600">
                  오른쪽에서 나타납니다.
                </p>
                <Drawer.Items>확인</Drawer.Items>
              </Drawer.Content>
            </Drawer>
          </div>
        </section>

        {/* 6. 기타 옵션 테스트 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            6. 기타 옵션
          </h2>

          <div className="space-y-4">
            {/* dismissible=false */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                6.1 dismissible=false (드래그로 닫기 불가)
              </h3>
              <Drawer dismissible={false}>
                <Drawer.Trigger className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  dismissible=false
                </Drawer.Trigger>
                <Drawer.Overlay />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    드래그로 닫을 수 없습니다
                  </h3>
                  <p className="text-gray-600 mb-4">
                    아래로 드래그해도 닫히지 않습니다. 버튼을
                    클릭하거나 배경을 클릭하세요.
                  </p>
                  <Drawer.Items>닫기 버튼</Drawer.Items>
                </Drawer.Content>
              </Drawer>
            </div>

            {/* modal=false */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                6.2 modal=false (배경 클릭으로 닫기 불가)
              </h3>
              <Drawer modal={false}>
                <Drawer.Trigger className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                  modal=false
                </Drawer.Trigger>
                <Drawer.Overlay />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    배경 클릭으로 닫을 수 없습니다
                  </h3>
                  <p className="text-gray-600 mb-4">
                    배경을 클릭해도 닫히지 않습니다. 버튼을 클릭하거나
                    드래그하세요.
                  </p>
                  <Drawer.Items>닫기 버튼</Drawer.Items>
                </Drawer.Content>
              </Drawer>
            </div>
          </div>
        </section>

        {/* 7. asChild 패턴 테스트 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            7. asChild 패턴
          </h2>
          <p className="text-gray-600 mb-4">
            커스텀 컴포넌트를 Trigger로 사용할 수 있습니다 (button
            중첩 방지).
          </p>

          <Drawer>
            <Drawer.Trigger asChild>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 shadow-lg">
                🎨 커스텀 버튼 (asChild)
              </button>
            </Drawer.Trigger>
            <Drawer.Overlay />
            <Drawer.Content className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4">
                asChild 패턴
              </h3>
              <p className="text-gray-600 mb-4">
                asChild를 사용하여 커스텀 버튼을 Trigger로
                사용했습니다.
              </p>
              <Drawer.Items>확인</Drawer.Items>
            </Drawer.Content>
          </Drawer>
        </section>

        {/* 7. 접근성 (Accessibility) 테스트 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            7. 접근성 (Accessibility)
          </h2>
          <p className="text-gray-600 mb-4">
            키보드 내비게이션, ARIA 속성, 포커스 트랩을 테스트합니다.
          </p>

          <div className="space-y-4">
            {/* 포커스 트랩 테스트 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                7.1 포커스 트랩 (Focus Trap)
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Tab 키로 Drawer 내부를 순환합니다. ESC 키로 닫을 수
                있습니다.
              </p>
              <Drawer>
                <Drawer.Trigger className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  접근성 테스트 열기
                </Drawer.Trigger>
                <Drawer.Overlay />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    접근성 테스트
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tab 키를 눌러 아래 요소들을 순환해보세요. 마지막
                    요소에서 Tab을 누르면 첫 요소로 돌아갑니다.
                  </p>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                      첫 번째 버튼
                    </button>
                    <input
                      type="text"
                      placeholder="텍스트 입력"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>옵션 1</option>
                      <option>옵션 2</option>
                    </select>
                    <textarea
                      placeholder="텍스트 영역"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                    />
                    <Drawer.Items>마지막 요소 (닫기)</Drawer.Items>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      💡 <strong>키보드 인터랙션:</strong>
                    </p>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1">
                      <li>• Tab: 다음 요소로 이동</li>
                      <li>• Shift + Tab: 이전 요소로 이동</li>
                      <li>• Escape: Drawer 닫기</li>
                    </ul>
                  </div>
                </Drawer.Content>
              </Drawer>
            </div>

            {/* ARIA 속성 테스트 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                7.2 ARIA 속성 & 스크린 리더
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                role=dialog, aria-modal=true 속성이 적용되어 스크린
                리더와 호환됩니다.
              </p>
              <Drawer>
                <Drawer.Trigger className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  ARIA 테스트
                </Drawer.Trigger>
                <Drawer.Overlay />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    스크린 리더 테스트
                  </h3>
                  <p className="text-gray-600 mb-4">
                    이 Drawer는 role=dialog와 aria-modal=true 속성을
                    가지고 있어 스크린 리더가 모달임을 인식합니다.
                  </p>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                      접근 가능한 버튼
                    </button>
                    <Drawer.Items>닫기</Drawer.Items>
                  </div>
                </Drawer.Content>
              </Drawer>
            </div>

            {/* dismissible=false에서 ESC 비활성화 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                7.3 dismissible=false (ESC 비활성화)
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                dismissible=false일 때는 ESC 키로 닫을 수 없습니다.
              </p>
              <Drawer dismissible={false}>
                <Drawer.Trigger className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  ESC 비활성화 테스트
                </Drawer.Trigger>
                <Drawer.Overlay />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    ESC 키가 작동하지 않습니다
                  </h3>
                  <p className="text-gray-600 mb-4">
                    dismissible=false이므로 ESC 키로 닫을 수 없습니다.
                    아래 버튼이나 배경을 클릭하세요.
                  </p>
                  <Drawer.Items>닫기 버튼으로만 닫기</Drawer.Items>
                </Drawer.Content>
              </Drawer>
            </div>
          </div>
        </section>

        {/* 테스트 완료 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-lg font-semibold text-green-900 mb-2">
            ✅ 모든 Drawer 기능 테스트 완료!
          </p>
          <p className="text-sm text-green-700">
            각 섹션의 버튼을 클릭하여 다양한 Drawer 기능을
            테스트해보세요.
          </p>
        </div>
      </div>
    </div>
  );
}
