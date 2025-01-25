import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Briefcase,
  GraduationCap,
  Book,
  Globe2,
  Award,
  Heart,
} from "lucide-react";
import useDimensions from "@resume/ui/hooks/use-dimensions";
import cn from "@resume/ui/cn";
import type { ResumeValues } from "utils/validations";
interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}
export default function IT({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-white text-black h-fit w-full aspect-[210/297]",
        className
      )}
    >
      <div
        className={cn("", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <HeaderSection resumeData={resumeData} />
        <ContactSection resumeData={resumeData} />
        <div className="grid grid-cols-[1.6fr_1fr] gap-8 p-8">
          <div className="space-y-8">
            <WorkExperienceSection resumeData={resumeData} />
            <VolunteerSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </div>
          <div className="bg-gray-100 p-6 rounded space-y-8">
            <ExpertiseSection resumeData={resumeData} />
            
            {/* {(resumeData.courses?.length ?? 0) > 0 && (
              <CoursesSection resumeData={resumeData} />
            )}
            {(resumeData.languages?.length ?? 0) > 0 && (
              <LanguagesSection resumeData={resumeData} />
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
interface ResumeSectionProps {
  resumeData: ResumeValues;
}

function SectionIcon({ icon: Icon }: { icon: any }) {
  return (
    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
      <Icon className="w-6 h-6 text-white" />
    </div>
  );
}

function HeaderSection({ resumeData }: ResumeSectionProps) {
  const { firstName, lastName, jobTitle } = resumeData;

  if(!firstName && !lastName && !jobTitle) return; 

  return (
    <header className="p-8 pb-0">
      <h1 className="text-4xl text-gray-800 mb-2">
        {firstName} {lastName}
      </h1>
      <h2 className="text-xl text-[#40C4AA]">{jobTitle}</h2>
    </header>
  );
}

function ContactSection({ resumeData }: ResumeSectionProps) {
  const { email, phone, city, summary,country } = resumeData;

  if(!(email && phone && city && summary && country)) return;

  return (
    <div className="space-y-0 p-2">
      {summary && (
        <div className="bg-[#2D3748] text-white p-4 rounded-lg rounded-b-none">
          <p className="leading-relaxed break-all whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      )}
      <div className="bg-[#40C4AA] text-white mt-6 p-4 flex items-center justify-center gap-8 rounded-b-lg">
        {email && (
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-300 fill-white" />
            <span>{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 fill-white text-gray-200" />
            <span>{phone}</span>
          </div>
        )}
        {(city || country) && (
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 fill-white text-gray-200" />
            <span>
              {city}, {country}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences } = resumeData;

  if(!workExperiences) return;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <SectionIcon icon={Briefcase} />
        <h2 className="text-xl font-bold">WORK EXPERIENCE</h2>
      </div>
      {resumeData.workExperiences?.map((exp, index) => (
        <div key={index} className="mb-6">
          <h3 className="font-bold text-lg">{exp.position}</h3>
          <div className="font-medium mb-1 text-lg">{exp.company}</div>
          <div className="flex justify-between text-[#40C4AA] text-sm mb-2 italic">
            <span>
              {exp.startDate && formatDate(exp.startDate, "MMMM yyyy")} -{" "}
              {exp.endDate ? formatDate(exp.endDate, "MMMM yyyy") : "Present"}
            </span>
            <span>
              {resumeData.city}, {resumeData.country}
            </span>
          </div>
          <ul className="list-disc list-inside marker:text-[#40C4AA] space-y-2 text-gray-600 break-all whitespace-pre-wrap">
            {exp.description?.split("\n").map((item, i) => (
              <li key={i}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}


function VolunteerSection({ resumeData }: ResumeSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <SectionIcon icon={Heart} />
        <h2 className="text-xl font-bold">VOLUNTEER EXPERIENCE</h2>
      </div>
      <div className="mb-6">
        <h3 className="font-bold text-lg">Media Manager</h3>
        <div className="text-[#40C4AA] font-medium mb-1">Meals on Wheels</div>
        <div className="flex justify-between text-gray-600 text-sm mb-2">
          <span>2019 - Present</span>
          <span>San Francisco, CA</span>
        </div>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-[#40C4AA] mt-1.5">•</span>
            <span>
              Hold a volunteer position as a Media Manager, developing &
              implementing all targeted content for various media platforms.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}


function EducationSection({ resumeData }: ResumeSectionProps) {

  const { educations, colorHex } = resumeData;

  const educationsNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationsNotEmpty?.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <SectionIcon icon={GraduationCap} />
        <h2 className="text-xl font-bold">EDUCATION</h2>
      </div>
      {educations?.map((edu, index) => (
        <div key={index}>
          <h3 className="font-bold text-gray-800">{edu.school}</h3>
          <p className="text-gray-700">{edu.degree}</p>
          <p className="text-gray-600 text-sm text-[#40C4AA] italic">
            {edu.startDate && formatDate(edu.startDate, "MMMM yyyy")} -{" "}
            {edu.endDate ? formatDate(edu.endDate, "MMMM yyyy") : "Present"}
          </p>
        </div>
      ))}
    </section>
  );
}

function ExpertiseSection({ resumeData }: ResumeSectionProps) {
  const {skills} = resumeData;

  if (!skills?.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <SectionIcon icon={Award} />
        <h2 className="text-xl font-bold">AREAS OF EXPERTIES</h2>
      </div>
      <ul className="space-y-2">
        {skills &&
          skills.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
      </ul>
    </section>
  );
}

// function CoursesSection({ resumeData }: ResumeSectionProps) {
//   const courses = [
//     {
//       name: "Content Marketing, SEO and PPC (2019)",
//       organization: "SEMRUSH Academy",
//     },
//     {
//       name: "Inbound Marketing & Contextual Marketing (2018)",
//       organization: "HubSpot",
//     },
//     {
//       name: "Email Marketing & Sales Funnels (2018)",
//       organization: "ClickMinded Digital Marketing",
//     },
//     {
//       name: "Google Digital Marketing Courses (2017)",
//       organization: "Digital Garage",
//     },
//   ];
//   return (
//     <section>
//       <div className="flex items-center gap-2 mb-6">
//         <SectionIcon icon={Book} />
//         <h2 className="text-xl font-bold">COURSE & TRAINING</h2>
//       </div>
//       <div className="space-y-3">
//         {courses.map((course, index) => (
//           <div key={index}>
//             <div className="font-medium text-[#40C4AA]">{course.name}</div>
//             <div className="text-sm text-gray-600 italic">
//               {course.organization}
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// function LanguagesSection({ resumeData }: ResumeSectionProps) {
//   const languages = [
//     { name: "English", level: "Native or Bilingual Proficiency" },
//     { name: "Spanish", level: "Full Professional Proficiency" },
//     { name: "Mandarin", level: "Limited Working Proficiency" },
//   ];
//   return (
//     <section>
//       <div className="flex items-center gap-2 mb-6">
//         <SectionIcon icon={Globe2} />
//         <h2 className="text-xl font-bold">LANGUAGES</h2>
//       </div>
//       <div className="space-y-3">
//         {languages.map((lang, index) => (
//           <div key={index}>
//             <div className="font-medium">{lang.name}</div>
//             <div className="text-sm text-[#40C4AA]">{lang.level}</div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }