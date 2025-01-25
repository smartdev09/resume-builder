import { EditorFormProps } from "utils/types";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillForm from "./forms/SkillForm";
import SummaryForm from "./forms/SummaryForm";
import ArcadeIcon from "components/ArcadeIcon";
import DashboardIcon from "components/DashboardIcon";
import EducationIcon from "components/EducationIcon";
import { SummaryIcon } from "components/SummaryIcon";

export const steps: {
    title: string;
    component: React.ComponentType<EditorFormProps>;
    key: string;
    icon: React.ComponentType<any>
}[] = [
    {   title: 'General Information', 
        component: GeneralInfoForm,
        key: 'general-info',
        icon: ArcadeIcon
    }, 
    { 
        title: 'Personal Information', 
        component: PersonalInfoForm,
        key: 'personal-info',
        icon: ArcadeIcon
    },
    {
        title: 'Work Experience',
        component: WorkExperienceForm,
        key: 'work-experience',
        icon: DashboardIcon
    },
    { 
        title: 'Education',
        component: EducationForm,
        key: 'education',
        icon: EducationIcon
    },
    {
        title: 'Skill',
        component: SkillForm,
        key: 'skill',
        icon: ArcadeIcon
    },
    {
        title: 'Summary',
        component: SummaryForm,
        key: 'summary',
        icon: ArcadeIcon
    }
]