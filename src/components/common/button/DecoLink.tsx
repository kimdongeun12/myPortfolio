import Link from 'next/link';
import clsx from 'clsx';
import type { ReactNode } from 'react';

type DecoLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * 호버하면 테두리가 그려지는 링크 버튼 (.btn-link, 스타일은 default.scss)
 */
export default function DecoLink({ href, children, className }: DecoLinkProps) {
  return (
    <Link className={clsx('btn-link', className)} href={href}>
      <span className="deco top" />
      {children}
      <span className="deco bottom" />
    </Link>
  );
}
