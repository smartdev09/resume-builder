import { EditorFormProps } from "utils/types";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillForm from "./forms/SkillForm";
import SummaryForm from "./forms/SummaryForm";

export const steps: {
    title: string;
    component: React.ComponentType<EditorFormProps>;
    key: string;
}[] = [
    {   title: 'General Information', 
        component: GeneralInfoForm,
        key: 'general-info'
    }, 
    { 
        title: 'Personal Information', 
        component: PersonalInfoForm,
        key: 'personal-info'
    },
    {
        title: 'Work Experience',
        component: WorkExperienceForm,
        key: 'work-experience'
    },
    { 
        title: 'Education',
        component: EducationForm,
        key: 'education'
    },
    {
        title: 'Skill',
        component: SkillForm,
        key: 'skill'
    },
    {
        title: 'Summary',
        component: SummaryForm,
        key: 'summary'
    }
]