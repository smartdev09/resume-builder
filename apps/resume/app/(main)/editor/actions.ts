import { supabase } from '../../../../../packages/database/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
//import {createClient} from '../../../../../packages/database/supabaseServer'

export async function saveResume(values:any) {
  // 1️⃣ Authenticate user
  //const supabase= await createClient()
  const { data, error: authError } = await supabase.auth.getSession();
  if (authError || !data.session?.user) {
    throw new Error("Please login with GitHub to continue");
  }

  const userId = data?.session?.user.id;

  // 2️⃣ Destructure and prepare main resume data
  const {
    id,
    photo,
    workExperiences,
    educations,
    projects,
    languages,
    certifications,
    skillSections,
    ...resumeValues
  } = values;

  // 3️⃣ Handle photo upload (placeholder — implement your storage logic)
  let newPhotoUrl = null;
  if (photo instanceof File) {
    // Example: const { data: upload } = await supabase.storage.from('photos').upload(...)
    // newPhotoUrl = upload.publicUrl
  }
const now = new Date().toISOString();

  // 4️⃣ Insert or update main resume record
  const { data: resume, error: resumeError } = await supabase
    .from('resumes') // ✅ Correct table name
    .upsert({
      ...resumeValues,
      selectedTemplate: 'simple',
      userid: userId,
      photoUrl: newPhotoUrl,
        updatedAt: now, // ✅ ensure it's always set
    ...(id ? {} : { createdAt: now }), // ✅ only set createdAt on insert
    ...(id && { id }) // for updates
    })
    .select()
    .single();

  if (resumeError) throw resumeError;

  const resumeId = resume.id;

  // 5️⃣ Helper to bulk insert related records
  async function insertRelated(table: string, records: any[], dateMap?: { start?: string; end?: string }) {
    if (!records?.length) return;
  try{
   const{data,error}= await supabase.from(table).insert(
      records.map((r) => ({
        ...r,
        ...(dateMap?.start && { [dateMap.start]: r.startDate || null }),
        ...(dateMap?.end && { [dateMap.end]: r.endDate || null }),
        resumeId: resumeId
      }))
    );
  if(error)
  console.error(error)}
    catch(e){
      console.error('insertRelated: ',e)
    }
  }
try{
    console.log('work_experiences', workExperiences)
    console.log('educations', educations)
    console.log('projects', projects)
console.log('skill_sections', skillSections)
    // 6️⃣ Insert related entities
    if(workExperiences)
 await insertRelated('work_experiences', workExperiences.map((workExperience:any)=>({ ...workExperience, id: uuidv4() })));
if(educations)
await insertRelated('educations', educations.map((education:any)=>({ ...education,id:uuidv4() })));
if(projects)
await Promise.all(
  projects.map(async (project: any) => {
    await insertRelated('projects', [{ ...project, id: uuidv4() }]);
  })
);
if(languages)
await insertRelated('language', languages);
if(certifications)
await insertRelated('certification', certifications);
if(skillSections)
await Promise.all(
  skillSections.map(async (skill_section: any) => {
    await insertRelated('skill_sections', [{ ...skill_section, id: uuidv4() }]);
  })
);

}
catch(e){
  console.error('here now:',e)
}
return resume;
}
