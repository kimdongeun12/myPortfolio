'use client';

import { Select } from 'antd';
import { useEffect, useState } from 'react';

import { fetchTechStacks } from '../api/common';

type TechStackSelectProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
};

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
