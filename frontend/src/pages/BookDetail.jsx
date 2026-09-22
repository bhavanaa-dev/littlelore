// frontend/src/pages/BookDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { CURATED_BOOKS } from '../data/curatedBooks';
import { addToLocalShelf } from '../shelf';
import { getAccess, getPreview } from '../data/reading';
import ReaderView from '../components/ReaderView';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const decodedId = decodeURIComponent(id || '');
  const [book, setBook] = useState(() => CURATED_BOOKS.find((b) => b.id === decodedId) || null);
  const [loading, setLoading] = useState(!book);
  const [error, setError] = useState(null);
  const [imgOk, setImgOk] = useState(true);
  const [savedMsg, setSavedMsg] = useState('');
  const [readerOpen, setReaderOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchDetail() {
      setLoading(!book);
      setError(null);
      try {
        const res = await api.get(`/detail/${encodeURIComponent(decodedId)}`);
        if (!cancelled && res.data) setBook(res.data);
      } catch (err) {
        if (!book) {
          console.error(err);
          if (!cancelled) setError('Failed to load book details');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDetail();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedId]);

  const handleSave = async () => {
    if (!book) return;
    const payload = {
      id: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      openLibraryId: book.openLibraryId || null,
      external: !!book.external,
    };
    try {
      await api.post('/saved', payload);
      setSavedMsg('Saved to My Shelf ✓');
    } catch (err) {
      if (err.response?.status === 409) {
        setSavedMsg('Already on your shelf ✓');
      } else {
        addToLocalShelf({ ...payload, category: book.category, year: book.year, description: book.description, readUrl: book.readUrl });
        setSavedMsg('Saved to My Shelf (offline) ✓');
      }
    }
    addToLocalShelf({ ...payload, category: book.category, year: book.year, description: book.description, readUrl: book.readUrl });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!book) return <p>No book found.</p>;

  const access = getAccess(book);
  const preview = getPreview(book);
  const badgeClass = access.type === 'free' ? 'badge-free' : access.type === 'preview' ? 'badge-preview' : 'badge-none';

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="button-ghost text-sm mb-4">← Back</button>

      <div className="detail-shell p-6 md:p-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3" style={{ maxWidth: '16rem' }}>
          {book.coverUrl && imgOk ? (
            <img src={book.coverUrl} alt={`${book.title} cover`} className="detail-cover w-full" onError={() => setImgOk(false)} />
          ) : (
            <div className="cover-fallback detail-cover" style={{ aspectRatio: '2 / 3' }}>
              <span className="fb-title">{book.title}</span>
              <span className="fb-author">{book.author || 'Unknown'}</span>
            </div>
          )}
          <div style={{ marginTop: '0.75rem' }}>
            <span className={`access-badge ${badgeClass}`} style={{ position: 'static' }}>{access.label}</span>
          </div>
        </div>
        <div className="md:w-2/3">
          <div className="preview-kicker" style={{ color: 'var(--color-clay)' }}>{book.category || 'LittleLore'}</div>
          <h1 className="text-3xl mb-1" style={{ color: 'var(--color-ink)' }}>{book.title}</h1>
          <p className="text-lg mb-3" style={{ color: 'var(--color-muted)' }}>
            {book.author || 'Unknown'}{book.year ? ` · ${book.year}` : ''}
          </p>
          {book.description && <p className="mb-4 leading-relaxed">{book.description}</p>}
          <div className="flex flex-wrap gap-2 mt-4">
            {access.type === 'free' ? (
              <button className="button-accent" onClick={() => setReaderOpen(true)}>Read This Book</button>
            ) : access.url ? (
              <a className="button-accent" style={{ textDecoration: 'none' }} href={access.url} target="_blank" rel="noreferrer">
                Read Online
              </a>
            ) : (
              <span className="notice-warm">No online text available for this title yet.</span>
            )}
            <button className="button-primary" onClick={handleSave}>Save to My Shelf</button>
            <Link to="/explore" className="button-ghost" style={{ textDecoration: 'none' }}>Browse more</Link>
          </div>
          {savedMsg && <p className="text-sm mt-2" style={{ color: '#2F7D4F' }}>{savedMsg}</p>}
          {book.isbn && <p className="text-xs mt-3" style={{ color: 'var(--color-muted)' }}>ISBN {book.isbn}</p>}
        </div>
      </div>

      {/* Immersive preview panel */}
      <div className="preview-modal" style={{ maxWidth: '100%', marginTop: '1.5rem', maxHeight: 'none' }}>
        {book.coverUrl && imgOk && (
          <div className="preview-atmos" style={{ backgroundImage: `url(${book.coverUrl})` }} />
        )}
        <div className="preview-body">
          <div className="preview-kicker">Preview · {preview.kind === 'quote' ? 'From the text' : 'Story teaser'}</div>
          {preview.lines.slice(0, 4).map((l, i) => (
            <div key={i} className="preview-line" style={{ opacity: 1, animation: 'none' }}>
              “{l.text}”
              {preview.kind === 'quote' && l.source && <span className="preview-src">— {l.source}</span>}
            </div>
          ))}
          <p className="preview-note">
            {preview.kind === 'quote'
              ? 'Direct excerpts from the public-domain text.'
              : 'Story teaser — not a direct quote.'}
          </p>
        </div>
      </div>

      {readerOpen && access.type === 'free' && (
        <ReaderView book={book} onClose={() => setReaderOpen(false)} />
      )}
    </div>
  );
}

export default BookDetail;
