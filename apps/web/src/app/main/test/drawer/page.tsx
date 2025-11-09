'use client';

import { useState } from 'react';
import { Drawer } from '@/components/Drawer';
import { useOverlay } from '@/hooks/ui/useOverlay';

/**
 * Drawer 컴포넌트 테스트 페이지
 *
 * 테스트 항목:
 * 1. 비제어 모드 (Uncontrolled Mode)
 * 2. 제어 모드 (Controlled Mode)
 * 3. Position 옵션 (bottom, top, left, right)
 * 4. 기타 옵션 (dismissible, modal)
 * 5. useOverlay() 훅과 함께 사용
 */
export default function DrawerTestPage() {
  // 제어 모드 상태
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <div className="min-h-[200vh] bg-gray-50 p-8">
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
                1.2 초기에 열린 상태로 시작 (E2E 테스트를 위해
                닫힘으로 시작)
              </h3>
              <Drawer>
                <Drawer.Trigger className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  초기 열림 Drawer 테스트
                </Drawer.Trigger>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    초기 열림 테스트
                  </h3>
                  <p className="text-gray-600 mb-4">
                    open=true로 설정하면 페이지 로드 시 열립니다.
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative z-[2002]">
              <p className="text-sm font-medium text-blue-900">
                현재 상태: {controlledOpen ? '🟢 열림' : '🔴 닫힘'}
              </p>
            </div>

            {/* 제어 버튼들 */}
            <div className="flex flex-wrap gap-2 relative z-[2002]">
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

        {/* 3. Position 옵션 테스트 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            3. Position 옵션
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
                <p className="text-gray-600">Bottom Position</p>
                <p className="text-gray-600 mb-4">
                  아래에서 올라옵니다.
                </p>
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

        {/* 4. 기타 옵션 테스트 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            4. 기타 옵션
          </h2>

          <div className="space-y-4">
            {/* dismissible=false */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                4.1 dismissible=false (드래그로 닫기 불가)
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

        {/* 8. 스크롤 처리 테스트 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            8. 스크롤 처리 (Scroll Handling)
          </h2>
          <p className="text-gray-600 mb-4">
            Drawer 내부 스크롤과 드래그의 조화를 테스트합니다. (Vaul
            방식)
          </p>

          <div className="space-y-4">
            {/* 긴 콘텐츠 스크롤 테스트 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                8.1 스크롤 가능한 긴 콘텐츠
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                스크롤이 맨 위일 때만 드래그 가능합니다. 스크롤을
                아래로 내린 후 드래그하면 작동하지 않습니다.
              </p>
              <Drawer>
                <Drawer.Trigger className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  긴 콘텐츠 Drawer 열기
                </Drawer.Trigger>
                <Drawer.Overlay />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    스크롤 테스트
                  </h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-900">
                      💡 <strong>테스트 방법:</strong>
                    </p>
                    <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                      <li>1. 핸들을 드래그 → 작동함 (스크롤 top)</li>
                      <li>2. 콘텐츠를 아래로 스크롤</li>
                      <li>
                        3. 다시 핸들 드래그 → 작동 안함 (스크롤 중)
                      </li>
                      <li>4. 스크롤을 맨 위로 올림</li>
                      <li>5. 다시 핸들 드래그 → 작동함</li>
                    </ul>
                  </div>

                  <div className="h-[400px] overflow-y-auto space-y-4">
                    {Array.from({ length: 20 }, (_, i) => (
                      <div
                        key={i}
                        className="p-4 bg-gray-100 rounded-lg"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">
                          항목 {i + 1}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          이 콘텐츠를 스크롤할 수 있습니다. 스크롤이
                          맨 위가 아닐 때는 드래그가 작동하지
                          않습니다.
                        </p>
                      </div>
                    ))}
                  </div>

                  <Drawer.Items className="mt-4">닫기</Drawer.Items>
                </Drawer.Content>
              </Drawer>
            </div>

            {/* 중첩 스크롤 테스트 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                8.2 중첩 스크롤 영역
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                여러 스크롤 영역이 있을 때 각각의 스크롤 위치를
                체크합니다.
              </p>
              <Drawer>
                <Drawer.Trigger className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                  중첩 스크롤 테스트
                </Drawer.Trigger>
                <Drawer.Overlay />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    중첩 스크롤 영역
                  </h3>
                  <p className="text-gray-600 mb-4">
                    내부에 독립적인 스크롤 영역이 있습니다.
                  </p>

                  <div className="space-y-4">
                    <div className="border border-gray-300 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                      <h4 className="font-semibold mb-2">
                        독립 스크롤 영역 1
                      </h4>
                      {Array.from({ length: 10 }, (_, i) => (
                        <p
                          key={i}
                          className="text-sm text-gray-600 mb-2"
                        >
                          스크롤 항목 {i + 1}
                        </p>
                      ))}
                    </div>

                    <div className="border border-gray-300 rounded-lg p-4 max-h-[200px] overflow-y-auto">
                      <h4 className="font-semibold mb-2">
                        독립 스크롤 영역 2
                      </h4>
                      {Array.from({ length: 10 }, (_, i) => (
                        <p
                          key={i}
                          className="text-sm text-gray-600 mb-2"
                        >
                          스크롤 항목 {i + 1}
                        </p>
                      ))}
                    </div>
                  </div>

                  <Drawer.Items className="mt-4">닫기</Drawer.Items>
                </Drawer.Content>
              </Drawer>
            </div>

            {/* scrollLockTimeout 테스트 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                8.3 scrollLockTimeout (500ms)
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                스크롤 후 500ms 동안은 드래그가 차단됩니다.
              </p>
              <Drawer>
                <Drawer.Trigger className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  scrollLockTimeout 테스트
                </Drawer.Trigger>
                <Drawer.Overlay />
                <Drawer.Content className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-4">
                    스크롤 락 타임아웃 테스트
                  </h3>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-orange-900">
                      🕐 <strong>타이밍 테스트:</strong>
                    </p>
                    <ul className="text-sm text-orange-800 mt-2 space-y-1">
                      <li>1. 콘텐츠를 빠르게 스크롤</li>
                      <li>
                        2. 즉시 핸들 드래그 시도 → 차단됨 (500ms 이내)
                      </li>
                      <li>3. 0.5초 대기</li>
                      <li>4. 다시 드래그 시도 → 작동함</li>
                    </ul>
                  </div>

                  <div className="h-[350px] overflow-y-auto space-y-3">
                    {Array.from({ length: 15 }, (_, i) => (
                      <div
                        key={i}
                        className="p-3 bg-gray-100 rounded-lg"
                      >
                        <p className="text-sm text-gray-700">
                          스크롤 항목 {i + 1} - 빠르게 스크롤한 후
                          즉시 드래그해보세요
                        </p>
                      </div>
                    ))}
                  </div>

                  <Drawer.Items className="mt-4">닫기</Drawer.Items>
                </Drawer.Content>
              </Drawer>
            </div>
          </div>
        </section>

        {/* 5. useOverlay 통합 테스트 */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            5. useOverlay() 훅과 함께 사용
          </h2>
          <p className="text-gray-600 mb-4">
            useOverlay() 훅을 사용하면 여러 Overlay를 중앙에서 관리할
            수 있습니다.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900 font-medium mb-2">
              💡 <strong>특징:</strong>
            </p>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>• Z-index 자동 관리</li>
              <li>• 중앙 집중식 Overlay 제어</li>
              <li>• Promise 기반 API로 결과값 반환 가능</li>
            </ul>
          </div>

          <OverlayPortalExample />
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

/**
 * OverlayPortal 사용 예시 컴포넌트
 */
function OverlayPortalExample() {
  const overlay = useOverlay();

  const handleOpenDrawer = () => {
    overlay.open(({ close }) => (
      <Drawer
        open={true}
        onOpenChange={(open) => !open && close(null)}
      >
        <Drawer.Overlay />
        <Drawer.Content className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">
            useOverlay로 열린 Drawer
          </h3>
          <p className="text-gray-600 mb-4">
            이 Drawer는 useOverlay() 훅과 OverlayPortal을 통해
            렌더링됩니다.
          </p>
          <div className="space-y-2">
            <Drawer.Items onClick={() => close('confirmed')}>
              확인 (결과값 반환)
            </Drawer.Items>
            <Drawer.Items onClick={() => close(null)}>
              닫기
            </Drawer.Items>
          </div>
        </Drawer.Content>
      </Drawer>
    ));
  };

  const handleOpenWithResult = async () => {
    const result = await overlay.open<boolean>(({ close }) => (
      <Drawer
        open={true}
        onOpenChange={(open) => !open && close(false)}
      >
        <Drawer.Overlay />
        <Drawer.Content className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">
            결과값을 반환하는 Drawer
          </h3>
          <p className="text-gray-600 mb-4">
            사용자의 선택을 Promise로 받을 수 있습니다.
          </p>
          <div className="space-y-2">
            <Drawer.Items
              onClick={() => close(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              예 (true 반환)
            </Drawer.Items>
            <Drawer.Items
              onClick={() => close(false)}
              className="bg-red-600 hover:bg-red-700"
            >
              아니오 (false 반환)
            </Drawer.Items>
          </div>
        </Drawer.Content>
      </Drawer>
    ));

    alert(`사용자가 선택한 값: ${result}`);
  };

  return (
    <div className="space-y-4">
      {/* 5.1 기본 사용 */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">
          5.1 기본 사용 (Promise API)
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          overlay.open() 함수로 Drawer를 열고, close 콜백으로
          닫습니다.
        </p>
        <button
          onClick={handleOpenDrawer}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          useOverlay로 Drawer 열기
        </button>
      </div>

      {/* 5.2 결과값 반환 */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">
          5.2 결과값 반환 (Promise 기반)
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          사용자의 선택을 Promise로 받아 처리할 수 있습니다.
        </p>
        <button
          onClick={handleOpenWithResult}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          결과값 받는 Drawer 열기
        </button>
      </div>

      {/* OverlayPortal은 layout.tsx에 전역으로 추가되어 있습니다 */}
    </div>
  );
}
