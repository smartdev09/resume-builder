import Image from "next/image";
import { useState } from "react";
import cn from "@resume/ui/cn";
import { ResumeValues } from "utils/validations";

interface TemplateSelectorProps {
    className?: string;
    onSelectTemplate: (templateName: string) => void;
    setResumeData: (resumeData: ResumeValues) => void;
    resumeData: ResumeValues
}

const templates = [
  { name: 'faang', src: "/assets/images/faang.png" },
  { name: 'ats-approved', src: "/assets/images/ats-approved.png" },
  { name: 'two-column', src: "/assets/images/two-column.png" },
  { name: 'simple', src: "/assets/images/simple.png" },
  { name: 'diamond', src: "/assets/images/diamond.png" },
  { name: 'it', src: "/assets/images/it.png" },
  { name: 'vibes', src: "/assets/images/vibes.png" },

];

export default function TemplateSelector({
    className,
    onSelectTemplate,
    setResumeData,
    resumeData
}: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(resumeData.selectedTemplate);

  const handleTemplateClick = (templateName: string) => {
    setSelectedTemplate(templateName);
    onSelectTemplate(templateName);
    setResumeData({
        ...resumeData, 
        selectedTemplate: templateName
    })
  };

  return (
    <div
      className={cn(
        `h-full overflow-y-auto p-4  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full`,
        className
      )}
    >
      {/* <h2 className="text-lg mb-4">Choose Template</h2> */}
      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <div
            key={template.name}
            className="cursor-pointer overflow-hidden"
            onClick={() => handleTemplateClick(template.name)}
          >
            <Image
              src={template.src || "/placeholder.svg"}
              alt={template.name}
              width={141}
              height={200}
              className={cn(
                "w-full h-auto",
                selectedTemplate === template.name
                  ? "border-[3.5px] border-blue-500"
                  : "border-transparent"
              )}
            />
            <p className="font-white text-center border-none">
              {template.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}