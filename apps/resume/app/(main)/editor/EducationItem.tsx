import { EducationValues } from "utils/validations";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@resume/ui/form";

import { UseFormReturn } from "react-hook-form";
import { GripHorizontal, X } from "lucide-react";
import { Input } from "@resume/ui/input";
import { Button } from "@resume/ui/button";

interface EducationItemProps {
    form: UseFormReturn<EducationValues>;
    index: number;
    remove: (index: number) => void;
}

export default function EducationItem({
    form, 
    index, 
    remove
}: EducationItemProps) {
    return (
        <div className="space-y-3 border rounded-md bg-background p-3">
        <div className="flex justify-between gap-2">
            <span className="font-semibold">
                Education { index + 1}
            </span>
            <GripHorizontal className="size-5 cursor-grab"></GripHorizontal>
        </div>
        <FormField
            control={form.control}
            name={`educations.${index}.degree`}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        Degree
                    </FormLabel>
                    <FormControl>
                        <Input {...field} autoFocus />
                    </FormControl>
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name={`educations.${index}.school`}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        University/School
                    </FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                </FormItem>
            )}
        />

        <div className="grid grid-cols-2 gap-3">
            <FormField
                control={form.control}
                name={`educations.${index}.startDate`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Start Date
                        </FormLabel>
                        <FormControl>
                            <Input type="date" value={field.value?.slice(0,10)} onChange={(e) => field.onChange(e.target.value)} />
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`educations.${index}.endDate`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            End Date
                        </FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>

        <FormDescription>
            Leave <span className="font-semibold">end date</span > empty if you are currently study here.
        </FormDescription>

        <Button variant="destructive" type="button" onClick={() => remove(index)}>
            <X />
            Remove
        </Button>

    </div>
    )
}