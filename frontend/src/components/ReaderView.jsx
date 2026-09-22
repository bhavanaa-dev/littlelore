// frontend/src/components/ReaderView.jsx
// Simple in-app reader for public-domain books with verified Gutenberg text.
// Fetches via the backend (/api/books/read/:id); otherwise links out.
import React, { useEffect, useState } from 'react';
import api from '../api';

function ReaderView({ book, onClose }) {
  const [text, setText] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/read/${encodeURIComponent(book.id)}`);
        if (!cancelled) {
          setText(res.data.text);
          setMeta(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Reader load failed', err.message);
          setError('Could not load the text here. You can still read it free on Project Gutenberg.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      cancelled = true;
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [book.id, onClose]);

  return (
    <div className="reader-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Read ${book.title}`}>
      <div className="reader-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="reader-head">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <h3>{book.title}</h3>
              <p>{book.author || 'Unknown'} · Free public-domain text via Project Gutenberg</p>
            </div>
            <button className="preview-close" style={{ position: 'static' }} onClick={onClose} aria-label="Close reader">✕</button>
          </div>
        </div>
        {loading && <div className="reader-text">Loading the text…</div>}
        {!loading && error && (
          <div className="reader-text">
            <p>{error}</p>
            {book.readUrl && (
              <p><a href={book.readUrl} target="_blank" rel="noreferrer">Open on Project Gutenberg →</a></p>
            )}
          </div>
        )}
        {!loading && !error && text && <div className="reader-text">{text}</div>}
        <div className="reader-foot">
          <span>Source: Project Gutenberg · free to read and share</span>
          {meta?.source && <a href={meta.source} target="_blank" rel="noreferrer">Continue on Gutenberg →</a>}
        </div>
      </div>
    </div>
  );
}

export default ReaderView;
