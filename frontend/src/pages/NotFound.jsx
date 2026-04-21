import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import { Icon } from '../components/Icon.jsx';

export default function NotFound() {
  return (
    <>
      <SEO title="Page not found" description="The page you're looking for doesn't exist." />
      <div className="min-h-[70vh] grid place-items-center px-5">
        <div className="text-center max-w-md">
          <p className="text-[11px] font-semibold text-accent-700 tracking-[0.18em] uppercase">404 · Not found</p>
          <h1 className="font-display text-5xl sm:text-6xl font-extrabold text-ink mt-3 leading-none">
            We can't find that room.
          </h1>
          <p className="mt-5 text-ink-mute leading-relaxed">
            The page you were looking for has moved or never existed.
            Try heading back home or browse all available rooms.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/" className="btn-primary">
              <Icon name="arrowLeft" className="w-4 h-4" />
              Back home
            </Link>
            <Link to="/listings" className="btn-secondary">
              Browse rooms
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
