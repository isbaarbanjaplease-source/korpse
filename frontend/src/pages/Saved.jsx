import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import RoomCard from '../components/RoomCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SEO from '../components/SEO.jsx';
import { GridSkeleton } from '../components/Skeleton.jsx';
import { useBookmarks } from '../hooks/useBookmarks.js';
import { Icon } from '../components/Icon.jsx';

export default function Saved() {
  const { ids } = useBookmarks();
  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (ids.length === 0) {
      setRooms([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    Promise.allSettled(
      ids.map((id) => api.get(`/rooms/${id}`).then(({ data }) => data.room || data))
    ).then((res) => {
      if (cancelled) return;
      const list = res
        .filter((r) => r.status === 'fulfilled' && r.value && r.value._id)
        .map((r) => r.value);
      setRooms(list);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [ids]);

  return (
    <>
      <SEO title="Saved rooms" description="Your bookmarked rooms in Srinagar Garhwal." />

      <div className="page-container">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h1 className="text-3xl font-display font-bold text-ink">Saved rooms</h1>
            <p className="text-sm text-ink-mute mt-1.5">
              {ids.length === 0
                ? 'Bookmark rooms to revisit them anytime.'
                : `${rooms.length} of ${ids.length} saved listings`}
            </p>
          </div>
          <Link to="/listings" className="btn-secondary text-sm">
            <Icon name="arrowLeft" className="w-4 h-4" />
            Browse more
          </Link>
        </div>

        {loading ? (
          <GridSkeleton count={Math.min(ids.length || 4, 8)} />
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((r) => <RoomCard key={r._id} room={r} />)}
          </div>
        ) : (
          <EmptyState
            icon="heart"
            title="No saved rooms yet"
            description="Tap the heart on any room to add it to your bookmarks."
            action={<Link to="/listings" className="btn-primary">Browse rooms</Link>}
          />
        )}
      </div>
    </>
  );
}
