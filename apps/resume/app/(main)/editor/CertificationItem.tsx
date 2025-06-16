import { Button } from "@resume/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@resume/ui/form";
import { Input } from "@resume/ui/input";
import { UseFormReturn } from "react-hook-form";
import { useSortable } from "@dnd-kit/sortable";
import { GripHorizontal, X } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import cn from "@resume/ui/cn";
import { CertificationValues } from "utils/validations";

interface CertificationItemProps {
  id: string;
  form: UseFormReturn<CertificationValues>;
  index: number;
  remove: (index: number) => void;
}

export default function CertificationItem({
  id,
  form,
  index,
  remove,
}: CertificationItemProps) {
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
        <span className="font-semibold">Certification {index + 1}</span>
        <GripHorizontal
          {...attributes}
          {...listeners}
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
        />
      </div>

      <FormField
        control={form.control}
        name={`certifications.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Certificate Name</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`certifications.${index}.source`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Issuing Organization</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`certifications.${index}.completionDate`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Completion Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                value={field.value?.slice(0, 10)}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`certifications.${index}.link`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Credential URL</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="url"
                placeholder="https://example.com/certificate"
              />
            </FormControl>
            <FormDescription>
              Optional link to verify the certification
            </FormDescription>
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