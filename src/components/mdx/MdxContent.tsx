import '@/styles/mdx.scss';

import { evaluate, type EvaluateOptions } from '@mdx-js/mdx';
import clsx from 'clsx';
import type { ComponentType } from 'react';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';

import { rehypeHeadingIds } from './headings';
import { mdxComponents } from './mdxComponents';

type MdxModuleContent = ComponentType<{ components?: typeof mdxComponents }>;

const EVALUATE_OPTIONS = {
  ...runtime,
  development: false,
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeHeadingIds],
} as unknown as EvaluateOptions;

type MdxContentProps = {
  source: string | null | undefined;
  className?: string;
};

const compile = async (source: string): Promise<MdxModuleContent | null> => {
  try {
    return (await evaluate(source, EVALUATE_OPTIONS)).default as unknown as MdxModuleContent;
  } catch {
    return null;
  }
};

export default async function MdxContent({ source, className }: MdxContentProps) {
  if (!source?.trim()) return null;

  const Content = await compile(source);
  if (!Content) {
    return (
      <div className={clsx('mdx-content', 'is-plain', className)}>
        <p>{source}</p>
      </div>
    );
  }

  return (
    <div className={clsx('mdx-content', className)}>
      <Content components={mdxComponents} />
    </div>
  );
}
