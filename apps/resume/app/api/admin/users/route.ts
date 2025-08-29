import { NextRequest, NextResponse } from "next/server";
//import { createClient } from "node_modules/@resume/db/supabaseServer";
//import { supabase } from "../../../../../../packages/database/supabaseClient";
import { createClient } from "@resume/db/supabaseServer";
// GET /api/admin/users - Get all users

export async function GET(request: NextRequest) {
    const supabase=await createClient()
  try {
    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("users")
      .select("id, name, email, image, role, createdAt, updatedAt", { count: "exact" })
      .order("createdAt", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data: users, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        pages: Math.ceil((count ?? 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET user stats (via HEAD request)
export async function HEAD() {
      const supabase=await createClient()

  try {
    const { count: totalCount, error: countError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    const { count: recentCount, error: recentError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("createdAt", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (recentError) throw recentError;

    return new NextResponse(null, {
      status: 200,
      headers: {
        "X-Total-Users": totalCount?.toString() || "0",
        "X-Recent-Users": recentCount?.toString() || "0",
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return new NextResponse(null, { status: 500 });
  }
}
