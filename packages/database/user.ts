 
import {supabase} from'./supabaseClient'

export async function getUsers(){
 let query = supabase
      .from("users")
      .select("id, name, email, image, role, createdAt, updatedAt", { count: "exact" })
      .order("createdAt", { ascending: false })
     // .range(from, to);

    // if (search) {
    //   query = query.or(
    //     `name.ilike.%${search}%,email.ilike.%${search}%`
    //   );
    // }

    const { data: users, error, count } = await query;

    if (error) throw error;
return users;
}