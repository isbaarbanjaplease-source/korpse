import React, { useEffect } from 'react';
import { Icon } from './Icon.jsx';

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md', // sm | md | lg
  hideClose = false,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthClass =
    size === 'sm' ? 'max-w-sm' :
    size === 'lg' ? 'max-w-2xl' :
    'max-w-md';

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 bg-ink/30 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${widthClass} card bg-canvas-raised/95 backdrop-blur-xl p-6 sm:p-7 animate-scaleIn shadow-lift`}
      >
        {!hideClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-ink-faint hover:text-ink-soft transition-colors"
            aria-label="Close"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        )}

        {title && (
          <h2 id="modal-title" className="text-lg font-semibold text-ink pr-8">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-sm text-ink-mute mt-1.5 pr-4">{description}</p>
        )}

        <div className={title || description ? 'mt-5' : ''}>
          {children}
        </div>
      </div>
    </div>
  );
}
