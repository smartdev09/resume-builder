-- CreateEnum
CREATE TYPE "JobInteractionType" AS ENUM ('LIKED', 'APPLIED', 'SAVED_EXTERNAL', 'VIEWED');

-- CreateTable
CREATE TABLE "user_job_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobFunction" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "openToRemote" BOOLEAN NOT NULL DEFAULT false,
    "needsSponsorship" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_job_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_interactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,
    "interactionType" "JobInteractionType" NOT NULL,
    "notes" TEXT,
    "appliedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_interactions_userId_jobId_interactionType_key" ON "job_interactions"("userId", "jobId", "interactionType");

-- AddForeignKey
ALTER TABLE "user_job_preferences" ADD CONSTRAINT "user_job_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_interactions" ADD CONSTRAINT "job_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_interactions" ADD CONSTRAINT "job_interactions_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "scraped_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
