import { create } from "zustand";
import type { ColorDto } from "@/types/color";

type ColorModalState = {
  isOpen: boolean;
  selectedColor: ColorDto | null;
  open: (color: ColorDto) => void;
  close: () => void;
};

export const useColorModalStore = create<ColorModalState>((set) => ({
  isOpen: false,
  selectedColor: null,
  open: (color) => set({ isOpen: true, selectedColor: color }),
  close: () => set({ isOpen: false }),
}));
