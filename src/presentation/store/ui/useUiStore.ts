import { create } from "zustand";

interface UiState {
  isSidebarOpen: boolean;
  error: string | null;
  success: string | null;
  showChat: boolean;

  setIsSidebarOpen: (open: boolean) => void;
  setError: (msg: string | null) => void;
  setSuccess: (msg: string | null) => void;
  setShowChat: (show: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: false,
  error: null,
  success: null,
  showChat: false,

  setIsSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setError: (msg) => set({ error: msg }),
  setSuccess: (msg) => set({ success: msg }),
  setShowChat: (show) => set({ showChat: show }),
}));
