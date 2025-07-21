'use client';
import React, { useCallback, useState } from 'react';
import stepsData from '../stepsData';
import ContentButton from './ContentButton';
import type {
  SignupStep,
  StepRequestMap,
} from '@/hooks/useSignupStep';

interface ContentsProps<Step extends SignupStep> {
  step: Step;
  onSelected: (value: StepRequestMap[Step]) => void;
}

export default function Contents<Step extends SignupStep>({
  step,
  onSelected,
}: ContentsProps<Step>) {
  const { title, contents, multiple } = stepsData[step];

  // 내부 선택 상태는 UI 표시용. (서버 전송은 부모에서 함)
  // 단일 선택 : selectedSingle
  const [selectedSingle, setSelectedSingle] = useState<
    StepRequestMap[Step] | undefined
  >(undefined);
  // 다중 선택 : selectedMulti
  const [selectedMulti, setSelectedMulti] = useState<
    StepRequestMap[Step][] // 실제로 다중인 스텝에서만 사용됨
  >([]);

  // 선택된 항목 클릭 시 처리
  const handleClick = useCallback(
    (optionValue: StepRequestMap[Step]) => {
      // 다중 선택 스텝인지 확인
      if (multiple) {
        // 다중 선택 상태 업데이트(이미 선택된 경우 제거, 아니면 추가)
        const exists = selectedMulti.includes(optionValue);
        const updated = exists
          ? selectedMulti.filter((v) => v !== optionValue)
          : [...selectedMulti, optionValue];
        setSelectedMulti(updated);
        // 다중 선택 스텝에서는 배열로 부모에 전달
        onSelected(updated as unknown as StepRequestMap[Step]);
      }
      // 단일 선택 스텝에서는 단일 값으로 부모에 전달
      else {
        setSelectedSingle(optionValue);
        onSelected(optionValue);
      }
    },
    [multiple, onSelected, selectedMulti],
  );

  return (
    <div className="w-full flex-col items-start justify-start animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="flex flex-col gap-6">
        {contents.map(({ label, value }) => {
          const isSel = multiple
            ? selectedMulti.includes(value as StepRequestMap[Step])
            : selectedSingle === value;
          return (
            <ContentButton
              key={String(value)}
              label={label}
              selected={isSel}
              onClick={() =>
                handleClick(value as StepRequestMap[Step])
              }
            />
          );
        })}
      </div>
    </div>
  );
}
