-- AlterTable: CalloutFee is a singleton settings row (id = 'default')
-- Drop old shape if present, recreate with amountAud / enabled / notes

DROP TABLE IF EXISTS "CalloutFee";

CREATE TABLE "CalloutFee" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 49,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT NOT NULL DEFAULT 'Charged for on-site quote visits; deducted from the final job invoice.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalloutFee_pkey" PRIMARY KEY ("id")
);

INSERT INTO "CalloutFee" ("id", "amount", "enabled", "notes", "createdAt", "updatedAt")
VALUES (
  'default',
  49,
  true,
  'Charged for on-site quote visits; deducted from the final job invoice.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
