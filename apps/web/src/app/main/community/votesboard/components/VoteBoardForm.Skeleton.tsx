/**
 * VoteboardForm 로딩 스켈레톤
 *
 * @description
 * VoteboardForm과 최대한 동일한 레이아웃의 로딩 스켈레톤입니다.
 * 각 필드의 정확한 높이, 간격, 스타일을 반영하여 깜빡임(CLS)을 최소화합니다.
 *
 * @remarks
 * - 다크모드 지원
 * - 접근성 속성 포함 (role, aria-label)
 * - 반응형 레이아웃
 * - TODO: 투표 API에 카테고리 스펙이 추가되면,
 *   실제 폼과 함께 이 스켈레톤에도 카테고리 영역을 추가합니다.
 */
export function VoteboardFormSkeleton() {
  return (
    <div
      className="relative flex flex-col h-full w-full"
      role="status"
      aria-label="투표 폼을 불러오는 중..."
    >
      {/* Form 영역 스켈레톤 */}
      <div className="flex flex-col gap-4 w-full flex-1 overflow-auto p-1">
        {/* TODO: 카테고리 필드 스펙이 추가되면, 아래처럼 카테고리 스켈레톤을 함께 추가합니다. */}
        {/*
        <div className="animate-pulse">
          <div className="mb-2 flex items-center gap-1">
            <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="h-3 w-3 bg-red-200 dark:bg-red-900 rounded" />
          </div>
          <div className="h-10 w-full bg-gray-200 dark:bg-neutral-700 rounded-lg" />
        </div>
        */}

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
          {/* TextArea 필드 스켈레톤 (rows={6} 근사) */}
          <div className="relative">
            <div className="h-28 w-full bg-gray-200 dark:bg-neutral-700 rounded-lg" />
            {/* 글자 수 표시 위치 스켈레톤 (있다면 이 위치에 올 것) */}
            <div className="absolute bottom-4 right-4 h-3 w-12 bg-gray-300 dark:bg-neutral-600 rounded" />
          </div>
          {/* Message 영역 (공간 확보) */}
          <div className="mt-1 min-h-[1.25rem]" />
        </div>

        {/* 마감 시간 필드 스켈레톤 */}
        <div className="animate-pulse">
          {/* Label 스켈레톤 */}
          <div className="mb-2 flex items-center gap-1">
            <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="h-3 w-3 bg-red-200 dark:bg-red-900 rounded" />
          </div>
          {/* datetime-local Input 스켈레톤 */}
          <div className="h-10 w-full bg-gray-200 dark:bg-neutral-700 rounded-lg" />
          {/* Message 영역 */}
          <div className="mt-1 min-h-[1.25rem]" />
        </div>

        {/* 투표 옵션 스켈레톤 */}
        <div className="animate-pulse">
          {/* 헤더 (라벨 + 옵션 추가 버튼 자리) */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded" />
              <div className="h-3 w-3 bg-red-200 dark:bg-red-900 rounded" />
            </div>
            <div className="h-3 w-12 bg-gray-200 dark:bg-neutral-700 rounded" />
          </div>
          {/* 옵션 입력 필드 2~3개 정도 */}
          <div className="flex flex-col gap-2">
            <div className="h-10 w-full bg-gray-200 dark:bg-neutral-700 rounded-lg" />
            <div className="h-10 w-full bg-gray-200 dark:bg-neutral-700 rounded-lg" />
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-neutral-700 rounded-lg" />
          </div>
          {/* 전체 에러 메시지 영역 */}
          <div className="mt-1 min-h-[1.25rem]" />
        </div>

        {/* 설정 (복수 선택 / 재투표) 스켈레톤 */}
        <div className="animate-pulse flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 dark:bg-neutral-700 rounded" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded" />
          </div>
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
            <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-neutral-700 rounded-[10px]" />
            {/* 썸네일 자리 1~2개 정도 */}
            <div className="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-[10px]" />
            <div className="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-[10px]" />
          </div>
        </div>
      </div>

      {/* 제출 버튼 스켈레톤 */}
      <div className="absolute bottom-0 w-full animate-pulse">
        <div className="h-12 w-full bg-gray-300 dark:bg-neutral-600 rounded-lg" />
      </div>

      {/* 스크린 리더용 안내 */}
      <span className="sr-only">
        투표 게시글 데이터를 불러오는 중입니다. 잠시만 기다려주세요.
      </span>
    </div>
  );
}
