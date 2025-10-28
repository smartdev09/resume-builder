import {supabase} from './supabaseClient'

export async function updateSubcategory(subcategoryData:any,id:any){
 const { data, error } = await supabase
          .from("subcategories")
          .update({
            name: subcategoryData.name,
            description: subcategoryData.description || null,
            categoryId: subcategoryData.categoryId,
            isActive: subcategoryData.isActive,
            roles: subcategoryData.roles,
          })
          .eq("id", id)
          .select("*, category:categories(id, name, type)")
          .single();

        if (error) throw error;
        return data
}
export async function createSubcategory(subcategoryData:any,id:any){
 const { data, error } = await supabase
          .from("subcategories")
          .insert([
            {id:id,
              name: subcategoryData.name,
              description: subcategoryData.description || null,
              categoryId: subcategoryData.categoryId,
              isActive: subcategoryData.isActive,
              roles: subcategoryData.roles,
            },
          ])
          .select("*, category:categories(id, name, type)")
          .single();

        if (error) throw error;
        return data
}
export async function deleteSubcategory(id:string){
      const { error } = await supabase
        .from("subcategories")
        .delete()
        .eq("id", id);

      return error

}
export async function getCategoriesWithSubcategories()
   {

      const [{ data: categoriesData, error: categoriesError }, { data: subcategoriesData, error: subcategoriesError }] =
        await Promise.all([
          supabase.from("categories").select("*").order("order", { ascending: true }),
          supabase
            .from("subcategories")
            .select("*, category:categories(id, name, type)")
            .order("order", { ascending: true }),
        ]);

      if (categoriesError || subcategoriesError) {
        throw categoriesError || subcategoriesError;
      }
      return {categoriesData,subcategoriesData}
   }