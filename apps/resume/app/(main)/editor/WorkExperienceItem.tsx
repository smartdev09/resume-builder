import { Button } from "@resume/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@resume/ui/form";
import { Input } from "@resume/ui/input";
import { Textarea } from "@resume/ui/textarea";
import { WorkExperienceValues } from "utils/validations"
import { useSortable } from "@dnd-kit/sortable";
import { GripHorizontal, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form"
import { CSS } from "@dnd-kit/utilities"
import cn from "@resume/ui/cn";

interface WorkExperienceItemProps {
    id: string;
    form: UseFormReturn<WorkExperienceValues>;
    index: number;
    remove: (index: number) => void;
}

export default function WorkExperienceItem({ id, form, index, remove }: WorkExperienceItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

    return (
        <div 
            className={cn("space-y-3 border rounded-md bg-background p-3", isDragging && "shadow-xl z-50 cursor-grab relative")}
            ref={setNodeRef} 
            style={{ transform: CSS.Transform.toString(transform), transition}} 
        >
            <div className="flex justify-between gap-2">
                <span className="font-semibold">
                    Work Experience { index + 1}
                </span>
                <GripHorizontal {...attributes} {...listeners} className="size-5 cursor-grab text-muted-foreground focus:outline-none" />
            </div>
            <FormField
                control={form.control}
                name={`workExperiences.${index}.position`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Position
                        </FormLabel>
                        <FormControl>
                            <Input {...field} autoFocus />
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`workExperiences.${index}.company`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Company
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
                    name={`workExperiences.${index}.startDate`}
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
                    name={`workExperiences.${index}.endDate`}
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
                Leave <span className="font-semibold">end date</span > empty if you are currently working here.
            </FormDescription>

            <FormField
                control={form.control}
                name={`workExperiences.${index}.description`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Description
                        </FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                    </FormItem>
                )}
            />

            <Button variant="destructive" type="button" onClick={() => remove(index)}>
                <X />
                Remove
            </Button>

        </div>
    )
}