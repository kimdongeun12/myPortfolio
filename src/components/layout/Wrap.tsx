'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

import { useUiStore } from '@/providers/ui-store-provider';

export default function Wrap({ children }: { children: ReactNode }) {
  const isWindowOpen = useUiStore((state) => state.isWindowOpen);

  return (
    <div id="wrap" className={clsx({ open: isWindowOpen, loading: !isWindowOpen })}>
      {children}
    </div>
  );
}
