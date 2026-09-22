// frontend/src/components/BookPreview.jsx
// Immersive trailer-style preview: cinematic panel, staged lines, clear CTAs.
// Animations are lightweight CSS, skippable, and disabled under reduced-motion.
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { addToLocalShelf } from '../shelf';
import { getAccess, getPreview } from '../data/reading';

function BookPreview({ book, onClose, onRead }) {
  const navigate = useNavigate();
  const [lineCount, setLineCount] = useState(1);
  const [savedMsg, setSavedMsg] = useState('');
  const [imgOk, setImgOk] = useState(true);

  const preview = getPreview(book);
  const access = getAccess(book);
  const lines = preview.lines.slice(0, 4);

  // Reveal lines one at a time like a trailer; show all immediately under reduced motion.
  useEffect(() => {
    setLineCount(1);
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLineCount(lines.length);
      return undefined;
    }
    if (lines.length <= 1) {
      setLineCount(lines.length);
      return undefined;
    }
    const t = setInterval(() => {
      setLineCount((c) => {
        if (c >= lines.length) {
          clearInterval(t);
          return c;
        }
        return c + 1;
      });
    }, 1400);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSave = async (e) => {
    e.stopPropagation();
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
      if (err.response?.status === 409) setSavedMsg('Already on your shelf ✓');
      else setSavedMsg('Saved to My Shelf (offline) ✓');
    }
    addToLocalShelf({ ...payload, category: book.category, year: book.year, description: book.description, readUrl: book.readUrl });
  };

  const goDetails = () => {
    onClose();
    navigate(`/book/${encodeURIComponent(book.id)}`);
  };

  return (
    <div className="preview-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Preview of ${book.title}`}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        {book.coverUrl && imgOk && (
          <div className="preview-atmos" style={{ backgroundImage: `url(${book.coverUrl})` }} />
        )}
        <button className="preview-close" onClick={onClose} aria-label="Close preview">✕</button>
        <div className="preview-body">
          <div className="preview-kicker">LittleLore · Book Preview</div>
          <h2 className="preview-title">{book.title}</h2>
          <p className="preview-author">
            {book.author || 'Unknown'}{book.year ? ` · ${book.year}` : ''}{book.category ? ` · ${book.category}` : ''}
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {book.coverUrl && imgOk && (
              <img
                src={book.coverUrl}
                alt={`${book.title} cover`}
                style={{ width: '7.5rem', borderRadius: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', alignSelf: 'flex-start' }}
                onError={() => setImgOk(false)}
              />
            )}
            <div style={{ flex: '1 1 16rem', minWidth: 0 }}>
              {lines.slice(0, lineCount).map((l, i) => (
                <div key={i} className="preview-line" style={{ animationDelay: `${i * 0.15}s` }}>
                  “{l.text}”
                  {preview.kind === 'quote' && l.source && <span className="preview-src">— {l.source}</span>}
                </div>
              ))}
              <div className="preview-dots">
                {lines.map((_, i) => (
                  <span key={i} className={i < lineCount ? 'on' : ''} onClick={() => setLineCount(i + 1)} />
                ))}
                {lineCount < lines.length && (
                  <button onClick={() => setLineCount(lines.length)} style={{ background: 'none', border: 'none', color: '#B7A67E', fontSize: '0.75rem', cursor: 'pointer', marginLeft: '0.4rem' }}>
                    Show all →
                  </button>
                )}
              </div>
              <p className="preview-note">
                {preview.kind === 'quote' ? 'Direct excerpt from the public-domain text. ' : 'Story teaser — not a direct quote. '}
                <span className={`access-badge badge-${access.type === 'free' ? 'free' : access.type === 'preview' ? 'preview' : 'none'}`} style={{ position: 'static' }}>
                  {access.label}
                </span>
              </p>
            </div>
          </div>

          <div className="preview-actions">
            {access.type === 'free' ? (
              <button className="button-accent" onClick={() => onRead(book)}>Read This Book</button>
            ) : access.url ? (
              <a className="button-accent" style={{ textDecoration: 'none', display: 'inline-block' }} href={access.url} target="_blank" rel="noreferrer">
                Read This Book
              </a>
            ) : null}
            <button className="button-primary" style={{ background: '#3A5A4B' }} onClick={handleSave}>Save to My Shelf</button>
            <button className="button-ghost" style={{ color: '#F2EAD3', borderColor: 'rgba(242,234,211,0.4)' }} onClick={goDetails}>Full Details</button>
          </div>
          {savedMsg && <p style={{ fontSize: '0.82rem', color: '#9FD3A8', marginTop: '0.5rem' }}>{savedMsg}</p>}
        </div>
      </div>
    </div>
  );
}

export default BookPreview;
