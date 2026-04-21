import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import RoomCard from '../components/RoomCard.jsx';
import Filters from '../components/Filters.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SEO from '../components/SEO.jsx';
import { GridSkeleton } from '../components/Skeleton.jsx';
import { Icon } from '../components/Icon.jsx';
import { useToast } from '../components/Toast.jsx';

const FILTER_KEYS = ['q', 'locality', 'roomType', 'gender', 'minPrice', 'maxPrice'];
const PAGE_SIZE = 12;

function readFromParams(params) {
  const out = {};
  FILTER_KEYS.forEach((k) => { out[k] = params.get(k) || ''; });
  return out;
}

export default function Listings() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFromParams(params), [params]);
  const page    = Math.max(1, Number(params.get('page')) || 1);
  const sort    = params.get('sort') || 'recent';

  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [total, setTotal]     = useState(0);
  const toast = useToast();

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const apiParams = { page, limit: PAGE_SIZE };
      FILTER_KEYS.forEach((k) => { if (filters[k]) apiParams[k] = filters[k]; });
      const { data } = await api.get('/rooms', { params: apiParams });
      let list  = Array.isArray(data) ? data : (data.rooms || []);
      const count = data.total ?? list.length;

      // Client-side sort fallback (in case API ignores sort)
      if (sort === 'price-asc')  list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
      if (sort === 'price-desc') list = [...list].sort((a, b) => Number(b.price) - Number(a.price));

      setRooms(list);
      setTotal(count);
    } catch (e) {
      setError('We couldn\'t load listings right now. Please try again in a moment.');
      setRooms([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, page, sort]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const updateParams = (patch, { resetPage = false } = {}) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === '' || v == null) next.delete(k);
      else next.set(k, v);
    });
    if (resetPage) next.delete('page');
    setParams(next, { replace: false });
  };

  const handleFilterChange = (newFilters) => {
    const patch = {};
    FILTER_KEYS.forEach((k) => { patch[k] = newFilters[k] || ''; });
    updateParams(patch, { resetPage: true });
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Active chip summary (for above-the-grid quick view)
  const activeChips = FILTER_KEYS
    .filter((k) => filters[k])
    .map((k) => ({ key: k, value: filters[k] }));

  return (
    <>
      <SEO
        title="Browse rooms"
        description="Browse verified rooms, PGs and apartments across Srinagar Garhwal."
      />

      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink tracking-tight">Browse rooms</h1>
            <p className="text-sm text-ink-mute mt-1.5">
              {loading
                ? 'Loading listings…'
                : `${total} ${total === 1 ? 'room' : 'rooms'} in Srinagar Garhwal`}
            </p>
          </div>

          <SortMenu value={sort} onChange={(v) => updateParams({ sort: v === 'recent' ? '' : v })} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Filters filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Active chips summary */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-6">
            <span className="text-xs text-ink-mute font-medium">Active:</span>
            {activeChips.map(({ key, value }) => (
              <button
                key={key}
                onClick={() => handleFilterChange({ ...filters, [key]: '' })}
                className="chip chip-active hover:bg-ink-soft"
              >
                {value}
                <Icon name="close" className="w-3 h-3 ml-0.5" />
              </button>
            ))}
            <button
              onClick={() => handleFilterChange({ q: '', locality: '', roomType: '', gender: '', minPrice: '', maxPrice: '' })}
              className="text-xs text-ink-mute hover:text-ink underline underline-offset-2 ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="card border-red-200 bg-red-50 text-red-700 px-4 py-3 mb-6 flex items-center gap-2 text-sm">
            <Icon name="alert" className="w-4 h-4" /> {error}
            <button
              onClick={() => { fetchRooms(); toast.info('Retrying…'); }}
              className="ml-auto text-xs underline underline-offset-2 hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <GridSkeleton count={8} />
        ) : rooms.length > 0 ? (
          <>
            <div
              id="listings-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              data-testid="listings-grid"
            >
              {rooms.map((r) => <RoomCard key={r._id} room={r} />)}
            </div>

            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => {
                  updateParams({ page: p === 1 ? '' : p });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        ) : !error && (
          <EmptyState
            icon="building"
            title="No matching rooms"
            description={
              activeChips.length
                ? 'Try widening your filters or clearing them to see all listings.'
                : 'No listings have been posted yet — check back soon!'
            }
            action={
              activeChips.length ? (
                <button
                  className="btn-secondary"
                  onClick={() => handleFilterChange({ q: '', locality: '', roomType: '', gender: '', minPrice: '', maxPrice: '' })}
                >
                  Clear filters
                </button>
              ) : (
                <Link to="/" className="btn-secondary">Back home</Link>
              )
            }
          />
        )}
      </div>
    </>
  );
}

function SortMenu({ value, onChange }) {
  const options = [
    { v: 'recent',     label: 'Newest' },
    { v: 'price-asc',  label: 'Price: Low → High' },
    { v: 'price-desc', label: 'Price: High → Low' },
  ];
  return (
    <label className="inline-flex items-center gap-2 text-sm text-ink-mute">
      <Icon name="sort" className="w-4 h-4" />
      Sort
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border border-ink-line rounded-lg pl-2 pr-7 py-1.5 text-sm text-ink focus:outline-none focus:border-accent-500 focus:shadow-focus"
        data-testid="sort-select"
      >
        {options.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
      </select>
    </label>
  );
}

function Pagination({ page, totalPages, onChange }) {
  // Build a compact range of page numbers
  const pages = [];
  const push = (n) => { if (!pages.includes(n) && n >= 1 && n <= totalPages) pages.push(n); };
  push(1);
  for (let i = page - 1; i <= page + 1; i++) push(i);
  push(totalPages);

  return (
    <div className="mt-12 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
        aria-label="Previous page"
      >
        <Icon name="chevronL" className="w-4 h-4" />
      </button>

      {pages.map((n, idx) => {
        const prev = pages[idx - 1];
        const gap  = prev && n - prev > 1;
        return (
          <React.Fragment key={n}>
            {gap && <span className="text-ink-faint px-1">…</span>}
            <button
              onClick={() => onChange(n)}
              className={`min-w-9 h-9 px-2.5 rounded-lg text-sm font-medium transition-colors ${
                n === page
                  ? 'bg-ink text-canvas'
                  : 'bg-canvas-raised border border-ink-line text-ink-soft hover:border-ink-mute'
              }`}
              aria-current={n === page ? 'page' : undefined}
            >
              {n}
            </button>
          </React.Fragment>
        );
      })}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="btn-secondary px-3 py-2 text-sm disabled:opacity-40"
        aria-label="Next page"
      >
        <Icon name="chevronR" className="w-4 h-4" />
      </button>
    </div>
  );
}
