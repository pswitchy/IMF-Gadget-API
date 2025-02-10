/*
  Warnings:

  - The values [ACTIVE,INACTIVE] on the enum `GadgetStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GadgetStatus_new" AS ENUM ('Active', 'Inactive', 'Available', 'Deployed', 'Destroyed', 'Decommissioned');
ALTER TABLE "Gadget" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Gadget" ALTER COLUMN "status" TYPE "GadgetStatus_new" USING ("status"::text::"GadgetStatus_new");
ALTER TYPE "GadgetStatus" RENAME TO "GadgetStatus_old";
ALTER TYPE "GadgetStatus_new" RENAME TO "GadgetStatus";
DROP TYPE "GadgetStatus_old";
ALTER TABLE "Gadget" ALTER COLUMN "status" SET DEFAULT 'Available';
COMMIT;
