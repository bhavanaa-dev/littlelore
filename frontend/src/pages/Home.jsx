// frontend/src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import BookCard from "../components/BookCard";
import { Link, useNavigate } from "react-router-dom";
import { CURATED_BOOKS, CATEGORIES } from "../data/curatedBooks";
import { getLocalShelf } from "../shelf";

function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState(CURATED_BOOKS);
  const [loading, setLoading] = useState(true);
  const [heroQuery, setHeroQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function fetchFeatured() {
      try {
        const res = await api.get("/curated");
        if (!cancelled && Array.isArray(res.data) && res.data.length > 0) {
          setBooks(res.data);
        }
      } catch (err) {
        console.error('Curated fetch failed, using local fallback', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = useMemo(() => {
    const flagged = books.filter((b) => b.featured);
    return (flagged.length > 0 ? flagged : books).slice(0, 8);
  }, [books]);

  const byCategory = useMemo(() => {
    const groups = {};
    for (const b of books) {
      const cat = b.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(b);
    }
    return groups;
  }, [books]);

  const categories = CATEGORIES.length > 0 ? CATEGORIES : Object.keys(byCategory);
  const freeCount = useMemo(() => books.filter((b) => (b.readUrl || '').includes('gutenberg.org')).length, [books]);
  const featuredIds = useMemo(() => new Set(featured.map((b) => b.id)), [featured]);

  // Continue Exploring: shelf-aware picks, else the rest of the collection.
  const continueExploring = useMemo(() => {
    const shelf = getLocalShelf();
    const shelfCats = [...new Set(shelf.map((b) => b.category).filter(Boolean))];
    let pool = books.filter((b) => !featuredIds.has(b.id));
    if (shelfCats.length > 0) {
      const matched = pool.filter((b) => shelfCats.includes(b.category));
      if (matched.length >= 4) pool = matched;
    }
    return pool.slice(0, 4);
  }, [books, featuredIds]);

  const submitHeroSearch = (e) => {
    e.preventDefault();
    const q = heroQuery.trim();
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : '/explore');
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero mb-10">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="preview-kicker">LittleLore · A pocket library</div>
          <h1>Great books, beautifully kept.</h1>
          <div className="hero-rule" />
          <p className="tagline">
            Short stories, philosophy, psychology, novels, and fascinating facts —
            with cinematic previews and free reading where the public domain allows.
          </p>
          <form className="hero-search" onSubmit={submitHeroSearch}>
            <input
              type="text"
              placeholder="Search by title or author…"
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              aria-label="Search books"
            />
            <button type="submit">Search</button>
          </form>
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/explore" className="button-accent" style={{ textDecoration: 'none' }}>Explore Library</Link>
            <span style={{ fontSize: '0.85rem', color: '#D8CBA6' }}>
              {books.length} books · {categories.length} categories · {freeCount} free to read
            </span>
          </div>
        </div>
      </section>

      {/* Featured books */}
      <section className="mb-10">
        <div className="section-head">
          <h2>Featured Books</h2>
          <Link to="/explore" className="section-link">View all →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((book) => (
              <BookCard key={book.id} book={book} showSave={true} />
            ))}
          </div>
        )}
      </section>

      {/* Browse by Category */}
      <section className="mb-10">
        <div className="section-head">
          <h2>Browse by Category</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/explore?category=${encodeURIComponent(cat)}`}
              className="cat-tile"
              style={{ textDecoration: 'none' }}
            >
              <div className="cat-name">{cat}</div>
              <div className="cat-count">{(byCategory[cat] || []).length} books →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Continue Exploring */}
      {!loading && continueExploring.length > 0 && (
        <section className="mb-10">
          <div className="section-head">
            <h2>Continue Exploring</h2>
            <Link to="/explore" className="section-link">Keep browsing →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {continueExploring.map((book) => (
              <BookCard key={book.id} book={book} showSave={true} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
