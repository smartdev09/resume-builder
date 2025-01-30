import { EducationValues } from "utils/validations";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@resume/ui/form";

import { UseFormReturn } from "react-hook-form";
import { GripHorizontal, X } from "lucide-react";
import { Input } from "@resume/ui/input";
import { Button } from "@resume/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import cn from "@resume/ui/cn";
import { CSS } from "@dnd-kit/utilities";


interface EducationItemProps {
    id: string;
    form: UseFormReturn<EducationValues>;
    index: number;
    remove: (index: number) => void;
}

export function EducationItem({ id, form, index, remove }: EducationItemProps) {
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
          "space-y-3 rounded-md border bg-background p-3",
          isDragging && "relative z-50 cursor-grab shadow-xl",
        )}
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      >
        <div className="flex justify-between gap-2">
          <span className="font-semibold">Education {index + 1}</span>
          <GripHorizontal
            className="size-5 cursor-grab text-muted-foreground focus:outline-none"
            {...attributes}
            {...listeners}
          />
        </div>
        <FormField
          control={form.control}
          name={`educations.${index}.degree`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree</FormLabel>
              <FormControl>
                <Input {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`educations.${index}.school`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>School</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name={`educations.${index}.startDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    value={field.value?.slice(0, 10)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`educations.${index}.endDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    value={field.value?.slice(0, 10)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button variant="destructive" type="button" onClick={() => remove(index)}>
          Remove
        </Button>
      </div>
    );
  }