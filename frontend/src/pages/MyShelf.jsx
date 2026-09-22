// frontend/src/pages/MyShelf.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import BookCard from '../components/BookCard';
import { getLocalShelf } from '../shelf';

function mergeShelves(remote, local) {
  const map = new Map();
  for (const b of [...(remote || []), ...(local || [])]) {
    if (b && b.id && !map.has(b.id)) map.set(b.id, b);
  }
  return [...map.values()];
}

function MyShelf() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSaved = async () => {
    setLoading(true);
    setError(null);
    let remote = [];
    try {
      const res = await api.get('/saved');
      remote = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error('Saved fetch failed, using local shelf', err.message);
      setError('Online shelf unavailable — showing books saved on this device.');
    }
    setSaved(mergeShelves(remote, getLocalShelf()));
    setLoading(false);
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleDelete = async () => {
    await fetchSaved();
  };

  return (
    <div>
      <section className="hero mb-8" style={{ padding: '2rem 1.75rem' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: '0.4rem' }}>My Shelf</h1>
          <p className="tagline" style={{ fontSize: '1rem' }}>
            {saved.length > 0
              ? `${saved.length} ${saved.length === 1 ? 'book' : 'books'} kept close — click any card for a preview.`
              : 'Your saved books will live here.'}
          </p>
        </div>
      </section>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
        </div>
      )}
      {error && <p className="notice-warm mb-4">{error}</p>}
      {!loading && saved.length === 0 && <p>No saved books yet. Explore the library and tap “Save”.</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {saved.map((book) => (
          <BookCard key={book.id} book={book} showSave={false} showDelete={true} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default MyShelf;
