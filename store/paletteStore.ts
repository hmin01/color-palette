import { create } from "zustand";
import type { ColorDto } from "@/types/color";

// 팔레트 최대 색상 수
const MAX_PALETTE_SIZE = 7;

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
    // 최대 개수 초과 또는 중복 색상은 추가하지 않음
    if (colors.length >= MAX_PALETTE_SIZE || colors.some((c) => c.id === color.id)) return;
    set({ colors: [...colors, color] });
  },

  remove: (id) =>
    set((s) => ({ colors: s.colors.filter((c) => c.id !== id) })),

  clear: () => set({ colors: [] }),

  has: (id) => get().colors.some((c) => c.id === id),
}));
