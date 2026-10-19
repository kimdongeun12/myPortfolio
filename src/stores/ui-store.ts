import { createStore } from 'zustand/vanilla';

export type UiState = {
  isMenuOpen: boolean;
  isWindowOpen: boolean;
  theme: 'light' | 'dark';
};

export type UiActions = {
  toggleMenu: () => void;
  closeMenu: () => void;
  setTheme: (theme: UiState['theme']) => void;
};

export type UiStore = UiState & UiActions;

export const defaultUiState: UiState = {
  isMenuOpen: false,
  isWindowOpen: false,
  theme: 'light',
};

export const createUiStore = (initState: UiState = defaultUiState) =>
  createStore<UiStore>()((set) => ({
    ...initState,
    openWindowSet: () => { set({isWindowOpen : true})  },
    toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
    closeMenu: () => set({ isMenuOpen: false }),
    setTheme: (theme) => set({ theme }),
}));