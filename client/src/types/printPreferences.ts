import { PaperType, ColorMode, PrintSide } from "./printSettings";

export interface PrintPreferences {
  file: File;
  id: number;
  preview: string;
  paperType: PaperType;
  colorMode: ColorMode;
  printSide: PrintSide;
  totalPrintCost: number;
  pagesWithImages: boolean[];
  totalPages: number;
  copies: number;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}
