import type React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@resume/ui/select";

const fontStyles = [
  "Calibri",
  "Cambria",
  "Georgia",
  "Helvetica",
  "Arial",
  "Times New Roman",
  "Garamond",
  "Palatino",
  "Tahoma",
  "Verdana",
];
interface FontStyleSelectorProps {
  fontStyle: string;
  onFontStyleChange: (fontStyle: string) => void;
}
const FontStyleSelector: React.FC<FontStyleSelectorProps> = ({
  fontStyle,
  onFontStyleChange,
}) => {
  return (
    <Select value={fontStyle} onValueChange={onFontStyleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select font style" />
      </SelectTrigger>
      <SelectContent>
        {fontStyles.map((style) => (
          <SelectItem key={style} value={style} style={{ fontFamily: style }}>
            {style}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export default FontStyleSelector;