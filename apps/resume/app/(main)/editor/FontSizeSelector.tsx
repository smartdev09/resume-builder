import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@resume/ui/select";
  
  interface FontSizeSelectorProps {
    fontSize: string;
    onFontSizeChange: (size: string) => void;
  }
  
  const fontSizes = ["small", "medium", "large"];
  
  export default function FontSizeSelector({
    fontSize,
    onFontSizeChange,
  }: FontSizeSelectorProps) {
    return (
      <Select value={fontSize} onValueChange={onFontSizeChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Font size" />
        </SelectTrigger>
        <SelectContent>
          {fontSizes.map((size) => (
            <SelectItem key={size} value={size}>
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }