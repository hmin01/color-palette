import { create } from "zustand";
import type { ColorDto } from "@/types/color";

type PaletteStore = {
  colors: ColorDto[];
  add: (color: ColorDto) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

export const usePaletteStore = create<PaletteStore>((set, get) => ({
  colors: [],

  add: (color) => {
    const { colors } = get();
    // 중복 색상은 추가하지 않음
    if (colors.some((c) => c.id === color.id)) return;
    set({ colors: [...colors, color] });
  },

  remove: (id) =>
    set((s) => ({ colors: s.colors.filter((c) => c.id !== id) })),

  clear: () => set({ colors: [] }),

  has: (id) => get().colors.some((c) => c.id === id),
}));
