/*
  Warnings:

  - You are about to drop the column `colorHex` on the `resumes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "resumes" DROP COLUMN "colorHex",
ADD COLUMN     "fontStyle" TEXT,
ADD COLUMN     "primaryColorHex" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "primaryFontSize" TEXT,
ADD COLUMN     "secondaryColorHex" TEXT NOT NULL DEFAULT '#000000',
ADD COLUMN     "secondaryFontSize" TEXT;
