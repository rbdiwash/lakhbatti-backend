/*
  Convert references from JSONB[] to a single JSONB value without dropping data.
*/
UPDATE "EmployeeRegistration"
SET "references" = ARRAY[]::jsonb[]
WHERE "references" IS NULL;

ALTER TABLE "EmployeeRegistration"
  ALTER COLUMN "references" TYPE JSONB
  USING COALESCE(to_jsonb("references"), '[]'::jsonb);

ALTER TABLE "EmployeeRegistration"
  ALTER COLUMN "references" SET NOT NULL;
