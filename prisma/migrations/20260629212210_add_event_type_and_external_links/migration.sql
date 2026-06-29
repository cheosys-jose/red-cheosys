-- AlterTable
ALTER TABLE "Image" ADD COLUMN "fileSize" INTEGER;
ALTER TABLE "Image" ADD COLUMN "height" INTEGER;
ALTER TABLE "Image" ADD COLUMN "width" INTEGER;

-- CreateTable
CREATE TABLE "ExternalLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'news',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "rejectionReason" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceType" TEXT NOT NULL DEFAULT 'INTERNAL',
    "sourceUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "locationLat" REAL,
    "locationLng" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "eventType" TEXT NOT NULL DEFAULT 'other',
    "alertType" TEXT NOT NULL DEFAULT 'other',
    "severity" TEXT NOT NULL DEFAULT 'SUPPORT',
    "affectedPeople" TEXT,
    "exactLocation" TEXT NOT NULL,
    "reporterContact" TEXT,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Alert" ("affectedPeople", "alertType", "createdAt", "description", "exactLocation", "id", "isActive", "locationLat", "locationLng", "reporterContact", "severity", "sourceType", "sourceUrl", "updatedAt", "verificationStatus") SELECT "affectedPeople", "alertType", "createdAt", "description", "exactLocation", "id", "isActive", "locationLat", "locationLng", "reporterContact", "severity", "sourceType", "sourceUrl", "updatedAt", "verificationStatus" FROM "Alert";
DROP TABLE "Alert";
ALTER TABLE "new_Alert" RENAME TO "Alert";
CREATE INDEX "Alert_eventType_severity_idx" ON "Alert"("eventType", "severity");
CREATE INDEX "Alert_alertType_severity_idx" ON "Alert"("alertType", "severity");
CREATE INDEX "Alert_locationLat_locationLng_idx" ON "Alert"("locationLat", "locationLng");
CREATE INDEX "Alert_createdAt_idx" ON "Alert"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ExternalLink_category_status_idx" ON "ExternalLink"("category", "status");

-- CreateIndex
CREATE INDEX "ExternalLink_createdAt_idx" ON "ExternalLink"("createdAt");
