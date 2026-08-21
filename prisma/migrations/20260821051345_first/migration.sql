/*
  Warnings:

  - You are about to drop the column `availability` on the `EmployeeRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `bank` on the `EmployeeRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `compliance` on the `EmployeeRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `EmployeeRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `personal` on the `EmployeeRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `training` on the `EmployeeRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `workRights` on the `EmployeeRegistration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `EmployeeRegistration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `abn` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountName` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountNumber` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bsb` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daySlots` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactName` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emergencyContactPhone` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedPayRate` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasAbn` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasAnnualLeave` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasCovidVaccination` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasDriverLicense` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasPoliceCheck` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasPublicHolidayRate` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasPublicLiability` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasRegisteredVehicle` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasSickLeave` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasWorkingRights` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasWorkingWithChildren` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `insuranceExpiry` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTravelKm` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notifyByEmail` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notifyBySms` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otherDocs` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `policeCheckExpiry` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postcode` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredTimeSlots` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePhoto` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suburb` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superFundName` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superMemberNumber` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tfn` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urgency` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleRegistrationNumber` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visaExpiry` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visaOther` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visaStatus` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `willingToTravel` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workType` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wwcExpiry` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearsExperience` to the `EmployeeRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployeeRegistration" DROP COLUMN "availability",
DROP COLUMN "bank",
DROP COLUMN "compliance",
DROP COLUMN "contact",
DROP COLUMN "personal",
DROP COLUMN "training",
DROP COLUMN "workRights",
ADD COLUMN     "abn" TEXT NOT NULL,
ADD COLUMN     "accountName" TEXT NOT NULL,
ADD COLUMN     "accountNumber" TEXT NOT NULL,
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "bsb" TEXT NOT NULL,
ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "dateOfBirth" TEXT NOT NULL,
ADD COLUMN     "daySlots" JSONB NOT NULL,
ADD COLUMN     "emergencyContactName" TEXT NOT NULL,
ADD COLUMN     "emergencyContactPhone" TEXT NOT NULL,
ADD COLUMN     "expectedPayRate" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "hasAbn" BOOLEAN NOT NULL,
ADD COLUMN     "hasAnnualLeave" BOOLEAN NOT NULL,
ADD COLUMN     "hasCovidVaccination" BOOLEAN NOT NULL,
ADD COLUMN     "hasDriverLicense" BOOLEAN NOT NULL,
ADD COLUMN     "hasPoliceCheck" BOOLEAN NOT NULL,
ADD COLUMN     "hasPublicHolidayRate" BOOLEAN NOT NULL,
ADD COLUMN     "hasPublicLiability" BOOLEAN NOT NULL,
ADD COLUMN     "hasRegisteredVehicle" BOOLEAN NOT NULL,
ADD COLUMN     "hasSickLeave" BOOLEAN NOT NULL,
ADD COLUMN     "hasWorkingRights" BOOLEAN NOT NULL,
ADD COLUMN     "hasWorkingWithChildren" BOOLEAN NOT NULL,
ADD COLUMN     "insuranceExpiry" TEXT NOT NULL,
ADD COLUMN     "machinesHandled" TEXT[],
ADD COLUMN     "maxTravelKm" TEXT NOT NULL,
ADD COLUMN     "notifyByEmail" BOOLEAN NOT NULL,
ADD COLUMN     "notifyBySms" BOOLEAN NOT NULL,
ADD COLUMN     "otherDocs" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "phone" INTEGER NOT NULL,
ADD COLUMN     "policeCheckExpiry" TEXT NOT NULL,
ADD COLUMN     "postcode" TEXT NOT NULL,
ADD COLUMN     "preferredDays" TEXT[],
ADD COLUMN     "preferredTimeSlots" JSONB NOT NULL,
ADD COLUMN     "profilePhoto" TEXT NOT NULL,
ADD COLUMN     "references" JSONB[],
ADD COLUMN     "specialisations" TEXT[],
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "suburb" TEXT NOT NULL,
ADD COLUMN     "superFundName" TEXT NOT NULL,
ADD COLUMN     "superMemberNumber" TEXT NOT NULL,
ADD COLUMN     "tfn" TEXT NOT NULL,
ADD COLUMN     "urgency" TEXT NOT NULL,
ADD COLUMN     "vehicleRegistrationNumber" TEXT NOT NULL,
ADD COLUMN     "visaExpiry" TEXT NOT NULL,
ADD COLUMN     "visaOther" TEXT NOT NULL,
ADD COLUMN     "visaStatus" TEXT NOT NULL,
ADD COLUMN     "willingToTravel" BOOLEAN NOT NULL,
ADD COLUMN     "workType" TEXT NOT NULL,
ADD COLUMN     "wwcExpiry" TEXT NOT NULL,
ADD COLUMN     "yearsExperience" TEXT NOT NULL,
ALTER COLUMN "submittedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeRegistration_phone_key" ON "EmployeeRegistration"("phone");
