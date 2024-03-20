-- CreateTable
CREATE TABLE "Quota" (
    "surveyId" INTEGER NOT NULL,
    "placeId" INTEGER NOT NULL,
    "goalTotal" INTEGER,
    "goalCount" INTEGER,

    PRIMARY KEY ("surveyId", "placeId"),
    CONSTRAINT "Quota_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Quota_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
