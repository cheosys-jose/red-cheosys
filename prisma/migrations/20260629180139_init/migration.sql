-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceType" TEXT NOT NULL DEFAULT 'INTERNAL',
    "sourceUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "locationLat" REAL,
    "locationLng" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "severity" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "affectedPeople" TEXT,
    "exactLocation" TEXT NOT NULL,
    "reporterContact" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceType" TEXT NOT NULL DEFAULT 'INTERNAL',
    "sourceUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "locationLat" REAL,
    "locationLng" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    "coverageArea" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "providerContact" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MissingPerson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceType" TEXT NOT NULL DEFAULT 'INTERNAL',
    "sourceUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "locationLat" REAL,
    "locationLng" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "fullName" TEXT NOT NULL,
    "alias" TEXT,
    "ageGroup" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "lastSeenLocation" TEXT NOT NULL,
    "clothingDescription" TEXT,
    "distinctiveFeatures" TEXT,
    "relativeContact" TEXT NOT NULL,
    "additionalInfo" TEXT
);

-- CreateTable
CREATE TABLE "FoundPerson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceType" TEXT NOT NULL DEFAULT 'INTERNAL',
    "sourceUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "locationLat" REAL,
    "locationLng" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "condition" TEXT NOT NULL,
    "declaredName" TEXT,
    "currentSafeLocation" TEXT NOT NULL,
    "estimatedAgeGroup" TEXT NOT NULL,
    "estimatedGender" TEXT NOT NULL,
    "clothingDescription" TEXT,
    "custodianContact" TEXT NOT NULL,
    "additionalInfo" TEXT
);

-- CreateTable
CREATE TABLE "Center" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceType" TEXT NOT NULL DEFAULT 'INTERNAL',
    "sourceUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "locationLat" REAL,
    "locationLng" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "centerType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "capacityStatus" TEXT NOT NULL DEFAULT 'RECEIVING',
    "criticalNeeds" TEXT,
    "contactPhone" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alertId" TEXT,
    "resourceId" TEXT,
    "missingPersonId" TEXT,
    "foundPersonId" TEXT,
    "centerId" TEXT,
    CONSTRAINT "Image_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_missingPersonId_fkey" FOREIGN KEY ("missingPersonId") REFERENCES "MissingPerson" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_foundPersonId_fkey" FOREIGN KEY ("foundPersonId") REFERENCES "FoundPerson" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Alert_severity_alertType_idx" ON "Alert"("severity", "alertType");

-- CreateIndex
CREATE INDEX "Alert_locationLat_locationLng_idx" ON "Alert"("locationLat", "locationLng");

-- CreateIndex
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");

-- CreateIndex
CREATE INDEX "Resource_category_status_idx" ON "Resource"("category", "status");

-- CreateIndex
CREATE INDEX "Resource_createdAt_idx" ON "Resource"("createdAt");

-- CreateIndex
CREATE INDEX "MissingPerson_fullName_ageGroup_gender_idx" ON "MissingPerson"("fullName", "ageGroup", "gender");

-- CreateIndex
CREATE INDEX "MissingPerson_lastSeenLocation_idx" ON "MissingPerson"("lastSeenLocation");

-- CreateIndex
CREATE INDEX "MissingPerson_createdAt_idx" ON "MissingPerson"("createdAt");

-- CreateIndex
CREATE INDEX "FoundPerson_condition_currentSafeLocation_idx" ON "FoundPerson"("condition", "currentSafeLocation");

-- CreateIndex
CREATE INDEX "FoundPerson_estimatedAgeGroup_estimatedGender_idx" ON "FoundPerson"("estimatedAgeGroup", "estimatedGender");

-- CreateIndex
CREATE INDEX "FoundPerson_createdAt_idx" ON "FoundPerson"("createdAt");

-- CreateIndex
CREATE INDEX "Center_centerType_capacityStatus_idx" ON "Center"("centerType", "capacityStatus");

-- CreateIndex
CREATE INDEX "Center_locationLat_locationLng_idx" ON "Center"("locationLat", "locationLng");

-- CreateIndex
CREATE INDEX "Center_createdAt_idx" ON "Center"("createdAt");
