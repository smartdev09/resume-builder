import {supabase} from './supabaseClient'

export async function getCount(userid:any){
 const { count: totalCount, error: countError } = await supabase
    .from("resumes")
    .select("*", { count: "exact", head: true })
    .eq("userid", userid);

  if (countError) {
    console.error("Error fetching resume count:", countError.message);
  }
}


// Define the interface for the work experience data if you need it
interface WorkExperience {
  id: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Define the final shape of the returned resume data
export interface FormattedResumeData {
    id: string;
    title: string;
    description: string | null;
    photo: string | null; // Corresponds to photoUrl in the schema
    firstName: string | null;
    lastName: string | null;
    jobTitle: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    email: string | null;
    workExperiences: WorkExperience[];
}

export async function getResumes(userId: string): Promise<FormattedResumeData[] | null> {
  const { data: resumes, error } = await supabase
        .from("resumes")
        .select(`
            id,
            title,
            description,
            photoUrl,
            firstName,
            lastName,
            jobTitle,
            phone,
            city,
            country,
            email,
            work_experiences (
              id,
              position,
              location,
              startDate,
              endDate,
              description
            )
        `)
        .eq("userid", userId)
        .order("updatedAt", { ascending: false });

    if (error) {
        console.error("Error fetching resumes:", error);
        return null;
    }
console.log('database resumes', resumes)
    // Map the fetched data to your desired format
    const formattedData: FormattedResumeData[] = resumes.map(resume => ({
        id: resume.id,
        title: resume.title,
        description: resume.description,
        photo: resume.photoUrl,
        firstName: resume.firstName,
        lastName: resume.lastName,
        jobTitle: resume.jobTitle,
        phone: resume.phone,
        city: resume.city,
        country: resume.country,
        email: resume.email,
        workExperiences: resume.work_experiences,
    }));
console.log('formattedData:',formattedData)
    return formattedData;
}