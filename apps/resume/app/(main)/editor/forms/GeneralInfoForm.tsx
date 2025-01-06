import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@resume/ui/form"
import { useForm } from "react-hook-form"

import { Input } from "@resume/ui/input"
import { generalInfoSchema, GeneralInfoValues } from "utils/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { EditorFormProps } from "utils/types"
import { useEffect } from "react"

export default function GeneralFormSchema ({
    resumeData, 
    setResumeData
} : EditorFormProps
) {
    const form = useForm<GeneralInfoValues>({
        resolver: zodResolver(generalInfoSchema),
        defaultValues: {
            title: resumeData.title || "",
            description: resumeData.description || "",
        }
    })

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
            const isValid = await form.trigger();
            if(!isValid) return;
            setResumeData({ ...resumeData, ...values })
        })
        
        return unsubscribe;
    }, [form, resumeData, setResumeData])
    
    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">
                    General Info
                </h2>
                <p className="text-sm text-muted-foregroun">
                    These information will never appear on your resume
                </p>
            </div>
            <Form {...form}>
                <form className="space-y-3">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="My resume" autoFocus />
                                </FormControl>
                                <FormMessage /> 
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="A resume for applying to Google" />
                                </FormControl>
                                <FormDescription>
                                    Describe what this resume if for
                                </FormDescription>
                                <FormMessage /> 
                            </FormItem>
                        )}
                    />
                </form>
            </Form>

        </div>
    )
}