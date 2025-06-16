/*
  Warnings:

  - You are about to drop the column `skills` on the `resumes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "resumes" DROP COLUMN "skills";

-- CreateTable
CREATE TABLE "skill_sections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "skills" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "skill_sections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "skill_sections" ADD CONSTRAINT "skill_sections_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
