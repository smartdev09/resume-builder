import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing categories and subcategories...');
  await prisma.subcategory.deleteMany({});
  await prisma.category.deleteMany({});

  // Job Function Categories and Subcategories
  console.log('📂 Creating Job Function categories...');
  
  // Engineering Category
  const engineeringCategory = await prisma.category.create({
    data: {
      type: 'JOB_FUNCTION',
      name: 'Engineering',
      description: 'Software and technical engineering roles',
      order: 1,
    },
  });

  await prisma.subcategory.create({
    data: {
      categoryId: engineeringCategory.id,
      name: 'Software Engineering',
      description: 'Software development roles',
      order: 1,
      roles: [
        'Frontend Developer',
        'Backend Engineer', 
        'Full Stack Developer',
        'Mobile Developer'
      ],
    },
  });

  // DevOps Category
  const devopsCategory = await prisma.category.create({
    data: {
      type: 'JOB_FUNCTION',
      name: 'DevOps',
      description: 'DevOps and infrastructure roles',
      order: 2,
    },
  });

  await prisma.subcategory.create({
    data: {
      categoryId: devopsCategory.id,
      name: 'DevOps',
      description: 'DevOps and Site Reliability Engineering',
      order: 1,
      roles: [
        'DevOps Engineer',
        'Site Reliability Engineer',
        'Cloud Engineer'
      ],
    },
  });

  // Design Category
  const designCategory = await prisma.category.create({
    data: {
      type: 'JOB_FUNCTION',
      name: 'Design',
      description: 'Product and user experience design roles',
      order: 3,
    },
  });

  await prisma.subcategory.create({
    data: {
      categoryId: designCategory.id,
      name: 'Product Design',
      description: 'User experience and product design',
      order: 1,
      roles: [
        'UX Designer',
        'UI Designer',
        'Product Designer'
      ],
    },
  });

  // Graphic Design Category
  const graphicDesignCategory = await prisma.category.create({
    data: {
      type: 'JOB_FUNCTION',
      name: 'Graphic Design',
      description: 'Visual and brand design roles',
      order: 4,
    },
  });

  await prisma.subcategory.create({
    data: {
      categoryId: graphicDesignCategory.id,
      name: 'Graphic Design',
      description: 'Visual and brand design',
      order: 1,
      roles: [
        'Graphic Designer',
        'Visual Designer',
        'Brand Designer'
      ],
    },
  });

  // Marketing Category
  const marketingCategory = await prisma.category.create({
    data: {
      type: 'JOB_FUNCTION',
      name: 'Marketing',
      description: 'Marketing and growth roles',
      order: 5,
    },
  });

  await prisma.subcategory.create({
    data: {
      categoryId: marketingCategory.id,
      name: 'Digital Marketing',
      description: 'Digital marketing and content roles',
      order: 1,
      roles: [
        'SEO Specialist',
        'Content Marketer',
        'Social Media Manager'
      ],
    },
  });

  await prisma.subcategory.create({
    data: {
      categoryId: marketingCategory.id,
      name: 'Brand Marketing',
      description: 'Brand and growth marketing',
      order: 2,
      roles: [
        'Brand Manager',
        'Marketing Manager', 
        'Growth Marketer'
      ],
    },
  });

  // Job Type Categories
  console.log('💼 Creating Job Type categories...');
  
  const jobTypeCategory = await prisma.category.create({
    data: {
      type: 'JOB_TYPE',
      name: 'Employment Types',
      description: 'Different types of employment arrangements',
      order: 1,
    },
  });

  const jobTypes = [
    { name: 'Full-time', description: 'Full-time employment', order: 1 },
    { name: 'Contract', description: 'Contract work', order: 2 },
    { name: 'Part-time', description: 'Part-time employment', order: 3 },
    { name: 'Internship', description: 'Internship opportunities', order: 4 },
  ];

  for (const jobType of jobTypes) {
    await prisma.subcategory.create({
      data: {
        categoryId: jobTypeCategory.id,
        name: jobType.name,
        description: jobType.description,
        order: jobType.order,
        roles: [],
      },
    });
  }

  // Location Categories  
  console.log('🌍 Creating Location categories...');
  
  const locationCategory = await prisma.category.create({
    data: {
      type: 'LOCATION',
      name: 'Work Locations',
      description: 'Available work locations and remote options',
      order: 1,
    },
  });

  const locations = [
    { name: 'USA', description: 'United States locations', order: 1 },
    { name: 'Open to Remote', description: 'Remote work opportunities', order: 2 },
  ];

  for (const location of locations) {
    await prisma.subcategory.create({
      data: {
        categoryId: locationCategory.id,
        name: location.name,
        description: location.description,
        order: location.order,
        roles: [],
      },
    });
  }

  // Work Authorization Categories
  console.log('📋 Creating Work Authorization categories...');
  
  const workAuthCategory = await prisma.category.create({
    data: {
      type: 'WORK_AUTHORIZATION',
      name: 'Work Authorization',
      description: 'Work authorization and visa sponsorship requirements',
      order: 1,
    },
  });

  await prisma.subcategory.create({
    data: {
      categoryId: workAuthCategory.id,
      name: 'H1B sponsorship',
      description: 'H1B visa sponsorship available',
      order: 1,
      roles: [],
    },
  });

  // Seed some sample onboarding fields
  console.log('📝 Creating sample onboarding fields...');

  await prisma.onboardingField.createMany({
    data: [
      // Job Preferences Step
      {
        step: 'JOB_PREFERENCES',
        fieldType: 'SELECT',
        name: 'jobFunction',
        label: 'Job Function',
        placeholder: 'Select your job function',
        required: true,
        order: 1,
        options: [
          'Engineering',
          'DevOps', 
          'Design',
          'Graphic Design',
          'Marketing'
        ],
      },
      {
        step: 'JOB_PREFERENCES',
        fieldType: 'SELECT',
        name: 'jobType',
        label: 'Job Type',
        placeholder: 'Select employment type',
        required: true,
        order: 2,
        options: ['Full-time', 'Contract', 'Part-time', 'Internship'],
      },
      {
        step: 'JOB_PREFERENCES',
        fieldType: 'SELECT',
        name: 'location',
        label: 'Preferred Location',
        placeholder: 'Select location preference',
        required: true,
        order: 3,
        options: ['USA', 'Open to Remote'],
      },
      {
        step: 'JOB_PREFERENCES',
        fieldType: 'CHECKBOX',
        name: 'h1bSponsorship',
        label: 'H1B Sponsorship',
        placeholder: 'Do you need H1B sponsorship?',
        required: false,
        order: 4,
        options: ['Yes, I need H1B sponsorship'],
      },
      
      // Market Snapshot Step
      {
        step: 'MARKET_SNAPSHOT',
        fieldType: 'TEXT',
        name: 'experienceLevel',
        label: 'Experience Level',
        placeholder: 'e.g., 3-5 years',
        required: false,
        order: 1,
        options: [],
      },
      {
        step: 'MARKET_SNAPSHOT',
        fieldType: 'TEXTAREA',
        name: 'skillsAndTechnologies',
        label: 'Skills and Technologies',
        placeholder: 'List your key skills and technologies...',
        required: false,
        order: 2,
        options: [],
      },
      
      // Resume Upload Step
      {
        step: 'RESUME_UPLOAD',
        fieldType: 'FILE',
        name: 'resumeFile',
        label: 'Upload Resume',
        placeholder: 'Upload your resume (PDF format preferred)',
        required: true,
        order: 1,
        options: [],
      },
      {
        step: 'RESUME_UPLOAD',
        fieldType: 'TEXTAREA',
        name: 'additionalNotes',
        label: 'Additional Notes',
        placeholder: 'Any additional information you would like to share...',
        required: false,
        order: 2,
        options: [],
      },
    ],
  });

  console.log('✅ Database seeding completed successfully!');
  
  // Print summary
  const categoryCount = await prisma.category.count();
  const subcategoryCount = await prisma.subcategory.count();
  const fieldCount = await prisma.onboardingField.count();
  
  console.log(`📊 Summary:`);
  console.log(`   - ${categoryCount} categories created`);
  console.log(`   - ${subcategoryCount} subcategories created`);
  console.log(`   - ${fieldCount} onboarding fields created`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 