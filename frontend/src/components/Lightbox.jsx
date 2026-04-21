import React, { useCallback, useEffect, useState } from 'react';
import { Icon } from './Icon.jsx';

export default function Lightbox({ images, startIndex = 0, open, onClose }) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => { if (open) setIndex(startIndex); }, [open, startIndex]);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose?.();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, next, prev, onClose]);

  if (!open || !images?.length) return null;

  return (
    <div className="fixed inset-0 z-[95] bg-ink/95 backdrop-blur-sm flex items-center justify-center animate-fadeIn"
         role="dialog" aria-modal="true" aria-label="Image viewer">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-canvas/70 hover:text-canvas transition-colors p-2"
        aria-label="Close"
      >
        <Icon name="close" className="w-6 h-6" />
      </button>

      <div className="absolute top-5 left-5 text-canvas/60 text-xs font-medium tracking-wide">
        {index + 1} / {images.length}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-canvas/80 hover:text-canvas bg-white/10 hover:bg-white/20 rounded-full w-11 h-11 flex items-center justify-center transition-colors"
            aria-label="Previous image"
          >
            <Icon name="chevronL" className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-canvas/80 hover:text-canvas bg-white/10 hover:bg-white/20 rounded-full w-11 h-11 flex items-center justify-center transition-colors"
            aria-label="Next image"
          >
            <Icon name="chevronR" className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="w-full h-full p-12 sm:p-16 flex items-center justify-center" onClick={onClose}>
        <img
          key={index}
          src={images[index]}
          alt=""
          className="max-h-full max-w-full object-contain rounded-lg shadow-lift animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-canvas w-5' : 'bg-canvas/40 hover:bg-canvas/70'}`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
