import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";
import { PrintPreferences } from "@/types/printPreferences";
import { useState } from "react";

interface CopiesInputProps {
  initialValue: number;
  min: number;
  max: number;
  step: number;
  onChange: <T extends keyof PrintPreferences>(
    field: T,
    value: PrintPreferences[T]
  ) => void;
}

const CopiesInput = ({
  initialValue = 0,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  onChange,
}: CopiesInputProps) => {
  const [value, setValue] = useState<number>(initialValue);

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    setValue(newValue);
    onChange("copies", newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    setValue(newValue);
    onChange("copies", newValue);
  };

  return (
    <div>
      <Label htmlFor="copiesNumber" className="font-montserrat">
        Number of Copies
      </Label>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="w-10"
          onClick={handleDecrement}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          id="copiesNumber"
          type="number"
          min={min}
          max={max}
          value={initialValue}
          className=" w-20 text-center"
          onChange={(e) =>
            onChange("copies", Math.max(1, parseInt(e.target.value) || 1))
          }
          step={step}
        />
        <Button
          variant="outline"
          size="icon"
          className=" w-10"
          onClick={handleIncrement}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CopiesInput;
