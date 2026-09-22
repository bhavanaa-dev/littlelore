// backend/src/controllers/bookController.js
const axios = require('axios');
const prisma = require('../prisma/client');
const path = require('path');
const fs = require('fs');

function loadCuratedFromFile() {
  const candidates = [
    path.join(__dirname, '..', 'data', 'curatedBooks.json'),
    path.join(__dirname, '..', '..', 'data', 'curatedBooks.json'),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const data = fs.readFileSync(p, 'utf-8');
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(`Could not load curated books from ${p}: ${e.message}`);
    }
  }
  return [];
}

// Resolve a legitimate reading link + honest access label for any book shape.
// - Project Gutenberg ebook URL  -> "Read Free" (verified full text)
// - ISBN present                  -> "Preview" via Open Library ISBN page (borrow/preview when available)
// - Other readUrl / OL work id    -> "Preview" to that page
// - Nothing                       -> "No online text available" (never fabricate a URL)
function withAccess(book) {
  if (!book || typeof book !== 'object') return book;
  const out = { ...book };
  const readUrl = out.readUrl || '';
  const gutenberg = readUrl.match(/gutenberg\.org\/ebooks\/(\d+)/);
  if (gutenberg) {
    out.accessType = 'free';
    out.accessLabel = 'Read Free';
    out.readingUrl = readUrl;
    out.gutenbergId = gutenberg[1];
  } else if (out.isbn) {
    out.accessType = 'preview';
    out.accessLabel = 'Preview';
    out.readingUrl = `https://openlibrary.org/isbn/${out.isbn}`;
  } else if (readUrl) {
    out.accessType = 'preview';
    out.accessLabel = 'Preview';
    out.readingUrl = readUrl;
  } else if (out.openLibraryId) {
    out.accessType = 'preview';
    out.accessLabel = 'Preview';
    out.readingUrl = `https://openlibrary.org/works/${out.openLibraryId}`;
  } else {
    out.accessType = 'none';
    out.accessLabel = 'No online text available';
    out.readingUrl = null;
  }
  return out;
}

// Helper to map Open Library response to our simplified book shape
function mapOpenLibraryDoc(doc) {
  const workId = (doc.key || '').replace('/works/', '');
  let author = 'Unknown';
  if (Array.isArray(doc.author_name) && doc.author_name.length > 0) {
    author = doc.author_name.join(', ');
  }
  let description = null;
  if (doc.first_sentence) {
    description = typeof doc.first_sentence === 'string' ? doc.first_sentence : doc.first_sentence[0];
  }
  return {
    id: `ol-${workId}`,
    title: doc.title || 'Untitled',
    author,
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
    openLibraryId: workId,
    external: true,
    category: 'Open Library',
    description,
    year: doc.first_publish_year || null,
    readUrl: workId ? `https://openlibrary.org/works/${workId}` : null,
  };
}

function applyCuratedFilters(books, { category, search }) {
  let out = books;
  if (category) {
    const c = category.toLowerCase();
    out = out.filter((b) => (b.category || '').toLowerCase() === c);
  }
  if (search) {
    const s = search.toLowerCase();
    out = out.filter(
      (b) =>
        (b.title || '').toLowerCase().includes(s) ||
        (b.author || '').toLowerCase().includes(s)
    );
  }
  return out;
}

async function getCuratedList() {
  // Prefer the database when available (populated by prisma/seed.js),
  // otherwise fall back to the static JSON file so the library is never empty.
  const fileBooks = loadCuratedFromFile();
  const fileById = new Map(fileBooks.map((b) => [b.id, b]));
  try {
    if (prisma && prisma.book && typeof prisma.book.findMany === 'function') {
      const rows = await prisma.book.findMany({ orderBy: { title: 'asc' } });
      if (rows && rows.length > 0) {
        // Enrich rows with file values for any fields the generated Prisma
        // client may not know yet (e.g. after additive schema changes).
        return rows.map((r) => ({ ...(fileById.get(r.id) || {}), ...Object.fromEntries(Object.entries(r).filter(([, v]) => v !== null && v !== undefined)) }));
      }
    }
  } catch (e) {
    console.warn('DB curated lookup failed, using JSON fallback:', e.message);
  }
  return fileBooks;
}

exports.getCuratedBooks = async (req, res, next) => {
  try {
    const books = await getCuratedList();
    const filtered = applyCuratedFilters(books, {
      category: req.query.category,
      search: req.query.search,
    });
    res.json(filtered.map(withAccess));
  } catch (err) {
    // Last-resort: serve the file synchronously so homepage never breaks
    try {
      res.json(applyCuratedFilters(loadCuratedFromFile(), {
        category: req.query.category,
        search: req.query.search,
      }).map(withAccess));
    } catch (e2) {
      next(err);
    }
  }
};

exports.searchBooks = async (req, res, next) => {
  try {
    const { q, title, author } = req.query;
    const query = (q || title || author || '').trim();
    if (!query && !title && !author) {
      return res.status(400).json({ error: 'Missing query parameter q (or title/author)' });
    }
    const params = { limit: 20 };
    if (q) params.q = q;
    if (title) params.title = title;
    if (author) params.author = author;
    const url = `https://openlibrary.org/search.json?${new URLSearchParams(params)}`;
    const response = await axios.get(url, { timeout: 10000 });
    const docs = response.data.docs || [];
    const results = docs.slice(0, 20).map(mapOpenLibraryDoc).map(withAccess);
    // Return results as-is (possibly empty) so the frontend can show a
    // proper "no results" state while keeping the curated collection visible.
    res.json(results);
  } catch (err) {
    console.error('Open Library search error:', err.message);
    res.status(502).json({ error: 'Open Library search failed. Showing curated collection instead.' });
  }
};

exports.getBookDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    // 1) Curated book (DB first, then file)
    const curated = await getCuratedList();
    const found = curated.find((b) => b.id === id || b.openLibraryId === id);
    if (found) {
      return res.json(withAccess(found));
    }
    // 2) Open Library work (ids may arrive as "ol-XXXX" from search)
    const workId = id.startsWith('ol-') ? id.slice(3) : id;
    if (workId.startsWith('curated')) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const url = `https://openlibrary.org/works/${workId}.json`;
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data;
    let author = 'Unknown';
    let authorKey = data.authors && data.authors[0] && data.authors[0].author && data.authors[0].author.key;
    if (authorKey && typeof authorKey === 'string' && authorKey.startsWith('/authors/')) {
      try {
        const ar = await axios.get(`https://openlibrary.org${authorKey}.json`, { timeout: 8000 });
        if (ar.data && ar.data.name) author = ar.data.name;
        else author = authorKey;
      } catch (_) {
        author = authorKey;
      }
    } else if (typeof authorKey === 'string') {
      author = authorKey;
    }
    const book = {
      id: workId,
      title: data.title || 'Untitled',
      author,
      coverUrl: data.covers && data.covers[0] && data.covers[0] > 0
        ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
        : null,
      description: data.description ? (typeof data.description === 'string' ? data.description : data.description.value) : null,
      external: true,
      openLibraryId: workId,
      category: Array.isArray(data.subjects) && data.subjects[0] ? String(data.subjects[0]) : 'Open Library',
      year: null,
      readUrl: `https://openlibrary.org/works/${workId}`,
    };
    res.json(withAccess(book));
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: 'Book not found' });
    }
    next(err);
  }
};

// Free full-text proxy for public-domain curated books.
// Fetches the Project Gutenberg plain text (derived from the stored,
// verified readUrl — never constructed from user input), strips the
// license header/footer, and returns readable text for the in-app reader.
const textCache = new Map();
exports.getBookText = async (req, res, next) => {
  try {
    const { id } = req.params;
    const curated = await getCuratedList();
    const found = curated.find((b) => b.id === id);
    if (!found) return res.status(404).json({ error: 'Book not found' });
    const m = (found.readUrl || '').match(/gutenberg\.org\/ebooks\/(\d+)/);
    if (!m) return res.status(404).json({ error: 'No free full text available for this book' });
    const gid = m[1];
    if (textCache.has(gid)) return res.json(textCache.get(gid));
    const url = `https://www.gutenberg.org/cache/epub/${gid}/pg${gid}.txt`;
    const response = await axios.get(url, {
      timeout: 25000,
      responseType: 'text',
      maxContentLength: 5 * 1024 * 1024,
      headers: { 'User-Agent': 'LittleLore/1.0' },
    });
    let text = String(response.data || '').replace(/\r/g, '');
    const start = text.indexOf('*** START OF');
    if (start >= 0) {
      const nl = text.indexOf('\n', start);
      text = text.slice(nl + 1);
    }
    const end = text.lastIndexOf('*** END OF');
    if (end >= 0) text = text.slice(0, end);
    text = text.trim();
    const TRUNC = 150000;
    const truncated = text.length > TRUNC;
    if (truncated) text = text.slice(0, TRUNC).trim() + '\n\n[… continued on Project Gutenberg …]';
    const payload = {
      id: found.id,
      title: found.title,
      author: found.author,
      source: found.readUrl,
      truncated,
      text,
    };
    textCache.set(gid, payload);
    res.json(payload);
  } catch (err) {
    next(err);
  }
};

exports.getSavedBooks = async (req, res, next) => {
  try {
    const books = await prisma.savedBook.findMany();
    res.json(books);
  } catch (err) {
    next(err);
  }
};

exports.saveBook = async (req, res, next) => {
  try {
    const { id, title, author, coverUrl, openLibraryId, external } = req.body;
    if (!id || !title) {
      return res.status(400).json({ error: 'Missing required fields id and title' });
    }
    // Prevent duplicate saves (unique on id)
    const existing = await prisma.savedBook.findUnique({ where: { id } });
    if (existing) {
      return res.status(409).json({ error: 'Book already saved' });
    }
    const saved = await prisma.savedBook.create({
      data: { id, title, author, coverUrl, openLibraryId, external: !!external },
    });
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

exports.deleteSavedBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.savedBook.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
