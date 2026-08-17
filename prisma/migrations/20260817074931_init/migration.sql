-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'REVIEWING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "EmployeeRegistration" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "personal" JSONB NOT NULL,
    "contact" JSONB NOT NULL,
    "workRights" JSONB NOT NULL,
    "availability" JSONB NOT NULL,
    "compliance" JSONB NOT NULL,
    "training" JSONB NOT NULL,
    "bank" JSONB NOT NULL,
    "agreedToTerms" BOOLEAN NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeRegistration_email_key" ON "EmployeeRegistration"("email");
