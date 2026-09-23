import { createStore } from 'zustand/vanilla';


interface UiState {
    selectedProjectId: string | null;
  }
  
  interface UiActions {
    openProjectPanel: (projectId: string) => void;
    closeProjectPanel: () => void;
  }
  
  export type UiStore = UiState & UiActions;
  
  export function createUiStore() {
    return createStore<UiStore>()((set) => ({
      selectedProjectId: null,
  
      openProjectPanel: (projectId) =>
        set({ selectedProjectId: projectId }),
  
      closeProjectPanel: () =>
        set({ selectedProjectId: null }),
    }));
  }