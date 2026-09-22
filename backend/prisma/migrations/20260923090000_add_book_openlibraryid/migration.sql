-- Add openLibraryId to Book (lets Preview access resolve to the exact OL work page)
ALTER TABLE "Book" ADD COLUMN IF NOT EXISTS "openLibraryId" TEXT;
