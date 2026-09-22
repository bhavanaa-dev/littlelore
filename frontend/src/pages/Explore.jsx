// frontend/src/pages/Explore.jsx
import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { CURATED_BOOKS, CATEGORIES } from '../data/curatedBooks';

function Explore() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const urlQuery = params.get('q') || '';
  const urlCategory = params.get('category') || '';

  const [curated, setCurated] = useState(CURATED_BOOKS);
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [category, setCategory] = useState(urlCategory);
  const [results, setResults] = useState(null); // null = not searching; array = OL results
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [notice, setNotice] = useState(null);

  // Load curated library on first mount (no search required)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await api.get('/curated');
        if (!cancelled && Array.isArray(res.data) && res.data.length > 0) {
          setCurated(res.data);
        }
      } catch (err) {
        console.error('Curated load failed, using local fallback', err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep state in sync when navigating via category links (Home -> Explore?category=)
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setCategory(p.get('category') || '');
    setSearchTerm(p.get('q') || '');
    if (!p.get('q')) setResults(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Remote Open Library search (debounced via SearchBar, or on submit)
  const runSearch = async (term) => {
    const p = new URLSearchParams(location.search);
    if (term) p.set('q', term);
    else p.delete('q');
    navigate(`/explore?${p.toString()}`, { replace: true });
    setSearchTerm(term);

    if (!term) {
      setResults(null);
      setNotice(null);
      return;
    }
    setSearching(true);
    setNotice(null);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(term)}`);
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Search failed', err.message);
      setResults([]);
      setNotice('Online search is unavailable right now — showing matching books from our shelves below.');
    } finally {
      setSearching(false);
    }
  };

  const selectCategory = (cat) => {
    const next = cat === category ? '' : cat;
    setCategory(next);
    const p = new URLSearchParams(location.search);
    if (next) p.set('category', next);
    else p.delete('category');
    navigate(`/explore?${p.toString()}`, { replace: true });
  };

  // Books to display: OL results when searching, otherwise curated filtered by category + local text
  const visible = useMemo(() => {
    if (results !== null) {
      let out = results;
      if (category) out = out.filter((b) => (b.category || '') === category);
      return out;
    }
    let out = curated;
    if (category) out = out.filter((b) => (b.category || '') === category);
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const localMatches = out.filter(
        (b) =>
          (b.title || '').toLowerCase().includes(s) ||
          (b.author || '').toLowerCase().includes(s)
      );
      // While waiting for remote results, show local matches immediately
      if (localMatches.length > 0) return localMatches;
      return out;
    }
    return out;
  }, [results, curated, category, searchTerm]);

  const categories = useMemo(() => {
    const fromData = [...new Set(curated.map((b) => b.category).filter(Boolean))];
    return fromData.length > 0 ? fromData : CATEGORIES;
  }, [curated]);

  return (
    <div>
      <section className="hero mb-8" style={{ padding: '2rem 1.75rem' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: '0.4rem' }}>Explore Books</h1>
          <p className="tagline" style={{ fontSize: '1rem' }}>
            {category ? `Browsing ${category}` : 'The full LittleLore collection, plus live search across Open Library.'}
          </p>
        </div>
      </section>

      <SearchBar onSearch={runSearch} initialValue={urlQuery} />

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => selectCategory('')}
          className={`cat-chip ${!category ? 'cat-chip-active' : ''}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => selectCategory(cat)}
            className={`cat-chip ${category === cat ? 'cat-chip-active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <div key={i} className="skeleton" />)}
        </div>
      )}
      {searching && <p>Searching online…</p>}
      {notice && <p className="notice-warm mb-4">{notice}</p>}

      {!loading && !searching && visible.length === 0 && (
        <div className="text-center py-8">
          <p className="mb-2">No books found{searchTerm ? ` for “${searchTerm}”` : ''}{category ? ` in ${category}` : ''}.</p>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Try a different title, author, or category.</p>
        </div>
      )}

      {!loading && (
        <>
          <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
            {visible.length} {visible.length === 1 ? 'book' : 'books'}
            {results !== null ? ' · live results — click any card for a preview' : ' · click any card for a cinematic preview'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {visible.map((book) => (
              <BookCard key={book.id} book={book} showSave={true} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Explore;
