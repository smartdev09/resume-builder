import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@resume/ui/form"
import { useForm } from "react-hook-form"

import { personalInfoSchema, PersonalInfoValues } from "utils/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@resume/ui/input"
import { useEffect, useRef } from "react"
import { EditorFormProps } from "utils/types"
import { Button } from "@resume/ui/button"

export default function PersonalInfoForm({
    resumeData, 
    setResumeData
} : EditorFormProps) {
    const fields = [{ name: "firstName", label: 'First Name', type: "text", placeholder: "John" }, { name: 'lastName', label: 'Last Name', type: "text", placeholder: 'Doe' }, {name: 'email', label: 'Email', type: "email", placeholder: 'resume@gmail.com' }, { name: 'phone', label: 'Phone', type: "tel", placeholder: '+44312131223' }, { name: 'jobTitle', label: 'Job Title', type: "text", placeholder: 'Software Engineer' }, { name: 'city', label: 'City', type: "text", placeholder: 'Austin' }, { name: 'country', label: 'Country', type: "text", placeholder: 'USA' } ]
    
    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            firstName: resumeData.firstName || "",
            lastName: resumeData.lastName || "",
            jobTitle: resumeData.jobTitle || "",
            email: resumeData.email || "",
            city: resumeData.city || "",
            country:resumeData.country || "",
            phone: resumeData.phone || "",
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

    const photoInputRef = useRef<HTMLInputElement>(null);
    
    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">
                    Personal Info
                </h2>
                <p className="text-sm text-muted-foregroun">
                    Tell us about yourself.
                </p>
            </div>  
            <Form {...form}>
                <form className="space-y-3">
                    <FormField
                        control={form.control}
                        name="photo"
                        render={({ field: { value, ...fieldValues} }) => (
                            <FormItem>
                                <FormLabel>Your photo</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Input 
                                                {...fieldValues}
                                                type="file"
                                                accept="image/*" 
                                                placeholder="My resume" 
                                                autoFocus 
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    fieldValues.onChange(file)
                                                }}
                                                ref={photoInputRef}
                                            />
                                        </FormControl>
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            onClick={() => {
                                                fieldValues.onChange(null);
                                                if(photoInputRef.current) {
                                                    photoInputRef.current.value = "";
                                                }
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                <FormMessage /> 
                            </FormItem>
                        )}
                    />

                    {fields && fields.map(({ name, label, type, placeholder }, index) => (
                        <FormField
                            key={index}
                            control={form.control}
                            name={name as keyof Omit<PersonalInfoValues, "photo">}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input {...field} type={type} placeholder={placeholder} />
                                    </FormControl>
                                    <FormMessage /> 
                                </FormItem>
                            )}
                        />
                    ))}

                </form>
            </Form>
        </div>
    )
}