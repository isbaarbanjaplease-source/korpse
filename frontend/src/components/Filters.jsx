import React, { useEffect, useState } from 'react';
import { LOCALITIES, ROOM_TYPES, GENDERS } from '../constants.js';
import { Icon } from './Icon.jsx';

/**
 * Filters – pill-style chip filter bar with floating-label search and price.
 * Controlled component: `filters` is the source of truth; `onChange` is called
 * with the next filters object.
 */
export default function Filters({ filters, onChange }) {
  const [local, setLocal] = useState(filters);
  useEffect(() => { setLocal(filters); }, [filters]);

  const setField = (k, v) => {
    const next = { ...local, [k]: v };
    setLocal(next);
    onChange(next);
  };

  const togglePill = (k, v) => {
    setField(k, local[k] === v ? '' : v);
  };

  const reset = () => {
    const cleared = { q: '', locality: '', roomType: '', gender: '', minPrice: '', maxPrice: '' };
    setLocal(cleared);
    onChange(cleared);
  };

  const hasAny = Object.values(local).some((v) => v !== '');

  return (
    <div id="filters" className="card p-5 sm:p-6 space-y-5">
      {/* Search + Price row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-7 float-field">
          <input
            id="filter-q"
            type="text"
            placeholder=" "
            value={local.q}
            onChange={(e) => setField('q', e.target.value)}
            data-testid="filter-search"
          />
          <label htmlFor="filter-q">Search title or description</label>
          <Icon name="search" className="w-4 h-4 text-ink-faint absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="sm:col-span-2 float-field">
          <input
            id="filter-min"
            type="number"
            min="0"
            placeholder=" "
            value={local.minPrice}
            onChange={(e) => setField('minPrice', e.target.value)}
            data-testid="filter-min-price"
          />
          <label htmlFor="filter-min">Min ₹</label>
        </div>

        <div className="sm:col-span-2 float-field">
          <input
            id="filter-max"
            type="number"
            min="0"
            placeholder=" "
            value={local.maxPrice}
            onChange={(e) => setField('maxPrice', e.target.value)}
            data-testid="filter-max-price"
          />
          <label htmlFor="filter-max">Max ₹</label>
        </div>

        <div className="sm:col-span-1 flex items-stretch">
          {hasAny ? (
            <button
              onClick={reset}
              className="btn-secondary w-full text-xs px-3"
              data-testid="reset-filters"
            >
              Reset
            </button>
          ) : (
            <div className="hidden sm:flex w-full items-center justify-center text-ink-faint">
              <Icon name="filter" className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Pill rows */}
      <ChipRow
        label="Locality"
        options={LOCALITIES}
        value={local.locality}
        onToggle={(v) => togglePill('locality', v)}
        testId="chip-locality"
      />
      <ChipRow
        label="Room type"
        options={ROOM_TYPES}
        value={local.roomType}
        onToggle={(v) => togglePill('roomType', v)}
        testId="chip-roomtype"
      />
      <ChipRow
        label="Gender"
        options={GENDERS}
        value={local.gender}
        onToggle={(v) => togglePill('gender', v)}
        testId="chip-gender"
      />
    </div>
  );
}

function ChipRow({ label, options, value, onToggle, testId }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-ink-mute uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`chip ${active ? 'chip-active' : 'hover:border-ink-mute'}`}
              data-testid={`${testId}-${opt}`}
              aria-pressed={active}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
