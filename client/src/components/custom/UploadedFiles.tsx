import { PrintPreferences } from "@/types/printPreferences";
import { FileItem } from "./index";

interface UploadedFilesProps {
  files: PrintPreferences[];
  title: string;
  onFileEdit: (file: PrintPreferences) => void;
  onFileDelete: (file: PrintPreferences) => void;
  isSubmitting?: boolean;
}

const UploadedFiles = ({
  files,
  onFileEdit,
  onFileDelete,
  title,
  isSubmitting,
}: UploadedFilesProps) => {
  return (
    <>
      <div className="mt-4" role="group">
        <h3 className="capitalize text-sm font-bold mb-4 text-blue-800 tracking-light font-montserrat select-none">
          {title}
        </h3>
        <div className="overflow-y-auto max-h-32">
          <ul className="space-y-2">
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onEdit={onFileEdit}
                onDelete={onFileDelete}
                isSubmitting={isSubmitting}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default UploadedFiles;
