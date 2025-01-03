import { create } from "zustand";
import { PrintPreferences } from "@/types/printPreferences";

interface StoreState {
  files: PrintPreferences[];
  setFiles: (files: PrintPreferences[]) => void;
  addFile: (file: PrintPreferences) => void;
  deleteFile: (file: PrintPreferences) => void;
  clearFiles: () => void;
}

const usePrintStore = create<StoreState>((set) => ({
  files: [],
  setFiles: (files: PrintPreferences[]) => set({ files }),
  addFile: (newFile: PrintPreferences) =>
    set((state) => ({ files: [...state.files, newFile] })),
  deleteFile: (file: PrintPreferences) =>
    set((state) => ({ files: state.files.filter((f) => f.id !== file.id) })),
  clearFiles: () => set({ files: [] }),
}));

export default usePrintStore;
