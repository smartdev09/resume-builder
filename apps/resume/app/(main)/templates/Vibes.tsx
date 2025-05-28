
import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import useDimensions from "@resume/ui/hooks/use-dimensions";
import cn from "@resume/ui/cn";
import type { ResumeValues } from "utils/validations";
import { Award, Briefcase, GraduationCap, User } from "lucide-react";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export default function Vibes({
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
        className={cn("p-8", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
          fontFamily: resumeData.fontStyle,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <HeaderSection resumeData={resumeData} />
        <div className="grid grid-cols-[2fr_1fr] gap-8 mt-6">
          <div className="space-y-6">
            <ExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </div>
          <div className="space-y-6">
            <PersonalInfoSection resumeData={resumeData} />
            <SkillsSection resumeData={resumeData} />
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
    <div className="w-6 h-6 bg-[#003366] flex items-center justify-center">
      <Icon className="w-4 h-4 text-white" />
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-gray-200">
      <div className="h-full bg-[#003366]" style={{ width: `${value}%` }} />
    </div>
  );
}

function HeaderSection({ resumeData }: ResumeSectionProps) {
  const {
    firstName,
    lastName,
    jobTitle,
    summary
  } = resumeData;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-[#003366]">{firstName} {lastName}</h1>
      <h2 className="text-xl text-[#003366]">{jobTitle}</h2>
      <p className="text-sm text-gray-700 break-all whitespace-pre-line">
        {summary}
      </p>
    </div>
  );
}

function ExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences } = resumeData;

  if(!workExperiences) return;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
        <SectionIcon icon={Briefcase} />
        <h2 className="text-lg font-bold">Experience</h2>
      </div>
      <div className="space-y-6">
        {resumeData.workExperiences?.map((exp, index) => (
          <div key={index} className="flex">
            <div className="w-24 flex-shrink-0 text-gray-600 text-sm font-bold">
              {exp.startDate && formatDate(exp.startDate, "yyyy-MM")} -{" "}
              {exp.endDate ? formatDate(exp.endDate, "yyyy-MM") : "present"}
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-800">{exp.position}</div>
              <div className="text-gray-600 mb-2">{exp.company}</div>
              <ul className="list-disc ml-5 space-y-2 text-gray-700 break-all whitespace-pre-wrap">
                {exp.description
                  ?.split("\n")
                  .map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        ))}
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
      <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
        <SectionIcon icon={GraduationCap} />
        <h2 className="text-lg font-bold">Education</h2>
      </div>
      {resumeData.educations?.map((edu, index) => (
        <div key={index} className="flex">
          <div className="w-24 flex-shrink-0 text-gray-600 text-sm font-bold">
            {edu.startDate && formatDate(edu.startDate, "yyyy-MM")} -{" "}
            {edu.endDate ? formatDate(edu.endDate, "yyyy-MM") : "present"}
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-800">{edu.school}</div>
            <div className="text-gray-600 mb-2">{edu.degree}</div>
            <ul className="list-disc ml-5 space-y-2 text-gray-700">
              {edu.description
                ?.split("\n")
                .map((item, i) => <li key={i} className="break-all whitespace-pre-wrap">{item}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
}

function PersonalInfoSection({ resumeData }: ResumeSectionProps) {
  const {
    city,
    country,
    phone,
    email
  } = resumeData;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
        <SectionIcon icon={User} />
        <h2 className="text-lg font-bold">Personal Info</h2>
      </div>
      <div className="space-y-4">
          {(city || country)&&(
            <div>
            <h3 className="font-bold mb-1">Address</h3>
          <p className="text-sm text-gray-600">
            {city} {country}
          </p>
        </div>
          )}
          {phone&&(
        <div>
          <h3 className="font-bold mb-1">Phone</h3>
          <p className="text-sm text-gray-600">{phone}</p>
        </div>
          )}
          {email &&(
        <div>
          <h3 className="font-bold mb-1">E-mail</h3>
          <p className="text-sm text-gray-600">{email}</p>
        </div>
          )}
        <div>
          <h3 className="font-bold mb-1">LinkedIn</h3>
          <p className="text-sm text-gray-600">linkedin.com/johniw</p>
        </div>
      </div>
    </section>
  );
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills } = resumeData;

  if (!skills?.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
        <SectionIcon icon={Award} />
        <h2 className="text-lg font-bold">Skills</h2>
      </div>
      <ul className="space-y-1 text-sm">
        {skills && skills.map((skill, index) => <li key={index}>{skill}</li>)}
      </ul>
    </section>
  );
}


// function SoftwareSection({ resumeData }: ResumeSectionProps) {
//   const software = [
//     { name: "Microsoft Project", level: 100 },
//     { name: "Windows Server", level: 80 },
//     { name: "Linux/Unix", level: 80 },
//     { name: "Microsoft Excel", level: 60 },
//   ];
//   return (
//     <section>
//       <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
//         <SectionIcon icon={ComputerIcon} />
//         <h2 className="text-lg font-bold">Software</h2>
//       </div>
//       <div className="space-y-4">
//         {software.map((item, index) => (
//           <div key={index}>
//             <div className="flex flex-col mb-1">
//               <p className="text-sm">{item.name}</p>
//               <ProgressBar value={item.level} />
//               <span className="text-xs text-gray-500 text-end">
//                 {item.level === 100
//                   ? "Excellent"
//                   : item.level === 80
//                     ? "Very Good"
//                     : "Good"}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


// function CertificationsSection({ resumeData }: ResumeSectionProps) {
//   return (
//     <section>
//       <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
//         <SectionIcon icon={Award} />
//         <h2 className="text-lg font-bold">Certifications</h2>
//       </div>
//       <div className="grid grid-cols-[120px_1fr] gap-4">
//         <div className="text-sm text-gray-600">2010-05</div>
//         <div className="text-sm">PMP - Project Management Institute</div>
//         <div className="text-sm text-gray-600">2007-11</div>
//         <div className="text-sm">CAPM - Project Management Institute</div>
//         <div className="text-sm text-gray-600">2003-04</div>
//         <div className="text-sm">PRINCE2® Foundation</div>
//       </div>
//     </section>
//   );
// }


// function InterestsSection({ resumeData }: ResumeSectionProps) {
//   return (
//     <section>
//       <div className="flex items-center gap-2 mb-3 border-b border-gray-300">
//         <SectionIcon icon={Heart} />
//         <h2 className="text-lg font-bold">Interests</h2>
//       </div>
//       <div className="space-y-1">
//         <div className="flex">
//           <div className="w-24 font-bold flex-shrink-0 text-gray-600 text-sm"></div>
//           <ul className="list-disc list-inside text-sm flex-1 list-none">
//             <li>Avid cross country skier and cyclist</li>
//             <li>Member of the Parent Teacher Association</li>
//           </ul>
//         </div>
//       </div>
//     </section>
//   );
// }