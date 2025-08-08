import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@resume/db";
import { auth } from "utils/auth";

const categorySchema = {
  validate: (data: any) => {
    const errors: string[] = [];
    if (!data.name || typeof data.name !== 'string') errors.push('Category name is required');
    if (!data.type || !['JOB_FUNCTION', 'JOB_TYPE', 'LOCATION', 'WORK_AUTHORIZATION'].includes(data.type)) {
      errors.push('Valid category type is required');
    }
    return { isValid: errors.length === 0, errors };
  }
};
// GET /api/admin/categories/[id] - Get single category
  //@ts-ignore
export async function GET(  request: NextRequest,  
  { params }: any//{ params: { id: string } }
  ) 
{
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        subcategories: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
// PUT /api/admin/categories/[id] - Update category

//@ts-ignore
export async function PUT(
  request: NextRequest,
  //@ts-ignore
  { params }:any// { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = categorySchema.validate(body);

    if (!validation.isValid) {
      return NextResponse.json({ 
        error: "Invalid data", 
        details: validation.errors 
      }, { status: 400 });
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Check if name conflicts with another category of the same type (excluding current)
    const conflictingCategory = await prisma.category.findFirst({
      where: { 
        type: body.type,
        name: body.name,
        id: { not: params.id }
      },
    });

    if (conflictingCategory) {
      return NextResponse.json({ 
        error: "Category name already exists for this type" 
      }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        type: body.type,
        name: body.name,
        description: body.description || null,
        isActive: body.isActive !== false,
      },
      include: {
        subcategories: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id] - Delete category
//@ts-ignore
export async function DELETE(
  request: NextRequest,
  //@ts-ignore
  { params }:any// { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        subcategories: true,
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Delete category (subcategories will be cascade deleted)
    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ 
      message: "Category deleted successfully",
      deletedSubcategories: existingCategory.subcategories.length
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 