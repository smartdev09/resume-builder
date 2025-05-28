import { EditorFormProps } from "utils/types";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillForm from "./forms/SkillForm";
import SummaryForm from "./forms/SummaryForm";
import ProjectForm from "./forms/ProjectForm";
import LanguageForm from "./forms/LanguageForm";
import CertificationForm from "./forms/CertificationForm";

export const steps: {
    title: string;
    component: React.ComponentType<EditorFormProps>;
    key: string;
}[] = [
    {   title: 'General Information', 
        component: GeneralInfoForm,
        key: 'general-info',
    }, 
    { 
        title: 'Personal Information', 
        component: PersonalInfoForm,
        key: 'personal-info'
    },
    {
        title: 'Work Experience',
        component: WorkExperienceForm,
        key: 'work-experience',
    },
    { 
        title: 'Education',
        component: EducationForm,
        key: 'education',
    },
    {
        title: 'Skill',
        component: SkillForm,
        key: 'skill',
    },
    {
        title: 'Summary',
        component: SummaryForm,
        key: 'summary',
    },
    {
        title: 'Projects',
        component: ProjectForm,
        key: 'project'
    },
    {
        title: 'Languages',
        component: LanguageForm,
        key: 'language'
    },
    {
        title: 'Certifications',
        component: CertificationForm,
        key: 'certification'
    }
    
]