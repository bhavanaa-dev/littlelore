// backend/prisma/seed.js
// Repeatable seed: upserts curated books into the Book table.
// Safe to run multiple times — uses INSERT ... ON CONFLICT (id) DO UPDATE,
// so no duplicates. Uses raw SQL so it works even while the dev server holds
// the generated Prisma client (which may not know the Book model yet).
// If the database is unreachable, the API falls back to curatedBooks.json.
const fs = require('fs');
const path = require('path');

async function main() {
  const jsonPath = path.join(__dirname, '..', 'src', 'data', 'curatedBooks.json');
  const fallbackPath = path.join(__dirname, '..', 'data', 'curatedBooks.json');
  const filePath = fs.existsSync(jsonPath) ? jsonPath : fallbackPath;
  const books = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`Seed source: ${filePath} (${books.length} books)`);

  let prisma;
  try {
    prisma = require('../src/prisma/client');
  } catch (e) {
    console.error('Could not load Prisma client. Run `npm install` in backend first.');
    throw e;
  }

  // Ensure the Book table exists (same shape as prisma/migrations/*_add_book/migration.sql)
  // plus additive columns from later migrations (IF NOT EXISTS = safe reruns).
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Book" (
      "id" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "author" TEXT,
      "category" TEXT,
      "coverUrl" TEXT,
      "description" TEXT,
      "year" INTEGER,
      "isbn" TEXT,
      "openLibraryId" TEXT,
      "readUrl" TEXT,
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "external" BOOLEAN NOT NULL DEFAULT false,
      CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
    );
  `);
  await prisma.$executeRawUnsafe(`ALTER TABLE "Book" ADD COLUMN IF NOT EXISTS "openLibraryId" TEXT;`);

  let upserted = 0;
  for (const b of books) {
    if (!b.id || !b.title) {
      console.warn('Skipping invalid entry (missing id/title):', JSON.stringify(b).slice(0, 120));
      continue;
    }
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Book" ("id","title","author","category","coverUrl","description","year","isbn","openLibraryId","readUrl","featured","external")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT ("id") DO UPDATE SET
         "title"=EXCLUDED."title","author"=EXCLUDED."author","category"=EXCLUDED."category",
         "coverUrl"=EXCLUDED."coverUrl","description"=EXCLUDED."description","year"=EXCLUDED."year",
         "isbn"=EXCLUDED."isbn","openLibraryId"=EXCLUDED."openLibraryId","readUrl"=EXCLUDED."readUrl",
         "featured"=EXCLUDED."featured","external"=EXCLUDED."external";`,
      b.id,
      b.title,
      b.author || null,
      b.category || null,
      b.coverUrl || null,
      b.description || null,
      typeof b.year === 'number' ? b.year : null,
      b.isbn || null,
      b.openLibraryId || null,
      b.readUrl || null,
      !!b.featured,
      !!b.external
    );
    upserted++;
  }
  const count = await prisma.$queryRawUnsafe('SELECT COUNT(*)::int AS count FROM "Book";');
  console.log(`Seed complete. Upserted: ${upserted}, total in DB: ${count[0].count}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e.message);
    console.error('The app still works: the API falls back to the curated JSON file when the DB is unavailable.');
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      const prisma = require('../src/prisma/client');
      await prisma.$disconnect();
    } catch (_) {
      // ignore
    }
  });
