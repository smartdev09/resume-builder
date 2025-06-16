import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@resume/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const whereClause = type ? { 
      type: type as 'JOB_FUNCTION' | 'JOB_TYPE' | 'LOCATION' | 'WORK_AUTHORIZATION' 
    } : {};

    const categories = await prisma.category.findMany({
      where: {
        ...whereClause,
        isActive: true,
      },
      include: {
        subcategories: {
          where: {
            isActive: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [
        { type: 'asc' },
        { order: 'asc' },
      ],
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 