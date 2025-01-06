import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatDate } from "date-fns"

import useDimensions from "@resume/ui/hooks/use-dimensions";

import cn from "@resume/ui/cn";
import { ResumeValues } from "utils/validations"
import { Badge } from "@resume/ui/badge";
import { BorderStyles } from "app/(main)/editor/BorderStyleButton";

interface ResumePreviewProps {
    resumeData: ResumeValues;
    contentRef?: React.Ref<HTMLDivElement>;
    className?: string;
}

export default function ResumePreview({
    resumeData, 
    contentRef,
    className
}: ResumePreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const { width } = useDimensions(containerRef);

    return (
        <div ref={containerRef} className={cn("bg-white text-black h-fit w-full aspect-[210/297]", className)}>
            <div
                className={cn("space-y-6 p-6", !width && "invisble")} 
                style={{
                    zoom: (1/794 * width) // 794 pixels in 210mm width
                }}
                ref={contentRef}
                id="resumePreviewContent"
            >
                <PersonalInfoHeader resumeData={resumeData} />
                <SummarySection resumeData={resumeData} />
                <WorkExperienceSection resumeData={resumeData} />
                <EducationSection resumeData={resumeData} />
                <SkillsSection resumeData={resumeData} />
            </div>
        </div>
    )
}


interface ResumeSectionProps {
    resumeData: ResumeValues
}

function PersonalInfoHeader({resumeData} : ResumeSectionProps) {
    const { firstName, lastName, jobTitle, city, country, phone, photo, email, colorHex, borderStyle }  = resumeData;

    const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo)

    useEffect(() => {
        const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
        if(objectUrl) {
            setPhotoSrc(objectUrl);
        } 

        if(photo === null) setPhotoSrc(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [photo])

    return (
        <div className="flex items-center gap-6">
            {photoSrc && (
                <Image
                    src={photoSrc}
                    width={100}
                    height={100}
                    alt="Main photo"
                    className="aspect-square object-cover"
                    style={{ 
                        borderRadius: borderStyle === BorderStyles.SQUARE ? "0px" : borderStyle === BorderStyles.CIRCLE ? "999px" : "10%"
                    }}
                />
            )}

            <div className="space-t-2.5">
                <div className="space-y-1">
                    <p 
                        style={{ color: colorHex }} 
                        className="text-3xl font-bold"
                    >
                        {firstName} {lastName}
                    </p>
                    <p 
                        style={{ color: colorHex }} 
                        className="font-medium"
                    >
                        {jobTitle}
                    </p>
                </div>
                <p className="text-xs text-gray-500">
                    {city}
                    {city && country ? ", " : ""}
                    {country}
                    {(city || country) && (phone || email) ? <span>&#x2022;</span> : ""}
                    {[phone, email].filter(Boolean).join("•")}
                </p> 
            </div>
        </div>
    )

}

function SummarySection({resumeData}: ResumeSectionProps) {
    const { summary, colorHex } = resumeData;

    if(!summary) return null;

    return (
        <div>
            <hr 
                style={{ color: colorHex }} 
                className="border-2" 
            />
            <div className="space-y-3 break-inside-avoid">
                <p 
                    className="text-lg font-semibold whitespace-pre-line"
                    style={{ 
                        color: colorHex 
                    }} 
                >
                    Professional summary
                </p>
                <div className="whitespace-pre-line text-sm">{summary}</div>
            </div>
        </div>
    )
}

function WorkExperienceSection({resumeData} : ResumeSectionProps) {
    const { workExperiences, colorHex } = resumeData;
    
    const workExperiencesNotEmpty = workExperiences?.filter((exp) => Object.values(exp).filter(Boolean).length > 0);

    if(!workExperiencesNotEmpty?.length) return null;
    
    return (
        <div>
            <hr className="border-2" />
            <div className="space-y-3">
                <p 
                    className="text-lg font-semibold"
                    style={{ color: colorHex }} 
                >
                    Work experience
                </p>
                {workExperiencesNotEmpty && workExperiencesNotEmpty.map((exp, index) => (
                    <div key={index} className="break-inside-avoid space-y-1">
                        <div className="flex items-center justify-between text-sm font-semibold">
                            <span>{exp.position}</span>
                            {exp.startDate && (
                                <span>
                                    {formatDate(exp.startDate, 'MM/yyy')} - {""}
                                    {exp.endDate ? (
                                        formatDate(exp.endDate, "MM/yyyy")
                                    ) : "Present"}
                                </span>
                            )}
                            <p className="text-xs font-semibold">{exp.company}</p>
                            <div className="whitespace-pre-line text-xs">
                                {exp.description}    
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function EducationSection({resumeData} : ResumeSectionProps) {
    const { educations, colorHex } = resumeData;
    
    const educationsNotEmpty = educations?.filter((education) => Object.values(education).filter(Boolean).length > 0);

    if(!educationsNotEmpty?.length) return null;
    
    return (
        <div>
            <hr className="border-2" />
            <div className="space-y-3">
                <p 
                    className="text-lg font-semibold"                         
                    style={{ color: colorHex }} 
                >
                    Education
                </p>
                {educationsNotEmpty && educationsNotEmpty.map((education, index) => (
                    <div key={index} className="break-inside-avoid space-y-1">
                        <div className="flex items-center justify-between text-sm font-semibold">
                            <span>{education.degree}</span>
                            {education.startDate && (
                                <span>
                                    {formatDate(education .startDate, 'MM/yyy')} - {""}
                                    {education .endDate ? (
                                        formatDate(education .endDate, "MM/yyyy")
                                    ) : "Present"}
                                </span>
                            )}
                            <p className="text-xs font-semibold">{education.school}</p>
                         
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function SkillsSection({resumeData} : ResumeSectionProps) {
    const { skills, colorHex } = resumeData;
    
    if(!skills) return null;
    
    return (
        <div>
            <hr                         
                style={{ color: colorHex }} 
                className="border-2" 
            />
            <div className="break-inside-avoid space-y-3">
                <p className="text-lg font-semibold">Skills</p>
                    {skills && skills.map((skill, index) => (
                        <Badge key={index} className="bg-black text-white rounded-md hover:bg-black">
                            {skill}
                        </Badge>
                    ))}
            </div>
        </div>
    )
}