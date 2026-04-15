// stores/useSlugStore.ts
import { create } from "zustand";

interface SlugStore {
    slugs: Record<string, string>;
    setSlugs: (slugs: Record<string, string>) => void;
}

export const useSlugStore = create<SlugStore>((set) => ({
    slugs: {},
    setSlugs: (slugs) => set({ slugs }),
}));
