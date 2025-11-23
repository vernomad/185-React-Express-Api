import { create } from "zustand";

interface PageTimerStore {
  lastSlug: string | null;
  lastStart: number | null;
  setPage: (slug: string) => void;
  clear: () => void;
}

export const usePageTimer = create<PageTimerStore>((set) => ({
  lastSlug: null,
  lastStart: null,

  setPage: (slug) =>
    set({
      lastSlug: slug,
      lastStart: Date.now(),
    }),

  clear: () => set({ lastSlug: null, lastStart: null }),
}));
