import { Form } from "@resume/ui/form";
import { Input } from "@resume/ui/input";
import { Button } from "@resume/ui/button";
import { Badge } from "@resume/ui/badge";
import { EditorFormProps } from "utils/types";
import { skillsSchema, SkillsValues } from "utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { X, GripVertical, Plus } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface SkillSectionProps {
  sectionIndex: number;
  id: string;
  form: any;
}

const SkillSection = ({ sectionIndex, id, form }: SkillSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition
  } : undefined;

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    
    const trimmedSkill = newSkill.trim();
    if (!trimmedSkill) return;

    const currentSkills = form.getValues(`skillSections.${sectionIndex}.skills`) || [];
    if (!currentSkills.includes(trimmedSkill)) {
      form.setValue(`skillSections.${sectionIndex}.skills`, [...currentSkills, trimmedSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues(`skillSections.${sectionIndex}.skills`) || [];
    form.setValue(
      `skillSections.${sectionIndex}.skills`,
      currentSkills.filter((skill: string) => skill !== skillToRemove)
    );
  };

  return (
    <div ref={setNodeRef} style={style} className="space-y-3 p-4 rounded-lg border">
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        {isEditing ? (
          <Input
            value={form.getValues(`skillSections.${sectionIndex}.name`)}
            onChange={(e) => form.setValue(`skillSections.${sectionIndex}.name`, e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="text-lg font-semibold"
            autoFocus
          />
        ) : (
          <h3 
            className="text-lg font-semibold hover:bg-muted/50 px-2 py-1 rounded cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {form.getValues(`skillSections.${sectionIndex}.name`)}
          </h3>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {form.getValues(`skillSections.${sectionIndex}.skills`)?.map((skill: string, idx: number) => (
          <Badge key={idx} variant="secondary" className="flex items-center gap-1">
            {skill}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleRemoveSkill(skill)}
            />
          </Badge>
        ))}
        <Input
            placeholder="Add skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleAddSkill}
            className="w-40 p-2"
        />
      </div>

    </div>
  );
};

export default function SkillForm({
  resumeData,
  setResumeData
}: EditorFormProps) {
  const form = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skillSections: resumeData.skillSections || []
    }
  });

  const { fields, append, move } = useFieldArray({
    control: form.control,
    name: "skillSections"
  });

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      setResumeData({
        ...resumeData,
        skillSections: values.skillSections || []
      });
    });
    
    return unsubscribe;
  }, [form, resumeData, setResumeData]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      
      move(oldIndex, newIndex);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">
          Organize your skills into sections.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <SkillSection
                  key={field.id}
                  id={field.id}
                  sectionIndex={index}
                  form={form}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() => append({
                name: "New Section",
                skills: [],
                order: fields.length
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skills Section
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}