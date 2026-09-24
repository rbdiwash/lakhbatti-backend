-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL DEFAULT '',
    "details" JSONB NOT NULL DEFAULT '{}',
    "dateFrom" TEXT NOT NULL DEFAULT '',
    "dateTo" TEXT NOT NULL DEFAULT '',
    "frequency" TEXT NOT NULL DEFAULT '',
    "quoteMode" TEXT NOT NULL DEFAULT '',
    "callOutAccepted" BOOLEAN NOT NULL DEFAULT false,
    "callOutFee" DOUBLE PRECISION,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "images" TEXT[],
    "imageCount" INTEGER NOT NULL DEFAULT 0,
    "status" "QuoteStatus" NOT NULL DEFAULT 'NEW',
    "quotedAmount" TEXT NOT NULL DEFAULT '',
    "adminNotes" TEXT NOT NULL DEFAULT '',
    "jobId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "Quote"("status");

-- CreateIndex
CREATE INDEX "Quote_createdAt_idx" ON "Quote"("createdAt");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
