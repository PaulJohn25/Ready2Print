import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColorMode } from "@/types/printSettings";
import { PrintPreferences } from "@/types/printPreferences";

interface ColorModeRadioButtonsProps {
  value: ColorMode;
  onValueChange: <T extends keyof PrintPreferences>(
    field: T,
    value: PrintPreferences[T]
  ) => void;
}

const ColorModeRadioButtons = ({
  value,
  onValueChange,
}: ColorModeRadioButtonsProps) => {
  return (
    <>
      <div>
        <Label className="font-montserrat">Color Mode:</Label>
        <RadioGroup
          value={value}
          onValueChange={(value: ColorMode) =>
            onValueChange("colorMode", value)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Black & White" id="black&white" />
            <Label htmlFor="black&white">Black & White (Text or Image)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Colored" id="colored" />
            <Label htmlFor="colored">Colored (Text or Image)</Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
};

export default ColorModeRadioButtons;
