'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { useUiStore } from '@/providers/ui-store-provider';

export default function Wrap({ children }: { children: ReactNode }) {
  const isWindowOpen = useUiStore((state) => state.isWindowOpen);
  // 인트로(스크롤 잠금)는 비주얼이 있는 홈에서만 → 다른 페이지로 바로 들어와도 스크롤 가능
  const isHome = usePathname() === '/';

  return (
    <div id="wrap" className={clsx({ open: isWindowOpen, loading: isHome && !isWindowOpen })}>
      {children}
    </div>
  );
}
