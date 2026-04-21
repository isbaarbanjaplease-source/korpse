import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { Icon } from '../components/Icon.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Modal from '../components/Modal.jsx';
import Spinner from '../components/Spinner.jsx';
import SEO from '../components/SEO.jsx';
import { RowSkeleton } from '../components/Skeleton.jsx';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 72">
       <rect width="96" height="72" fill="#f3f3ee"/>
       <g fill="none" stroke="#c8c8c2" stroke-width="2" stroke-linecap="round">
         <rect x="20" y="22" width="56" height="34" rx="3"/>
         <circle cx="34" cy="34" r="4"/>
         <path d="M22 50l16-12 12 8 14-10 14 14"/>
       </g>
     </svg>`
  );

export default function DashboardPage() {
  return (
    <ProtectedRoute role="owner">
      <Dashboard />
    </ProtectedRoute>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const toast    = useToast();

  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [deleting, setDeleting] = useState(false);
  const [toDelete, setToDelete] = useState(null); // room object

  const fetchMine = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get('/rooms/mine');
      const list = Array.isArray(data) ? data : (data.rooms || []);
      setRooms(list);
    } catch {
      setError('We couldn\'t load your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMine(); }, [fetchMine]);

  const stats = useMemo(() => {
    const total      = rooms.length;
    const totalPhotos = rooms.reduce((s, r) => s + (r.images?.length || 0), 0);
    const avgPrice   = total ? Math.round(rooms.reduce((s, r) => s + Number(r.price || 0), 0) / total) : 0;
    const cheapest   = total ? Math.min(...rooms.map((r) => Number(r.price || 0))) : 0;
    const localities = new Set(rooms.map((r) => r.locality).filter(Boolean));
    return { total, avgPrice, cheapest, localityCount: localities.size, totalPhotos };
  }, [rooms]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/rooms/${toDelete._id}`);
      setRooms((prev) => prev.filter((r) => r._id !== toDelete._id));
      toast.success(`"${toDelete.title}" deleted`);
      setToDelete(null);
    } catch {
      toast.error('Failed to delete listing. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <SEO title="Owner dashboard" description="Manage your BASERA listings." />

      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-ink-mute uppercase tracking-wider">Owner dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink mt-1">
              Welcome, {user?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-sm text-ink-mute mt-1.5">Manage your rooms and track interest at a glance.</p>
          </div>
          <Link to="/add-listing" className="btn-primary self-start sm:self-auto">
            <Icon name="plus" className="w-4 h-4" />
            New listing
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <Stat icon="building" label="Total listings"    value={stats.total} />
          <Stat icon="spark"    label="Avg. monthly rent" value={stats.total ? `₹${stats.avgPrice.toLocaleString('en-IN')}` : '—'} />
          <Stat icon="pin"      label="Localities"        value={stats.localityCount || '—'} />
          <Stat icon="image"    label="Photos uploaded"   value={stats.totalPhotos} />
        </div>

        {/* Error */}
        {error && (
          <div className="card border-red-200 bg-red-50 text-red-700 px-4 py-3 mb-6 flex items-center gap-2 text-sm">
            <Icon name="alert" className="w-4 h-4" /> {error}
            <button onClick={fetchMine} className="ml-auto text-xs underline">Retry</button>
          </div>
        )}

        {/* Listings */}
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-ink">Your listings</h2>
          {rooms.length > 0 && (
            <span className="text-xs text-ink-mute">{rooms.length} active</span>
          )}
        </div>

        {loading ? (
          <RowSkeleton count={3} />
        ) : rooms.length === 0 ? (
          <EmptyState
            icon="building"
            title="No listings yet"
            description="Add your first room — it only takes a few minutes."
            action={
              <Link to="/add-listing" className="btn-primary">
                <Icon name="plus" className="w-4 h-4" />
                Add your first room
              </Link>
            }
          />
        ) : (
          <div className="space-y-3" data-testid="dashboard-listings">
            {rooms.map((r) => (
              <ListingRow key={r._id} room={r} onDelete={() => setToDelete(r)} />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={Boolean(toDelete)}
        onClose={() => !deleting && setToDelete(null)}
        title="Delete this listing?"
        description={`"${toDelete?.title}" will be permanently removed. This action can't be undone.`}
      >
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => setToDelete(null)}
            disabled={deleting}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={deleting}
            className="btn-danger"
            data-testid="confirm-delete"
          >
            {deleting ? <Spinner label="Deleting…" /> : (
              <>
                <Icon name="trash" className="w-4 h-4" />
                Delete listing
              </>
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-canvas-sunken text-ink-soft grid place-items-center">
          <Icon name={icon} className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-mute truncate">{label}</p>
          <p className="font-display text-xl font-bold text-ink leading-tight truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ListingRow({ room, onDelete }) {
  const img = room.images?.[0] || PLACEHOLDER;
  return (
    <div
      className="card p-3 sm:p-4 flex flex-col sm:flex-row gap-4 hover:border-ink-mute transition-colors"
      data-testid="dashboard-room-card"
    >
      <div className="sm:w-32 h-24 sm:h-auto rounded-lg overflow-hidden bg-canvas-sunken shrink-0">
        <img
          src={img}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          <span className="chip chip-accent text-[11px]">{room.roomType}</span>
          <span className="chip text-[11px]">{room.gender}</span>
        </div>
        <h3 className="font-semibold text-ink truncate">{room.title}</h3>
        <p className="text-xs text-ink-mute mt-0.5 flex items-center gap-1">
          <Icon name="pin" className="w-3 h-3" /> {room.locality}
        </p>
        <p className="text-accent-700 font-bold text-sm mt-2">
          ₹{Number(room.price).toLocaleString('en-IN')}
          <span className="text-ink-faint font-normal">/mo</span>
        </p>
      </div>

      <div className="flex sm:flex-col gap-2 items-stretch sm:items-end justify-end">
        <Link
          to={`/rooms/${room._id}`}
          className="btn-ghost text-xs"
          data-testid={`view-${room._id}`}
        >
          <Icon name="eye" className="w-3.5 h-3.5" />
          View
        </Link>
        <Link
          to={`/rooms/${room._id}/edit`}
          className="btn-secondary text-xs"
          data-testid={`edit-${room._id}`}
        >
          <Icon name="edit" className="w-3.5 h-3.5" />
          Edit
        </Link>
        <button
          onClick={onDelete}
          className="btn-secondary text-xs text-red-600 hover:bg-red-50 hover:border-red-200"
          data-testid={`delete-${room._id}`}
        >
          <Icon name="trash" className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
