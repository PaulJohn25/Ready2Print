import * as pdfjs from "pdfjs-dist";
import PRINT_PRICING from "@/constants/printPricing";
import { PaperType } from "@/types/printSettings";
import { PrintPreferences } from "@/types/printPreferences";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

class PDFUtils {
  static async getTotalPages(file: File): Promise<number> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    return pdf.numPages;
  }

  static calculatePrintCost(file: PrintPreferences): number {
    let printCost: number = 0;

    const paperType: PaperType = file.paperType;
    const price: number = PRINT_PRICING[paperType];
    const totalPages: number = file.totalPages;

    if (file.colorMode === "Colored") {
      file.pagesWithImages.forEach((hasImage) => {
        if (hasImage) {
          printCost += price + 3; // Additional cost for colored images
        } else {
          // pages with no image
          printCost += price; // Regular cost for colored pages without images
        }
      });
    } else {
      // If black and white
      printCost = totalPages * price;
    }

    return printCost * file.copies;
  }

  static calculateTotalPrintCost(files: PrintPreferences[]): number {
    let totalPrintCost = 0;

    files.forEach((file) => (totalPrintCost += file.totalPrintCost));

    return totalPrintCost;
  }

  static async checkIfPagesHaveImages(file: File): Promise<boolean[]> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const numberPages = pdf.numPages;
    const pagesWithImages: boolean[] = [];

    for (let i = 0; i < numberPages; i++) {
      const page = await pdf.getPage(i + 1);
      const operatorList = await page.getOperatorList();

      const hasImage = operatorList.fnArray.some(
        (fn) => fn === pdfjs.OPS.paintImageXObject
      );

      pagesWithImages.push(hasImage);
    }

    return pagesWithImages;
  }
}

export default PDFUtils;
