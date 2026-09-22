-- CreateTable Book (curated library, seeded from curatedBooks.json)
CREATE TABLE IF NOT EXISTS "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "category" TEXT,
    "coverUrl" TEXT,
    "description" TEXT,
    "year" INTEGER,
    "isbn" TEXT,
    "readUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "external" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);
