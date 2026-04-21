import React from 'react';

export default function Spinner({ className = 'w-4 h-4', label }) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.4" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      {label && <span>{label}</span>}
    </span>
  );
}
