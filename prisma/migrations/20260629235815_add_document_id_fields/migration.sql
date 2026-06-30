-- DropIndex
DROP INDEX "FoundPerson_estimatedAgeGroup_estimatedGender_idx";

-- DropIndex
DROP INDEX "FoundPerson_condition_currentSafeLocation_idx";

-- DropIndex
DROP INDEX "MissingPerson_fullName_ageGroup_gender_idx";

-- AlterTable
ALTER TABLE "FoundPerson" ADD COLUMN "documentId" TEXT;
ALTER TABLE "FoundPerson" ADD COLUMN "documentType" TEXT;

-- AlterTable
ALTER TABLE "MissingPerson" ADD COLUMN "documentId" TEXT;
ALTER TABLE "MissingPerson" ADD COLUMN "documentType" TEXT;

-- CreateIndex
CREATE INDEX "FoundPerson_declaredName_documentId_idx" ON "FoundPerson"("declaredName", "documentId");

-- CreateIndex
CREATE INDEX "FoundPerson_currentSafeLocation_idx" ON "FoundPerson"("currentSafeLocation");

-- CreateIndex
CREATE INDEX "MissingPerson_fullName_documentId_idx" ON "MissingPerson"("fullName", "documentId");
