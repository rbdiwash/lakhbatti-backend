-- Convert preferredTimeSlots from JSONB array → TEXT[] so Prisma hasSome works.
UPDATE "EmployeeRegistration"
SET "preferredTimeSlots" = '[]'::jsonb
WHERE "preferredTimeSlots" IS NULL;

ALTER TABLE "EmployeeRegistration"
  ALTER COLUMN "preferredTimeSlots" TYPE TEXT[]
  USING (
    CASE
      WHEN "preferredTimeSlots" IS NULL
        OR "preferredTimeSlots" = 'null'::jsonb
        OR jsonb_typeof("preferredTimeSlots") <> 'array'
        THEN ARRAY[]::TEXT[]
      ELSE translate("preferredTimeSlots"::text, '[]', '{}')::text[]
    END
  );

ALTER TABLE "EmployeeRegistration"
  ALTER COLUMN "preferredTimeSlots" SET DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "EmployeeRegistration"
  ALTER COLUMN "preferredTimeSlots" SET NOT NULL;
