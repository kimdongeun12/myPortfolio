'use client';

import { Select } from 'antd';
import { useEffect, useState } from 'react';

import { fetchTechStacks } from '../api/common';

type TechStackSelectProps = {
  /** Form.Item 이 자동으로 넣어주는 값 */
  value?: string[];
  onChange?: (value: string[]) => void;
};

/**
 * 기술 스택 입력 (기존 목록에서 고르거나 새로 입력)
 * 새 이름은 저장할 때 백엔드에서 자동 등록됩니다.
 */
export default function TechStackSelect({ value, onChange }: TechStackSelectProps) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchTechStacks()
      .then((list) => setOptions(list.map(({ name }) => ({ value: name, label: name }))))
      .catch(() => setOptions([]));
  }, []);

  return (
    <Select
      mode='tags'
      value={value}
      onChange={onChange}
      options={options}
      tokenSeparators={[',']}
      placeholder='예: React, TypeScript (Enter 또는 , 로 추가)'
      maxTagCount='responsive'
    />
  );
}
