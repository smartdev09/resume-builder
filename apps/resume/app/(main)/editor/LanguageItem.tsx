import { Button } from "@resume/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@resume/ui/form";
import { Input } from "@resume/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@resume/ui/select";
import { LanguageValues } from "utils/validations";
import { useSortable } from "@dnd-kit/sortable";
import { GripHorizontal, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CSS } from "@dnd-kit/utilities";
import cn from "@resume/ui/cn";

interface LanguageItemProps {
  id: string;
  form: UseFormReturn<LanguageValues>;
  index: number;
  remove: (index: number) => void;
}

const proficiencyLevels = [
  { value: "native", label: "Native or Bilingual" },
  { value: "professional", label: "Professional Working Proficiency" },
];

export default function LanguageItem({
  id,
  form,
  index,
  remove,
}: LanguageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      className={cn(
        "space-y-3 border rounded-md bg-background p-3",
        isDragging && "shadow-xl z-50 cursor-grab relative"
      )}
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Language {index + 1}</span>
        <GripHorizontal
          {...attributes}
          {...listeners}
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
        />
      </div>

      <FormField
        control={form.control}
        name={`languages.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g., English, Spanish, Mandarin"
                autoFocus
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`languages.${index}.proficiency`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Proficiency Level</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {proficiencyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        <X />
        Remove
      </Button>
    </div>
  );
}