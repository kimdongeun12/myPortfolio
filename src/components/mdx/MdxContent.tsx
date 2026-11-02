'use client';

import '@/styles/mdx.scss';

import { evaluate, type EvaluateOptions } from '@mdx-js/mdx';
import clsx from 'clsx';
import type { MDXComponents } from 'mdx/types';
import { useEffect, useState, type ComponentType } from 'react';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';

import { mdxComponents } from './mdxComponents';

type MdxModuleContent = ComponentType<{ components?: MDXComponents }>;

type MdxContentProps = {
  source: string;
  className?: string;
  /** 문법 오류 표시 여부 (어드민 미리보기에서만 true) */
  showError?: boolean;
};

const EVALUATE_OPTIONS = {
  ...runtime,
  development: false,
  remarkPlugins: [remarkGfm], // 표, 체크박스, 취소선 등 (GFM)
} as unknown as EvaluateOptions;

/**
 * MDX 문자열을 화면에 렌더링
 * - 문법 오류가 나면 마지막으로 성공한 결과를 유지하고 오류만 표시합니다.
 * - MDX 는 코드가 실행되는 형식이라, 관리자가 작성한 내용만 렌더링해야 합니다.
 */
export default function MdxContent({ source, className, showError = false }: MdxContentProps) {
  const [Content, setContent] = useState<MdxModuleContent | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    evaluate(source, EVALUATE_OPTIONS)
      .then((mod) => {
        if (cancelled) return;
        // 함수형 업데이트로 넘기지 않으면 React 가 컴포넌트를 업데이트 함수로 착각함
        setContent(() => mod.default as MdxModuleContent);
        setError('');
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  return (
    <div className={clsx('mdx-content', className)}>
      {showError && error && (
        <pre className='mdx-error' role='alert'>
          MDX 문법 오류: {error}
        </pre>
      )}
      {Content && <Content components={mdxComponents} />}
    </div>
  );
}
