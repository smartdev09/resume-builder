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

// GET /api/admin/subcategories - Get all subcategories
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const whereClause = categoryId ? { categoryId } : {};

    const subcategories = await prisma.subcategory.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: [
        { category: { type: "asc" } },
        { order: "asc" },
      ],
    });

    return NextResponse.json({ subcategories });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/subcategories - Create a new subcategory
export async function POST(request: NextRequest) {
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

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: subcategoryData.categoryId },
    });

    if (!category) {
      return NextResponse.json({ 
        error: "Category not found" 
      }, { status: 404 });
    }

    // Check if subcategory name already exists for this category
    const existingSubcategory = await prisma.subcategory.findFirst({
      where: { 
        categoryId: subcategoryData.categoryId,
        name: subcategoryData.name 
      },
    });

    if (existingSubcategory) {
      return NextResponse.json({ 
        error: "Subcategory name already exists for this category" 
      }, { status: 400 });
    }

    // Get the next order for this category
    const maxOrder = await prisma.subcategory.findFirst({
      where: { categoryId: subcategoryData.categoryId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const subcategory = await prisma.subcategory.create({
      data: {
        categoryId: subcategoryData.categoryId,
        name: subcategoryData.name,
        description: subcategoryData.description || null,
        isActive: subcategoryData.isActive,
        order: (maxOrder?.order || 0) + 1,
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

    return NextResponse.json({ subcategory }, { status: 201 });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/subcategories - Delete all subcategories (for testing)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.subcategory.deleteMany({});
    return NextResponse.json({ message: "All subcategories deleted" });
  } catch (error) {
    console.error("Error deleting subcategories:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 