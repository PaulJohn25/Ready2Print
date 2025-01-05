import { File, Copy, Palette, Printer, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PaperType, ColorMode, PrintSide } from "@/types/printSettings";

interface FileDetailsProps {
  file: {
    id: number;
    name: string;
    paperType: PaperType;
    totalPrintCost: number;
    copies: number;
    colorMode: ColorMode;
    printSide: PrintSide;
  };
}

const FileDetailsCard = ({ file }: FileDetailsProps) => {
  return (
    <Card role="group">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            <File className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-base truncate flex-1 font-quicksand">
            {file.name}
          </span>
          <Badge variant="secondary" className="font-bold font-montserrat">
            ₱{file.totalPrintCost}
          </Badge>
        </div>

        <Separator className="mb-4" />

        <ul className="grid grid-cols-2 gap-4 list-none p-0">
          <li className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Paper Type</p>
              <p className="font-medium font-montserrat">
                {file.paperType || "N/A"}
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Copy className="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Copies</p>
              <p className="font-medium font-montserrat">
                {file.copies || "N/A"}
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Palette className="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Color Mode</p>
              <p className="font-medium font-montserrat">
                {file.colorMode || "N/A"}
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <Printer className="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">Print Sides</p>
              <p className="font-medium font-montserrat">
                {file.printSide || "N/A"}
              </p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default FileDetailsCard;
