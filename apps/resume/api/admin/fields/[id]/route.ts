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

// GET /api/admin/fields/[id] - Get single field
export async function GET(
  request: NextRequest,
  { params }: any//{ params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const field = await prisma.onboardingField.findUnique({
      where: { id: params.id },
    });

    if (!field) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    return NextResponse.json({ field });
  } catch (error) {
    console.error("Error fetching field:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/fields/[id] - Update field
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
    const fieldData = {
      ...body,
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

    // Check if field exists
    const existingField = await prisma.onboardingField.findUnique({
      where: { id: params.id },
    });

    if (!existingField) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    // Check if name conflicts with another field (excluding current)
    const conflictingField = await prisma.onboardingField.findFirst({
      where: { 
        name: fieldData.name,
        id: { not: params.id }
      },
    });

    if (conflictingField) {
      return NextResponse.json({ 
        error: "Field name already exists" 
      }, { status: 400 });
    }

    const field = await prisma.onboardingField.update({
      where: { id: params.id },
      data: {
        step: fieldData.step,
        fieldType: fieldData.fieldType,
        name: fieldData.name,
        label: fieldData.label,
        placeholder: fieldData.placeholder || null,
        required: fieldData.required,
        options: fieldData.options,
        isActive: fieldData.isActive,
      },
    });

    return NextResponse.json({ field });
  } catch (error) {
    console.error("Error updating field:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/fields/[id] - Delete field
export async function DELETE(
  request: NextRequest,
  { params }:any// { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if field exists
    const existingField = await prisma.onboardingField.findUnique({
      where: { id: params.id },
    });

    if (!existingField) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    // Delete field
    await prisma.onboardingField.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ 
      message: "Field deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting field:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 