import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@resume/db";
import { auth } from "utils/auth";

const fieldSchema = {
  validate: (data: any) => {
    const errors: string[] = [];
    if (!data.name || typeof data.name !== 'string') errors.push('Field name is required');
    if (!data.label || typeof data.label !== 'string') errors.push('Field label is required');
    if (!data.fieldType || typeof data.fieldType !== 'string') errors.push('Field type is required');
    if (!data.step || !['JOB_PREFERENCES', 'MARKET_SNAPSHOT', 'RESUME_UPLOAD'].includes(data.step)) {
      errors.push('Valid onboarding step is required');
    }
    const validFieldTypes = ['TEXT', 'EMAIL', 'NUMBER', 'SELECT', 'MULTISELECT', 'CHECKBOX', 'RADIO', 'TEXTAREA', 'FILE', 'DATE'];
    if (!validFieldTypes.includes(data.fieldType)) {
      errors.push('Valid field type is required');
    }
    return { isValid: errors.length === 0, errors };
  }
};

// GET /api/admin/fields - Get all onboarding fields
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const step = searchParams.get("step");

    const whereClause = step ? { step: step as any } : {};

    const fields = await prisma.onboardingField.findMany({
      where: whereClause,
      orderBy: [
        { step: 'asc' },
        { order: 'asc' }
      ],
    });

    return NextResponse.json({ fields });
  } catch (error) {
    console.error("Error fetching fields:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/fields - Create a new onboarding field
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Set default values
    const fieldData = {
      ...body,
      step: body.step || 'JOB_PREFERENCES',
      options: body.options || [],
      required: body.required || false,
      isActive: body.isActive !== false
    };
    
    const validation = fieldSchema.validate(fieldData);

    if (!validation.isValid) {
      return NextResponse.json({ 
        error: "Invalid data", 
        details: validation.errors 
      }, { status: 400 });
    }

    // Check if field name already exists
    const existingField = await prisma.onboardingField.findFirst({
      where: { name: fieldData.name },
    });

    if (existingField) {
      return NextResponse.json({ 
        error: "Field name already exists" 
      }, { status: 400 });
    }

    // Get the next order for this step
    const maxOrder = await prisma.onboardingField.findFirst({
      where: { step: fieldData.step },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const field = await prisma.onboardingField.create({
      data: {
        step: fieldData.step,
        fieldType: fieldData.fieldType,
        name: fieldData.name,
        label: fieldData.label,
        placeholder: fieldData.placeholder || null,
        required: fieldData.required,
        order: (maxOrder?.order || 0) + 1,
        options: fieldData.options,
        isActive: fieldData.isActive,
      },
    });

    return NextResponse.json({ field }, { status: 201 });
  } catch (error) {
    console.error("Error creating field:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/fields - Delete all fields (for testing)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.onboardingField.deleteMany({});
    return NextResponse.json({ message: "All fields deleted" });
  } catch (error) {
    console.error("Error deleting fields:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 