-- CreateEnum
CREATE TYPE "OnboardingStep" AS ENUM ('JOB_PREFERENCES', 'MARKET_SNAPSHOT', 'RESUME_UPLOAD');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('TEXT', 'EMAIL', 'NUMBER', 'SELECT', 'MULTISELECT', 'CHECKBOX', 'RADIO', 'TEXTAREA', 'FILE', 'DATE');

-- CreateTable
CREATE TABLE "onboarding_fields" (
    "id" TEXT NOT NULL,
    "step" "OnboardingStep" NOT NULL,
    "fieldType" "FieldType" NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "placeholder" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "options" TEXT[],
    "validation" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fieldData" JSONB NOT NULL,
    "step" "OnboardingStep" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_submissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "onboarding_submissions" ADD CONSTRAINT "onboarding_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
