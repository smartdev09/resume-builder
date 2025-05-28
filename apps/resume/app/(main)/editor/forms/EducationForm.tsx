import { EditorFormProps } from "utils/types";
import { Form } from "@resume/ui/form"
import { educationSchema, EducationValues } from "utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@resume/ui/button";
import { Plus } from "lucide-react";
import { EducationItem } from "../EducationItem";

export default function EducationForm({ 
    resumeData, 
    setResumeData
}: EditorFormProps) {

    const form = useForm<EducationValues>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            educations: resumeData.educations || []
        }
    })

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;
            setResumeData({ 
                ...resumeData, 
                educations: values?.educations?.filter((education) => education !== undefined) || [] })
        })
        
        return unsubscribe;
    }, [form, resumeData, setResumeData])

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "educations"
    })

    
    return (
        <div className="p-4 space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">
                    Education 
                </h2>
                <p className="text-sm text-muted-foregroun">
                    Add as many educations as you like.
                </p>
            </div>

            <Form {...form}>
                <form className="space-y-3">
                    {fields && fields.map((field, index) => (
                        <EducationItem 
                            key={field.id}
                            index={index}
                            form={form}
                            remove={remove}
                            id={field.id}

                        />

                    ))}
                    <div className="flex justify-center">
                        <Button 
                            type="button"
                            onClick={() => append({
                                degree: "",
                                school: "",
                                startDate: "",
                                endDate: "",
                            })}
                        >
                            <Plus />
                            Add education
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}