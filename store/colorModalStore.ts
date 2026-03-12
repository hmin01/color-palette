import { create } from "zustand";
import type { PantoneColor } from "@/data/pantone-colors";

type ColorModalState = {
  isOpen: boolean;
  selectedColor: PantoneColor | null;
  open: (color: PantoneColor) => void;
  close: () => void;
};

export const useColorModalStore = create<ColorModalState>((set) => ({
  isOpen: false,
  selectedColor: null,
  open: (color) => set({ isOpen: true, selectedColor: color }),
  close: () => set({ isOpen: false }),
}));
