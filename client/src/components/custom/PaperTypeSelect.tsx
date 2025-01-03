import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PaperType } from "@/types/printSettings";
import { PrintPreferences } from "@/types/printPreferences";

interface PaperTypeSelectProps {
  value: PaperType;
  onValueChange: <T extends keyof PrintPreferences>(
    field: T,
    value: PrintPreferences[T]
  ) => void;
}

const PaperTypeSelect = ({ value, onValueChange }: PaperTypeSelectProps) => {
  return (
    <>
      <div>
        <Label htmlFor="paperType" className="font-montserrat">
          Paper Type
        </Label>
        <Select
          value={value}
          onValueChange={(value: PaperType) =>
            onValueChange("paperType", value)
          }
        >
          <SelectTrigger id="paperType">
            <SelectValue placeholder="Select paper type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A4">A4</SelectItem>
            <SelectItem value="Letter">Letter (Short)</SelectItem>
            <SelectItem value="Legal">Legal (Long)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default PaperTypeSelect;
