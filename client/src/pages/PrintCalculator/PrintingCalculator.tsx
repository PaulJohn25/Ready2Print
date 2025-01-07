import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LoadingSpinner,
  FileEditDialog,
  UploadedFiles,
} from "@/components/custom";
import { Button } from "@/components/ui/button";
import { Printer, Upload, Shield } from "lucide-react";
import { PrintPreferences } from "@/types/printPreferences";
import { PrintSide, ColorMode, PaperType } from "@/types/printSettings";
import PDFUtils from "@/pdf-utils/pdfUtils";
import { useNavigate } from "react-router-dom";
import usePrintStore from "@/stores/printStore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PrintingCalculator = () => {
  const { files, setFiles, addFile, deleteFile } = usePrintStore();
  const [fileBeingEdited, setFileBeingEdited] =
    useState<PrintPreferences | null>(null);
  const [isEditFileDialogOpen, setIsEditFileDialogOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      event.target.files &&
      event.target.files[0].type === "application/pdf"
    ) {
      setIsAnalyzing(true); // Start analyzing the PDF
      try {
        const file: File = event.target.files[0];

        const pages = await PDFUtils.getTotalPages(file); // Get total pages
        const pagesWithImages = await PDFUtils.checkIfPagesHaveImages(file); // Check if pages have images

        console.log(pagesWithImages);

        const newFile = {
          file: file,
          id: files.length + 1,
          preview: URL.createObjectURL(file),
          paperType: "A4" as PaperType,
          colorMode: "Black & White" as ColorMode,
          printSide: "One Sided" as PrintSide,
          totalPrintCost: 0,
          pagesWithImages: pagesWithImages,
          totalPages: pages,
          copies: 1,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };

        const totalPrintCost: number = PDFUtils.calculatePrintCost(newFile);

        newFile.totalPrintCost = totalPrintCost;

        addFile(newFile); // Add new files
        toast({
          variant: "success",
          title: "File Successfully Uploaded!",
          description: `${event.target.files[0].name} has been successfully uploaded.`,
        });
      } catch (error) {
        console.error("Error analyzing the PDF:", error); // Log any errors
        toast({
          title: "Error Analyzing File!",
          description: "An error occurred while analyzing the PDF.",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false); // End analyzing, no matter what
      }
    } else {
      toast({
        title: "File Selection Error!",
        description: "Please select a valid PDF file.",
        variant: "destructive",
      });
    }
  };

  const handleFieldChange = <T extends keyof PrintPreferences>(
    field: T,
    value: PrintPreferences[T]
  ) => {
    if (fileBeingEdited) {
      const updatedFile = { ...fileBeingEdited, [field]: value };

      switch (field) {
        case "paperType":
          updatedFile.totalPrintCost = PDFUtils.calculatePrintCost(updatedFile);
          break;
        case "colorMode":
          updatedFile.totalPrintCost = PDFUtils.calculatePrintCost(updatedFile);
          break;
        case "printSide":
          updatedFile.totalPrintCost = PDFUtils.calculatePrintCost(updatedFile);
          break;
        case "copies":
          updatedFile.totalPrintCost = PDFUtils.calculatePrintCost(updatedFile);
          break;
        default:
          break;
      }

      setFileBeingEdited(updatedFile);
    }
  };

  const handleEditFile = (file: PrintPreferences) => {
    setFileBeingEdited({ ...file });
    setIsEditFileDialogOpen(true);
  };

  const applyChanges = () => {
    if (fileBeingEdited) {
      const updatedFiles = files.map((file) =>
        file.id === fileBeingEdited.id ? { ...fileBeingEdited } : file
      );
      setFiles(updatedFiles);
      setFileBeingEdited(null);
    }
  };

  const handleDeleteFile = (file: PrintPreferences) => {
    deleteFile(file);
    URL.revokeObjectURL(file.preview);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className=" bg-white shadow-xl rounded-none">
        <CardHeader className="bg-slate-700">
          <CardTitle className="font-bold flex items-center gap-3 text-xl text-white capitalize font-montserrat select-none">
            <Printer className="w-8 h-8 lg:w-10 lg:h-10" />
            PrintCost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mt-4">
            <Shield className="h-4 w-4" />
            <AlertTitle className="font-bold font-montserrat text-sm">
              Your Files Are Safe
            </AlertTitle>
            <AlertDescription className="font-montserrat text-xs">
              Your files are encrypted, processed securely, and deleted
              automatically after printing.
            </AlertDescription>
          </Alert>
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mt-4 border-gray-300 hover:border-blue-600 hover:bg-blue-50"
            onClick={(e) => isAnalyzing && e.preventDefault()}
          >
            <input
              disabled={isAnalyzing}
              type="file"
              onChange={async (e) => await handleFileSelect(e)}
              accept=".pdf"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-1 md:gap-2 select-none"
            >
              <Upload className="w-9 h-9 md:w-12 md:h-12 mx-auto text-blue-800" />
              <p className="text-sm font-extrabold text-blue-800 font-montserrat">
                Click to select files
              </p>
              <p className="text-xs text-gray-500 font-medium font-montserrat">
                Only <strong>PDF</strong> files are accepted
              </p>
            </label>
          </div>

          {isAnalyzing ? (
            <LoadingSpinner textIndicator="Analyzing PDF File..." />
          ) : (
            files.length > 0 && (
              <UploadedFiles
                title="Uploaded Files:"
                files={files}
                onFileEdit={handleEditFile}
                onFileDelete={handleDeleteFile}
              />
            )
          )}
        </CardContent>
        <CardFooter className="flex items-end flex-col bg-blue-50 p-6 gap-4">
          <Button
            className="w-full sm:w-auto bg-slate-800 text-sm font-bold hover:bg-slate-700 font-montserrat"
            disabled={files.length === 0 || isAnalyzing}
            onClick={() => navigate("/print-files")}
          >
            Print Files
          </Button>
        </CardFooter>
      </Card>
      <FileEditDialog
        open={isEditFileDialogOpen}
        onOpenChange={setIsEditFileDialogOpen}
        onApplyChanges={applyChanges}
        onFieldChange={handleFieldChange}
        file={fileBeingEdited}
      />
    </div>
  );
};

export default PrintingCalculator;
