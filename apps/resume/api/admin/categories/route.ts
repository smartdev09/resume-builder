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

// GET /api/admin/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const whereClause = type ? { type: type as any } : {};

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        subcategories: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: [
        { type: "asc" },
        { order: "asc" },
      ],
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Set default type if not provided
    const categoryData = {
      ...body,
      type: body.type || 'JOB_FUNCTION'
    };
    
    const validation = categorySchema.validate(categoryData);

    if (!validation.isValid) {
      return NextResponse.json({ 
        error: "Invalid data", 
        details: validation.errors 
      }, { status: 400 });
    }

    // Check if category name already exists for this type
    const existingCategory = await prisma.category.findFirst({
      where: { 
        type: categoryData.type,
        name: categoryData.name 
      },
    });

    if (existingCategory) {
      return NextResponse.json({ 
        error: "Category name already exists for this type" 
      }, { status: 400 });
    }

    // Get the next order for this type
    const maxOrder = await prisma.category.findFirst({
      where: { type: categoryData.type },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const category = await prisma.category.create({
      data: {
        type: categoryData.type,
        name: categoryData.name,
        description: categoryData.description || null,
        isActive: categoryData.isActive !== false,
        order: (maxOrder?.order || 0) + 1,
      },
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/categories - Delete all categories (for testing)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.category.deleteMany({});
    return NextResponse.json({ message: "All categories deleted" });
  } catch (error) {
    console.error("Error deleting categories:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 