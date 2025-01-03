import { PrintPreferences } from "@/types/printPreferences";
import { Button } from "@/components/ui/button";
import { X, FileCog } from "lucide-react";

interface FileItemProps {
  file: PrintPreferences;
  onEdit: (file: PrintPreferences) => void;
  onDelete: (file: PrintPreferences) => void;
  isSubmitting?: boolean;
}

const FileItem = ({ file, onEdit, onDelete, isSubmitting }: FileItemProps) => {
  return (
    <>
      <li
        key={file.id}
        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
      >
        <span className="truncate max-w-[60%] text-blue-800 font-medium text-xs font-montserrat">
          {file.name}
        </span>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium text-blue-600 font-montserrat">
            ₱{file.totalPrintCost}.00
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="default"
              size="icon"
              className="text-slate-700 hover:text-slate-800 bg-blue-200 hover:bg-blue-100"
              onClick={() => onEdit(file)}
              disabled={isSubmitting}
            >
              <FileCog className="w-4 h-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={() => onDelete(file)}
              className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </li>
    </>
  );
};

export default FileItem;
