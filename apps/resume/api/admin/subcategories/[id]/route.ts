import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@resume/db";
import { auth } from "utils/auth";

const subcategorySchema = {
  validate: (data: any) => {
    const errors: string[] = [];
    if (!data.name || typeof data.name !== 'string') errors.push('Subcategory name is required');
    if (!data.categoryId || typeof data.categoryId !== 'string') errors.push('Category ID is required');
    if (data.roles && !Array.isArray(data.roles)) errors.push('Roles must be an array');
    return { isValid: errors.length === 0, errors };
  }
};

// GET /api/admin/subcategories/[id] - Get single subcategory
export async function GET(
  request: NextRequest,
  { params }: any//{ params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subcategory = await prisma.subcategory.findUnique({
      where: { id: params.id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    if (!subcategory) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
    }

    return NextResponse.json({ subcategory });
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/subcategories/[id] - Update subcategory
export async function PUT(
  request: NextRequest,
  { params }: any//{ params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Set default values
    const subcategoryData = {
      ...body,
      roles: body.roles || [],
      isActive: body.isActive !== false
    };
    
    const validation = subcategorySchema.validate(subcategoryData);

    if (!validation.isValid) {
      return NextResponse.json({ 
        error: "Invalid data", 
        details: validation.errors 
      }, { status: 400 });
    }

    // Check if subcategory exists
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id: params.id },
    });

    if (!existingSubcategory) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: subcategoryData.categoryId },
    });

    if (!category) {
      return NextResponse.json({ 
        error: "Category not found" 
      }, { status: 404 });
    }

    // Check if name conflicts with another subcategory in the same category (excluding current)
    const conflictingSubcategory = await prisma.subcategory.findFirst({
      where: { 
        categoryId: subcategoryData.categoryId,
        name: subcategoryData.name,
        id: { not: params.id }
      },
    });

    if (conflictingSubcategory) {
      return NextResponse.json({ 
        error: "Subcategory name already exists for this category" 
      }, { status: 400 });
    }

    const subcategory = await prisma.subcategory.update({
      where: { id: params.id },
      data: {
        categoryId: subcategoryData.categoryId,
        name: subcategoryData.name,
        description: subcategoryData.description || null,
        isActive: subcategoryData.isActive,
        roles: subcategoryData.roles,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json({ subcategory });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/subcategories/[id] - Delete subcategory
export async function DELETE(
  request: NextRequest,
  { params }:any// { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if subcategory exists
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { id: params.id },
    });

    if (!existingSubcategory) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
    }

    // Delete subcategory
    await prisma.subcategory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ 
      message: "Subcategory deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 