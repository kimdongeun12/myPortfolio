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
  defaultUiState,
  type UiState,
  type UiStore,
} from '@/stores/ui-store';

type UiStoreApi = ReturnType<typeof createUiStore>;

const UiStoreContext = createContext<UiStoreApi | null>(null);

type UiStoreProviderProps = {
  children: ReactNode;
  initialState?: Partial<UiState>;
};

export function UiStoreProvider({
  children,
  initialState,
}: UiStoreProviderProps) {
  // Provider 인스턴스가 유지되는 동안 같은 Store 사용
  const [store] = useState(() =>
    createUiStore({ ...defaultUiState, ...initialState }),
  );

  return (
    <UiStoreContext.Provider value={store}>
      {children}
    </UiStoreContext.Provider>
  );
}

// store 인스턴스 자체가 필요할 때 (getState, setState, subscribe)
export function useUiStoreApi(): UiStoreApi {
  const store = useContext(UiStoreContext);

  if (!store) {
    throw new Error(
      'useUiStore는 UiStoreProvider 내부에서 사용해야 합니다.',
    );
  }

  return store;
}

// selector로 필요한 값만 구독
export function useUiStore<T>(
  selector: (state: UiStore) => T,
): T {
  const store = useUiStoreApi();
  return useStore(store, selector);
}