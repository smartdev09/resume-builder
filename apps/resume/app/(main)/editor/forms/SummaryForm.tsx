'use client'

import { Form, FormControl, FormField, FormItem, FormLabel } from "@resume/ui/form";
import { Textarea } from "@resume/ui/textarea";
import { EditorFormProps } from "utils/types";
import { summarySchema, SummaryValues } from "utils/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { QuillToolbar } from "./QuillToolbar";
import { useForm } from "react-hook-form";
// *************** MODIFICATION START ***************
// app/(main)/editor/forms/SummaryForm.tsx

// ... (existing imports)
import dynamic from "next/dynamic";
import type ReactQuill from "react-quill-new"; // Import type for ref usage
// ...

// 1. Define the type for the component instance that includes the ref
// This cast helps TypeScript treat the result as a component that can accept a ref.
type ReactQuillType = typeof ReactQuill;

// 2. Remove 'forwardRef: true' and cast the result
const ReactQuillNoSSR = dynamic(
    () => import('react-quill-new'),
    { 
        ssr: false, 
        loading: () => <div className="min-h-[150px] p-4 border border-border rounded-md bg-background text-white">Loading editor...</div> 
    }
) as ReactQuillType; // <-- Cast the result type here


// *************** MODIFICATION END ***************

export default function SummaryForm({
    resumeData, 
    setResumeData
} : EditorFormProps) {

    const form = useForm<SummaryValues>({  
        resolver: zodResolver(summarySchema),
        defaultValues: {
            summary: resumeData.summary || ""           
        }
    })
  // Use the type import for the ref
  const quillRef = useRef<ReactQuill | null>(null);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

    useEffect(() => {
        const { unsubscribe } = form.watch(async (values) => {
          const isValid = await form.trigger();
          if (!isValid) return;
          setResumeData({
            ...resumeData,
            ...values,
          });
        });
    
        return unsubscribe;
      }, [form, resumeData, setResumeData]);
    
      const handleFormat = (format: string) => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;
    
        const selection = quill.getSelection();
        if (!selection) return;
    
        if (format === "list") {
          const currentFormat = quill.getFormat(selection);
          quill.format("list", currentFormat.list ? false : "bullet");
        } else {
          const currentFormat = quill.getFormat(selection);
          quill.format(format, !currentFormat[format]);
        }
    
        setTimeout(() => {
          const newFormats = quill.getFormat(quill.getSelection() || undefined);
          setActiveFormats(Object.keys(newFormats));
        }, 0);
      };
    
    return (
        <div className="p-6 space-y-4">
            {/* @ts-ignore */}
        <Form {...form}>
                <form className="space-y-4">
                    <FormField
                       //@ts-ignore
         control={form.control}
                     //@ts-ignore
          name="summary"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Professional Summary
                                </FormLabel>
                                <QuillToolbar
                                    onFormat={handleFormat}
                                    activeFormats={activeFormats}
                                />
                                 <FormControl>
                                        {/* *************** MODIFICATION START: Use the NoSSR component *************** */}
                                        <ReactQuillNoSSR
                                            ref={quillRef}
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="A brief engaging summary about yourself..."
                                            modules={{
                                            toolbar: false,
                                            }}
                                            onChangeSelection={(range) => {
                                            if (!range) return;
                                            const quill = quillRef.current?.getEditor();
                                            if (!quill) return;
                                            const formats = quill.getFormat(range);
                                            setActiveFormats(Object.keys(formats));
                                            }}
                                            className="[&_.ql-container]:border-border [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:text-white [&_.ql-editor]:bg-background [&_.ql-container]:rounded-md [&_.ql-editor]:rounded-md"
                                        />
                                        {/* *************** MODIFICATION END *************** */}

                                    </FormControl>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    )
}