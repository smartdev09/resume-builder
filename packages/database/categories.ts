import {supabase} from './supabaseClient'

export async function getCategoryCount(categoryId:any){
const { error, count } = await supabase
      .from("categories")
      .delete({ count: "exact" }) // returns deleted row count
      .eq("id", categoryId);

    if (error) throw error;
return count;
}
export async function getCategories(){
    const { data: categories, error } = await supabase
  .from("categories")
  .select(`
    *,
    subcategories (
      *,
      order
    )
  `)
  //.match(whereClause)
  .order("type", { ascending: true })
  .order("order", { ascending: true })
  .order("order", { foreignTable: "subcategories", ascending: true });
  if (error) throw new Error(error.message)
  return categories
}
export async function checkCategoryExists(type:any,name:any){
  const { data: existingCategory, error: existingError } = await supabase
        .from("categories")
        .select("*")
       // .eq("type", type)
        .eq("name", name)
        .maybeSingle();

      if (existingError) throw existingError;
      if (existingCategory) {
        return true
        
      }
      else return false

}
export async function getMaxOrder(type:any){
    const { data: maxOrderRow, error: maxOrderError } = await supabase
        .from("categories")
        .select("order")
        .eq("type", type)
        .order("order", { ascending: false })
        .limit(1)
        .maybeSingle();
              if (maxOrderError) throw maxOrderError;

        return maxOrderRow
}
export async function insertCategory(id:string,dataToSave:any,nextOrder:any){
const { data: newCategory, error: insertError } = await supabase
        .from("categories")
        .insert([
          {id:id,
            type: dataToSave.type,
            name: dataToSave.name,
            description: dataToSave.description || null,
            isActive: dataToSave.isActive !== false,
            order: nextOrder,
          },
        ])
        .select("*, subcategories(*)")
        .single();
      if(insertError) throw insertError
return newCategory      
}
export async function checkConflicts(dataToSave:any,id:any){
 const { data: conflictingCategory, error: conflictError } = await supabase
        .from("categories")
        .select("*")
        .eq("type", dataToSave.type)
        .eq("name", dataToSave.name)
        .neq("id", id)
        .maybeSingle();

      if (conflictError) throw conflictError;
      return conflictingCategory
}
export async function updateCategory(dataToSave:any,id:string){
const { data: updatedCategory, error: updateError } = await supabase
        .from("categories")
        .update({
          type: dataToSave.type,
          name: dataToSave.name,
          description: dataToSave.description || null,
          isActive: dataToSave.isActive !== false,
        })
        .eq("id", id)
        .select("*, subcategories(*)")
        .single();

      if (updateError) throw updateError;

      return updatedCategory
}
