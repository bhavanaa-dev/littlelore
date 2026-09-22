// frontend/src/components/BookCard.jsx
import React, { useState } from 'react';
import api from '../api';
import { addToLocalShelf, removeFromLocalShelf } from '../shelf';
import { getAccess } from '../data/reading';
import BookPreview from './BookPreview';
import ReaderView from './ReaderView';

function BookCard({ book, onSave, onDelete, showSave = true, showDelete = false }) {
  const [imgOk, setImgOk] = useState(true);
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);

  const access = getAccess(book);
  const showCover = book.coverUrl && imgOk;

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
    } catch (err) {
      const status = err.response?.status;
      if (status !== 409) {
        // Backend/DB unavailable: fall back to local shelf so the feature keeps working
        addToLocalShelf({ ...payload, category: book.category, year: book.year, description: book.description, readUrl: book.readUrl });
      }
    }
    // Always mirror to local shelf for offline resilience
    addToLocalShelf({ ...payload, category: book.category, year: book.year, description: book.description, readUrl: book.readUrl });
    setSaved(true);
    if (onSave) onSave();
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await api.delete(`/saved/${book.id}`);
    } catch (err) {
      // ignore — still remove locally
    }
    removeFromLocalShelf(book.id);
    if (onDelete) onDelete();
  };

  const badgeClass = access.type === 'free' ? 'badge-free' : access.type === 'preview' ? 'badge-preview' : 'badge-none';

  return (
    <>
      <div className="book-card cursor-pointer" onClick={() => setPreviewOpen(true)}>
        <div className="cover-wrap">
          {showCover ? (
            <img
              src={book.coverUrl}
              alt={`${book.title} cover`}
              className="cover-img"
              loading="lazy"
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="cover-fallback">
              <span className="fb-title">{book.title}</span>
              <span className="fb-author">{book.author || 'Unknown'}</span>
            </div>
          )}
          <span className={`access-badge ${badgeClass}`}>{access.label}</span>
        </div>
        <div className="book-meta">
          <div className="book-title" title={book.title}>{book.title}</div>
          <div className="book-author" title={book.author}>{book.author || 'Unknown'}</div>
          <div className="book-sub">
            {book.category && <span className="book-cat">{book.category}</span>}
            {book.year ? <span className="book-year">{book.year}</span> : null}
          </div>
          <div className="mt-2 flex" style={{ gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
            {showSave && (
              <button className="button-primary text-xs" style={{ flexGrow: 1 }} onClick={handleSave}>
                {saved ? 'Saved ✓' : 'Save'}
              </button>
            )}
            {access.url && (
              access.type === 'free' ? (
                <button
                  className="button-accent text-xs"
                  onClick={(e) => { e.stopPropagation(); setReaderOpen(true); }}
                >
                  Read
                </button>
              ) : (
                <a
                  className="button-accent text-xs"
                  style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
                  href={access.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read
                </a>
              )
            )}
            {showDelete && (
              <button className="bg-red-500 text-white text-xs px-2 py-1 rounded" onClick={handleDelete}>Remove</button>
            )}
          </div>
        </div>
      </div>
      {previewOpen && (
        <BookPreview book={book} onClose={() => setPreviewOpen(false)} onRead={() => { setPreviewOpen(false); setReaderOpen(true); }} />
      )}
      {readerOpen && access.type === 'free' && (
        <ReaderView book={book} onClose={() => setReaderOpen(false)} />
      )}
    </>
  );
}

export default BookCard;
