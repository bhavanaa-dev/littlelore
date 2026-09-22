// frontend/src/components/SearchBar.jsx
import React, { useEffect, useRef, useState } from 'react';

function SearchBar({ onSearch, initialValue = '', debounceMs = 600 }) {
  const [query, setQuery] = useState(initialValue);
  const timer = useRef(null);
  const firstRender = useRef(true);

  // Keep in sync when parent changes the value (e.g. URL param)
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Debounced search: fires when the user pauses typing (not on every keystroke)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onSearch(query.trim());
    }, debounceMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timer.current) clearTimeout(timer.current);
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <input
        type="text"
        placeholder="Search books by title or author…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow p-2 border border-sage-light rounded-l"
      />
      <button type="submit" className="button-primary rounded-r">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
