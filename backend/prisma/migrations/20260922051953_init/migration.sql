-- CreateTable
CREATE TABLE "SavedBook" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "coverUrl" TEXT,
    "openLibraryId" TEXT,
    "external" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SavedBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedBook_openLibraryId_key" ON "SavedBook"("openLibraryId");
