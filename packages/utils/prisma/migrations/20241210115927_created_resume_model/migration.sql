-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "photoUrl" TEXT,
    "colorHex" TEXT NOT NULL DEFAULT '#000000',
    "borderStyle" TEXT NOT NULL DEFAULT 'squircle',
    "summary" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);
