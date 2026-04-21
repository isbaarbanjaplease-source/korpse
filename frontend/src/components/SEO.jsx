import { useEffect } from 'react';

const DEFAULT_TITLE = 'BASERA — Rooms in Srinagar Garhwal';
const DEFAULT_DESC =
  'Find verified rooms, PGs and shared apartments in Srinagar Garhwal. Search by locality, price and gender. Connect directly with owners.';

function setMeta(name, content, property = false) {
  if (!content) return;
  const attr = property ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * SEO – set <title> and meta tags imperatively.
 * Avoids pulling in react-helmet just for a couple of pages.
 */
export default function SEO({ title, description, image }) {
  useEffect(() => {
    const fullTitle = title ? `${title} · BASERA` : DEFAULT_TITLE;
    document.title = fullTitle;
    setMeta('description', description || DEFAULT_DESC);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description || DEFAULT_DESC, true);
    if (image) setMeta('og:image', image, true);
  }, [title, description, image]);

  return null;
}
