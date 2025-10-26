/**
 * FreeboardForm 로딩 스켈레톤
 *
 * @description
 * FreeboardForm과 완전히 동일한 레이아웃의 로딩 스켈레톤입니다.
 * 각 필드의 정확한 높이, 간격, 스타일을 반영하여 깜빡임을 최소화합니다.
 *
 * @remarks
 * - 다크모드 지원
 * - 접근성 속성 포함 (role, aria-label)
 * - 반응형 레이아웃
 */
export function FreeboardFormSkeleton() {
  return (
    <div
      className="relative flex flex-col h-full w-full"
      role="status"
      aria-label="게시글 폼을 불러오는 중..."
    >
      {/* Form 영역 스켈레톤 */}
      <div className="flex flex-col gap-4 w-full flex-1 overflow-auto p-1">
        {/* 카테고리 필드 */}
        <div className="animate-pulse">
          {/* Label 스켈레톤 */}
          <div className="mb-2 flex items-center gap-1">
            <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="h-3 w-3 bg-red-200 dark:bg-red-900 rounded" />
          </div>
          {/* SelectDropdown 스켈레톤 */}
          <div className="h-10 w-full bg-gray-200 dark:bg-neutral-700 rounded-lg" />
        </div>

        {/* 제목 Input 스켈레톤 */}
        <div className="animate-pulse">
          {/* Label 스켈레톤 */}
          <div className="mb-2 flex items-center gap-1">
            <div className="h-4 w-12 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="h-3 w-3 bg-red-200 dark:bg-red-900 rounded" />
          </div>
          {/* Input 필드 스켈레톤 */}
          <div className="h-11 w-full bg-gray-200 dark:bg-neutral-700 rounded-lg" />
          {/* Message 영역 (공간 확보) */}
          <div className="mt-1 min-h-[1.25rem]" />
        </div>

        {/* 내용 TextArea 스켈레톤 */}
        <div className="animate-pulse">
          {/* Label 스켈레톤 */}
          <div className="mb-2 flex items-center gap-1">
            <div className="h-4 w-12 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="h-3 w-3 bg-red-200 dark:bg-red-900 rounded" />
          </div>
          {/* TextArea 필드 스켈레톤 (rows={8} 반영) */}
          <div className="relative">
            <div className="h-32 w-full bg-gray-200 dark:bg-neutral-700 rounded-lg" />
            {/* 글자 수 표시 위치 스켈레톤 */}
            <div className="absolute bottom-4 right-4 h-3 w-12 bg-gray-300 dark:bg-neutral-600 rounded" />
          </div>
          {/* Message 영역 (공간 확보) */}
          <div className="mt-1 min-h-[1.25rem]" />
        </div>

        {/* 이미지 업로더 스켈레톤 */}
        <div className="animate-pulse">
          {/* Label 스켈레톤 */}
          <div className="mb-2">
            <div className="h-4 w-28 bg-gray-200 dark:bg-neutral-700 rounded" />
          </div>
          {/* ImageUploader 영역 스켈레톤 */}
          <div className="flex gap-2 p-2 pl-0">
            {/* 추가 버튼 스켈레톤 */}
            <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-neutral-700 rounded-[10px] flex items-center justify-center"></div>
          </div>
        </div>
      </div>

      {/* 제출 버튼 스켈레톤 */}
      <div className="absolute bottom-0 w-full animate-pulse">
        <div className="h-12 w-full bg-gray-300 dark:bg-neutral-600 rounded-lg" />
      </div>

      {/* 스크린 리더용 안내 */}
      <span className="sr-only">
        게시글 데이터를 불러오는 중입니다. 잠시만 기다려주세요.
      </span>
    </div>
  );
}
