
'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useStore } from 'zustand';

import {
  createUiStore,
  type UiStore,
} from '@/stores/ui-store';

type UiStoreApi = ReturnType<typeof createUiStore>;

const UiStoreContext = createContext<UiStoreApi | null>(null);

export function UiStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Provider 인스턴스가 유지되는 동안 같은 Store 사용
  const [store] = useState(() => createUiStore());

  return (
    <UiStoreContext.Provider value={store}>
      {children}
    </UiStoreContext.Provider>
  );
}

export function useUiStore<T>(
  selector: (state: UiStore) => T,
): T {
  const store = useContext(UiStoreContext);

  if (!store) {
    throw new Error(
      'useUiStore는 UiStoreProvider 내부에서 사용해야 합니다.',
    );
  }

  return useStore(store, selector);
}