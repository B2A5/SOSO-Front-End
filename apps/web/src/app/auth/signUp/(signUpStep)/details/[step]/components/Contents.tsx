'use client';
import React, { useState } from 'react';
import contentsData from '../../contentsData';
import ContentButton from './ContentButton';
import type {
  SignupStep,
  StepRequestMap,
} from '@/hooks/useSignupStep';

interface ContentProps<Step extends SignupStep> {
  step: Step;
  // 단일 선택 시 string, 다중 선택 시 string[] 전달
  onSelected: (value: StepRequestMap[Step]) => void;
}

export default function Content<Step extends SignupStep>({
  step,
  onSelected,
}: ContentProps<Step>) {
  //  해당 스텝의 설정 가져오기
  const { title, contents, multiple } = contentsData[step];

  //  선택된 항목을 저장
  const [selected, setSelected] = useState<string[]>([]);

  //  클릭 시 단일/다중 로직 적용
  const handleClicked = (item: string) => {
    let updatedSelection: string[];

    if (multiple) {
      //이미 있으면 제거, 없으면 추가
      const isSelected = selected.includes(item);
      updatedSelection = isSelected
        ? selected.filter((i) => i !== item)
        : [...selected, item];
      setSelected(updatedSelection);
      onSelected(updatedSelection as StepRequestMap[Step]);
    }
    // 단일 선택인 경우
    else {
      // 클릭한 항목만 배열에 담고 부모에 문자열로 전달
      updatedSelection = [item];
      setSelected(updatedSelection);
      onSelected(item as StepRequestMap[Step]);
    }
  };

  return (
    <div className="w-full flex-col items-start justify-start">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="flex flex-col gap-6">
        {contents.map((item, idx) => (
          <ContentButton
            key={idx}
            content={item}
            selected={selected.includes(item)}
            onClick={handleClicked}
          />
        ))}
      </div>
    </div>
  );
}
