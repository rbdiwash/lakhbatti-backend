-- Run this in Neon SQL Editor (or: psql "$DATABASE_URL" -f scripts/apply-invoice-schema.sql)
-- 1) Fix references column JSONB[] -> JSONB (safe cast, keeps data)
-- 2) Create Invoice + Payment tables for the employee details page

BEGIN;

UPDATE "EmployeeRegistration"
SET "references" = ARRAY[]::jsonb[]
WHERE "references" IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'EmployeeRegistration'
      AND column_name = 'references'
      AND udt_name = '_jsonb'
  ) THEN
    ALTER TABLE "EmployeeRegistration"
      ALTER COLUMN "references" TYPE JSONB
      USING COALESCE(to_jsonb("references"), '[]'::jsonb);
    ALTER TABLE "EmployeeRegistration"
      ALTER COLUMN "references" SET NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('"Invoice"') IS NULL THEN
    CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED');
    CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

    CREATE TABLE "Invoice" (
      "id" TEXT NOT NULL,
      "number" TEXT NOT NULL,
      "amount" TEXT NOT NULL,
      "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
      "dueDate" TIMESTAMP(3),
      "notes" TEXT NOT NULL DEFAULT '',
      "employeeId" TEXT NOT NULL,
      "jobId" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE "Payment" (
      "id" TEXT NOT NULL,
      "amount" TEXT NOT NULL,
      "method" TEXT NOT NULL DEFAULT 'bank-transfer',
      "status" "PaymentStatus" NOT NULL DEFAULT 'COMPLETED',
      "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "reference" TEXT NOT NULL DEFAULT '',
      "employeeId" TEXT NOT NULL,
      "invoiceId" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
    );

    CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");

    ALTER TABLE "Invoice"
      ADD CONSTRAINT "Invoice_employeeId_fkey"
      FOREIGN KEY ("employeeId") REFERENCES "EmployeeRegistration"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;

    ALTER TABLE "Invoice"
      ADD CONSTRAINT "Invoice_jobId_fkey"
      FOREIGN KEY ("jobId") REFERENCES "Job"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;

    ALTER TABLE "Payment"
      ADD CONSTRAINT "Payment_employeeId_fkey"
      FOREIGN KEY ("employeeId") REFERENCES "EmployeeRegistration"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;

    ALTER TABLE "Payment"
      ADD CONSTRAINT "Payment_invoiceId_fkey"
      FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

COMMIT;
