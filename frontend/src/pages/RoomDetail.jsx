import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import RoomCard from '../components/RoomCard.jsx';
import Lightbox from '../components/Lightbox.jsx';
import SEO from '../components/SEO.jsx';
import Spinner from '../components/Spinner.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { Icon } from '../components/Icon.jsx';
import { useBookmarks } from '../hooks/useBookmarks.js';
import { useToast } from '../components/Toast.jsx';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
       <rect width="800" height="500" fill="#f3f3ee"/>
       <g fill="none" stroke="#c8c8c2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
         <rect x="200" y="200" width="400" height="220" rx="10"/>
         <circle cx="290" cy="280" r="22"/>
         <path d="M220 410l120-100 100 80 100-60 100 80"/>
       </g>
     </svg>`
  );

export default function RoomDetail() {
  const { id }   = useParams();
  const toast    = useToast();
  const { has, toggle } = useBookmarks();

  const [room, setRoom]         = useState(null);
  const [similar, setSimilar]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    setLoading(true); setError(''); setActiveImg(0);
    api.get(`/rooms/${id}`)
      .then(({ data }) => {
        setRoom(data.room || data);
        return api.get(`/rooms/${id}/similar`);
      })
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data.rooms || []);
        setSimilar(list.slice(0, 4));
      })
      .catch(() => setError('We couldn\'t load this room. Please try again.'))
      .finally(() => setLoading(false));
  }, [id]);

  const images = useMemo(
    () => (room?.images?.length ? room.images : [PLACEHOLDER]),
    [room]
  );

  const phone = room?.ownerPhone?.replace(/\D/g, '') || '';

  const waLink   = phone
    ? `https://wa.me/91${phone}?text=${encodeURIComponent(`Hi, I'm interested in your room "${room?.title}" on BASERA.`)}`
    : null;
  const callLink = phone ? `tel:+91${phone}` : null;

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: room?.title || 'BASERA',
      text:  `${room?.title} — ₹${Number(room?.price).toLocaleString('en-IN')}/mo in ${room?.locality}`,
      url,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); return; } catch { /* user cancelled */ return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleBookmark = () => {
    if (!room?._id) return;
    const saved = toggle(room._id);
    toast.toast(saved ? 'Saved to your bookmarks' : 'Removed from bookmarks', {
      variant: saved ? 'success' : 'info',
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-lg" />)}
            </div>
            <div className="space-y-3 pt-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="page-container">
        <SEO title="Room not found" />
        <div className="card p-10 text-center">
          <h1 className="font-display text-2xl font-bold text-ink">Room unavailable</h1>
          <p className="text-ink-mute mt-2">{error || 'This room may have been removed.'}</p>
          <Link to="/listings" className="btn-primary mt-6 inline-flex">
            <Icon name="arrowLeft" className="w-4 h-4" /> Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const saved = has(room._id);
  const mapQuery = encodeURIComponent(`${room.locality}, Srinagar Garhwal, Uttarakhand`);
  const mapSrc   = `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      <SEO
        title={room.title}
        description={`${room.roomType} room in ${room.locality}, Srinagar Garhwal · ₹${Number(room.price).toLocaleString('en-IN')}/mo`}
        image={images[0]}
      />

      <div className="page-container">
        {/* Breadcrumb + actions row */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <nav className="text-sm text-ink-mute flex items-center gap-1.5 min-w-0">
            <Link to="/" className="hover:text-ink transition-colors">Home</Link>
            <Icon name="chevronR" className="w-3 h-3 text-ink-faint" />
            <Link to="/listings" className="hover:text-ink transition-colors">Listings</Link>
            <Icon name="chevronR" className="w-3 h-3 text-ink-faint" />
            <span className="text-ink truncate font-medium">{room.title}</span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleBookmark}
              className={`btn-secondary text-sm ${saved ? 'text-accent-700 border-accent-200 bg-accent-50' : ''}`}
              data-testid="bookmark-toggle"
            >
              <Icon name={saved ? 'heartFill' : 'heart'} className="w-4 h-4" />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>
            <button onClick={handleShare} className="btn-secondary text-sm" data-testid="share-btn">
              <Icon name="share" className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setLightbox(true)}
                className="group block w-full aspect-[16/10] rounded-xl overflow-hidden bg-canvas-sunken relative cursor-zoom-in"
                aria-label="Open image viewer"
                data-testid="open-lightbox"
              >
                <img
                  src={images[activeImg] || PLACEHOLDER}
                  alt={room.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                />
                <div className="absolute bottom-3 right-3 bg-ink/70 text-canvas text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="expand" className="w-3.5 h-3.5" />
                  View gallery
                </div>
              </button>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === activeImg
                          ? 'border-ink'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`Show image ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title block */}
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="chip chip-accent">{room.roomType}</span>
                <span className="chip">{room.gender}</span>
                {room.available !== false && (
                  <span className="chip border-emerald-200 bg-emerald-50 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Available
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink leading-tight">
                {room.title}
              </h1>
              <div className="flex items-center gap-1.5 text-ink-mute mt-3">
                <Icon name="pin" className="w-4 h-4" />
                <span>{room.locality}, Srinagar Garhwal</span>
              </div>
            </div>

            {/* Price card */}
            <div className="card p-6 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute">Monthly rent</p>
                <p className="font-display text-3xl font-bold text-ink mt-1">
                  ₹{Number(room.price).toLocaleString('en-IN')}
                  <span className="text-base font-normal text-ink-mute"> /month</span>
                </p>
              </div>
              <p className="text-xs text-ink-faint hidden sm:block">All-inclusive · Negotiable directly</p>
            </div>

            {/* Description */}
            {room.description && (
              <div>
                <h2 className="font-display text-xl font-bold text-ink mb-3">About this room</h2>
                <p className="text-ink-soft leading-relaxed whitespace-pre-line">{room.description}</p>
              </div>
            )}

            {/* Amenities */}
            {room.amenities?.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-ink mb-3">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {room.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-ink-soft border border-ink-line rounded-lg px-3 py-2.5 bg-canvas-raised">
                      <Icon name="check" className="w-4 h-4 text-accent-600" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div>
              <h2 className="font-display text-xl font-bold text-ink mb-3">Location</h2>
              <div className="card overflow-hidden">
                <iframe
                  title={`Map of ${room.locality}`}
                  src={mapSrc}
                  className="w-full h-72 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="px-4 py-3 border-t border-ink-line text-sm text-ink-mute flex items-center gap-2">
                  <Icon name="pin" className="w-4 h-4" />
                  {room.locality}, Srinagar Garhwal, Uttarakhand
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Owner card */}
          <aside>
            <div className="card p-6 sticky top-20">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute">Posted by</p>
              <div className="flex items-center gap-3 mt-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-ink text-canvas grid place-items-center font-semibold">
                  {room.ownerName?.charAt(0).toUpperCase() || 'O'}
                </div>
                <div>
                  <p className="font-semibold text-ink">{room.ownerName || 'Owner'}</p>
                  <p className="text-xs text-ink-mute">Property owner</p>
                </div>
              </div>

              {phone ? (
                <div className="space-y-2.5">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent w-full py-3 text-sm"
                    data-testid="whatsapp-btn"
                  >
                    <Icon name="whatsapp" className="w-4 h-4" />
                    Message on WhatsApp
                  </a>
                  <a href={callLink} className="btn-secondary w-full py-3 text-sm" data-testid="call-btn">
                    <Icon name="phone" className="w-4 h-4" />
                    Call owner
                  </a>
                </div>
              ) : (
                <p className="text-sm text-ink-mute text-center py-4">Contact info not available.</p>
              )}

              <div className="mt-6 pt-5 border-t border-ink-line space-y-2.5 text-sm">
                <Row label="Type"     value={room.roomType} />
                <Row label="Gender"   value={room.gender} />
                <Row label="Locality" value={room.locality} />
                {room.amenities?.length > 0 && (
                  <Row label="Amenities" value={`${room.amenities.length} items`} />
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Similar rooms */}
        {similar.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-ink mb-6">Similar rooms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.map((r) => <RoomCard key={r._id} room={r} />)}
            </div>
          </section>
        )}
      </div>

      <Lightbox
        open={lightbox}
        images={images}
        startIndex={activeImg}
        onClose={() => setLightbox(false)}
      />
    </>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-ink-mute">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
