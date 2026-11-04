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
  showError?: boolean;
};

const EVALUATE_OPTIONS = {
  ...runtime,
  development: false,
  remarkPlugins: [remarkGfm],
} as unknown as EvaluateOptions;

export default function MdxContent({ source, className, showError = false }: MdxContentProps) {
  const [Content, setContent] = useState<MdxModuleContent | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    evaluate(source, EVALUATE_OPTIONS)
      .then((mod) => {
        if (cancelled) return;
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
