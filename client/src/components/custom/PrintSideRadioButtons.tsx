import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PrintSide } from "@/types/printSettings";
import { PrintPreferences } from "@/types/printPreferences";

interface PrintSideRadioButtonsProps {
  value: PrintSide;
  onValueChange: <T extends keyof PrintPreferences>(
    field: T,
    value: PrintPreferences[T]
  ) => void;
}

const PrintSideRadioButtons = ({
  value,
  onValueChange,
}: PrintSideRadioButtonsProps) => {
  return (
    <>
      <div>
        <Label className="font-montserrat">Print Sides:</Label>
        <RadioGroup
          value={value}
          onValueChange={(value: PrintSide) =>
            onValueChange("printSide", value)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="One Sided" id="printOneSided" />
            <Label htmlFor="printOneSided">
              Print One Sided (Only Front Side)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Both Sides" id="printOnBothSides" />
            <Label htmlFor="printOnBothSides">
              Print on Both Sides (Double Sided)
            </Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
};

export default PrintSideRadioButtons;
