// frontend/src/shelf.js
// LocalStorage fallback for "My Shelf" so saving works even when the DB/backend is down.
const KEY = 'littlelore-shelf';

export function getLocalShelf() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isOnLocalShelf(id) {
  return getLocalShelf().some((b) => b.id === id);
}

export function addToLocalShelf(book) {
  const shelf = getLocalShelf();
  if (shelf.some((b) => b.id === book.id)) return shelf;
  const next = [...shelf, book];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — ignore
  }
  return next;
}

export function removeFromLocalShelf(id) {
  const next = getLocalShelf().filter((b) => b.id !== id);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}
