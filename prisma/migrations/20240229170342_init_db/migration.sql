-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "photo" TEXT,
    "surveyCount" INTEGER NOT NULL DEFAULT 0,
    "doneSurveys" INTEGER NOT NULL DEFAULT 0,
    "deleted" BOOLEAN DEFAULT false,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Place" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "longitude" REAL,
    "latitude" REAL,
    "radius" REAL,
    "parentId" INTEGER,
    "deleted" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Place_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Place" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "interviewTotal" INTEGER,
    "interviewDone" INTEGER,
    "initialDate" DATETIME,
    "finalDate" DATETIME,
    "withBoundary" BOOLEAN,
    "withAudio" BOOLEAN,
    "goalTotal" INTEGER,
    "goalCount" INTEGER,
    "deleted" BOOLEAN DEFAULT false,
    "minDistance" REAL,
    "placeId" INTEGER,
    "userId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Survey_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Survey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "surveyId" INTEGER,
    "userId" INTEGER,
    "status" INTEGER,
    "collected_at" DATETIME,
    "longitude" REAL,
    "latitude" REAL,
    "duration" INTEGER,
    "deleted" BOOLEAN DEFAULT false,
    "rejection_cause" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "placeId" INTEGER,
    CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Interview_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Interview_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "resume" TEXT,
    "surveyId" INTEGER,
    "deleted" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Section_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "type" TEXT,
    "resume" TEXT,
    "minimumValue" INTEGER,
    "maximumValue" INTEGER,
    "required" BOOLEAN,
    "withAudio" BOOLEAN,
    "sectionId" INTEGER,
    "parentId" INTEGER,
    "deleted" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Question_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Question" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alternative" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT,
    "deleted" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AlternativesOnQuestions" (
    "questionId" INTEGER NOT NULL,
    "alternativeId" INTEGER NOT NULL,
    "deleted" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("questionId", "alternativeId"),
    CONSTRAINT "AlternativesOnQuestions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AlternativesOnQuestions_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "Alternative" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionResponse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT,
    "questionId" INTEGER,
    "interviewId" INTEGER,
    "userId" INTEGER,
    "deleted" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuestionResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "QuestionResponse_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "QuestionResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AlternativeToQuestionResponse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AlternativeToQuestionResponse_A_fkey" FOREIGN KEY ("A") REFERENCES "Alternative" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AlternativeToQuestionResponse_B_fkey" FOREIGN KEY ("B") REFERENCES "QuestionResponse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_code_key" ON "User"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_AlternativeToQuestionResponse_AB_unique" ON "_AlternativeToQuestionResponse"("A", "B");

-- CreateIndex
CREATE INDEX "_AlternativeToQuestionResponse_B_index" ON "_AlternativeToQuestionResponse"("B");
