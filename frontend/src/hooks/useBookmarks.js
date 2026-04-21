import { useCallback, useEffect, useState } from 'react';

const KEY = 'basera_bookmarks';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let listeners = [];
function emit(value) {
  listeners.forEach((l) => l(value));
}

export function useBookmarks() {
  const [ids, setIds] = useState(read);

  useEffect(() => {
    const l = (v) => setIds(v);
    listeners.push(l);
    return () => { listeners = listeners.filter((x) => x !== l); };
  }, []);

  const has = useCallback((id) => ids.includes(id), [ids]);

  const toggle = useCallback((id) => {
    const current = read();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    localStorage.setItem(KEY, JSON.stringify(next));
    emit(next);
    return next.includes(id);
  }, []);

  return { ids, has, toggle };
}
