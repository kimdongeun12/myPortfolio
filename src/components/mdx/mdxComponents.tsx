import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { toAssetUrl } from '@/lib/api-url';

type CalloutType = 'info' | 'tip' | 'warn';

const CALLOUT_ICON: Record<CalloutType, string> = { info: 'ℹ️', tip: '💡', warn: '⚠️' };

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

function MdxImage({ src, alt, ...rest }: ComponentPropsWithoutRef<'img'>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...rest} src={typeof src === 'string' ? toAssetUrl(src) : src} alt={alt ?? ''} loading='lazy' />;
}

function MdxLink({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...rest} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  );
}

export function Badge({ children }: { children?: ReactNode }) {
  return <span className='section-badge'>{children}</span>;
}

export function Result({ label = '성과', children }: { label?: string; children?: ReactNode }) {
  return (
    <p className='section-result'>
      <span className='label'>{label}</span>
      {children}
    </p>
  );
}

export const mdxComponents = {
  img: MdxImage,
  a: MdxLink,
  Callout,
  Badge,
  Result,
};
