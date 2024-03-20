/*
  Warnings:

  - You are about to drop the column `goalCount` on the `Quota` table. All the data in the column will be lost.
  - You are about to drop the column `goalTotal` on the `Quota` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quota" (
    "surveyId" INTEGER NOT NULL,
    "placeId" INTEGER NOT NULL,
    "progTotal" INTEGER,
    "progCount" INTEGER,

    PRIMARY KEY ("surveyId", "placeId"),
    CONSTRAINT "Quota_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Quota_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Quota" ("placeId", "surveyId") SELECT "placeId", "surveyId" FROM "Quota";
DROP TABLE "Quota";
ALTER TABLE "new_Quota" RENAME TO "Quota";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
