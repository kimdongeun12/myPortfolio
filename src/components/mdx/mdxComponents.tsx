import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';

import { toAssetUrl } from '@/lib/api-url';

type CalloutType = 'info' | 'tip' | 'warn';

const CALLOUT_ICON: Record<CalloutType, string> = { info: 'ℹ️', tip: '💡', warn: '⚠️' };

/**
 * 강조 박스 — MDX 에서 이렇게 사용
 * <Callout type="tip" title="참고">내용</Callout>
 */
export function Callout({ type = 'info', title, children }: { type?: CalloutType; title?: string; children?: ReactNode }) {
  return (
    <aside className={`mdx-callout is-${type}`}>
      <span className='mdx-callout-icon' aria-hidden='true'>
        {CALLOUT_ICON[type] ?? CALLOUT_ICON.info}
      </span>
      <div className='mdx-callout-body'>
        {title && <strong className='mdx-callout-title'>{title}</strong>}
        {children}
      </div>
    </aside>
  );
}

/** 업로드 이미지(/uploads/...)는 백엔드 주소를 붙여서 표시 */
function MdxImage({ src, alt, ...rest }: ComponentPropsWithoutRef<'img'>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...rest} src={toAssetUrl(src)} alt={alt ?? ''} loading='lazy' />;
}

/** 외부 링크는 새 창으로 */
function MdxLink({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...rest} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  );
}

/**
 * MDX 에서 쓸 수 있는 컴포넌트 목록
 * 새 컴포넌트를 쓰고 싶으면 여기에 추가하세요. (어드민 미리보기와 공개 페이지가 같은 목록을 사용)
 */
export const mdxComponents: MDXComponents = {
  img: MdxImage,
  a: MdxLink,
  Callout,
};
