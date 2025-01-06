import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@resume/ui/form";
import { Textarea } from "@resume/ui/textarea";
import { EditorFormProps } from "utils/types";
import { skillsSchema, SkillsValues } from "utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Skills({
    resumeData, 
    setResumeData
}: EditorFormProps) {

    const form = useForm<SkillsValues>({  
        resolver: zodResolver(skillsSchema),
        defaultValues: {
            skills: resumeData.skills || []           
        }
    })

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;
            setResumeData({ 
                ...resumeData, 
                skills: values?.skills
                ?.filter((value) => value !== undefined)
                .map((skill) => skill.trim())
                .filter(skill => skill !== "") || []
            })
        })
        
        return unsubscribe;
    }, [form, resumeData, setResumeData])

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">
                    Skills 
                </h2>
                <p className="text-sm text-muted-foregroun">
                    Add as many skills as you like.
                </p>
            </div>

            <Form {...form}>
                <form className="space-y-3">
                    <FormField
                        control={form.control}
                        name="skills"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="sr-only">
                                    Skills
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="eg ReactJs, NextJs..."
                                        onChange={(e) => {
                                            const skills = e.target.value.split(",")
                                            field.onChange(skills);
                                        }}
                                    >

                                    </Textarea>
                                </FormControl>
                                <FormDescription>
                                    Separate each skill with a commna.
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    )
}