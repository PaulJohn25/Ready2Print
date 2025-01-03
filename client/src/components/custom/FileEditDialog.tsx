import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { PrintPreferences } from "@/types/printPreferences";
import { Button } from "@/components/ui/button";
import {
  CopiesInput,
  PrintSideRadioButtons,
  ColorModeRadioButtons,
  PaperTypeSelect,
} from "./index";

interface FileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: PrintPreferences | null;
  onFieldChange: <T extends keyof PrintPreferences>(
    field: T,
    value: PrintPreferences[T]
  ) => void;
  onApplyChanges: () => void;
}

const FileEditDialog = ({
  open,
  onOpenChange,
  file,
  onFieldChange,
  onApplyChanges,
}: FileEditDialogProps) => {
  if (!file) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-slate-800 font-bold tracking-tight leading-3 mt-5 text-md text-start font-montserrat">
              Document Print Preferences:
            </DialogTitle>
            <DialogDescription className="tracking-tight text-sm leading-4 text-start">
              Adjust the settings for your print job to match your preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-1">
            <div className="flex flex-col items-start mb-2">
              <h3 className="font-semibold text-slate-800 text-sm font-montserrat">
                File Name:{" "}
              </h3>
              <p className="font-normal text-sm">{file.name}</p>
            </div>
            <div className="flex items-start mb-2 gap-1">
              <h3 className="font-semibold text-slate-800 text-sm font-montserrat">
                Pages:{" "}
              </h3>
              <p className="font-normal text-sm">{file.totalPages}</p>
            </div>
            <div className="mt-2 grid grid-cols-2 sm:flex-row gap-4">
              <PaperTypeSelect
                value={file.paperType}
                onValueChange={onFieldChange}
              />
              <CopiesInput
                min={1}
                max={100}
                step={1}
                initialValue={file.copies}
                onChange={onFieldChange}
              />
              <ColorModeRadioButtons
                value={file.colorMode}
                onValueChange={onFieldChange}
              />
              <PrintSideRadioButtons
                value={file.printSide}
                onValueChange={onFieldChange}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="sm:w-auto w-full text-sm font-bold font-montserrat"
              >
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="w-full sm:w-auto bg-slate-800 text-sm font-bold hover:bg-slate-700 font-montserrat"
              onClick={() => {
                onApplyChanges();
                onOpenChange(false);
              }}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileEditDialog;
