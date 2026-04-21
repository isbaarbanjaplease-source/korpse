import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon.jsx';
import { useBookmarks } from '../hooks/useBookmarks.js';
import { useToast } from './Toast.jsx';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
       <rect width="400" height="300" fill="#f3f3ee"/>
       <g fill="#c8c8c2" stroke="#c8c8c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
         <rect x="100" y="120" width="200" height="120" rx="6"/>
         <circle cx="155" cy="160" r="14"/>
         <path d="M120 230l60-50 50 40 50-30 50 40"/>
       </g>
     </svg>`
  );

export default function RoomCard({ room, preview = false }) {
  const { has, toggle } = useBookmarks();
  const toast = useToast();

  if (!room) return null;
  const { _id, title, locality, price, gender, roomType, images = [] } = room;
  const imgSrc = images[0] || PLACEHOLDER;
  const saved  = _id ? has(_id) : false;

  const handleSave = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!_id) return;
    const nowSaved = toggle(_id);
    toast.toast(nowSaved ? 'Saved to your bookmarks' : 'Removed from bookmarks', {
      variant: nowSaved ? 'success' : 'info',
    });
  };

  const Wrapper = preview ? 'div' : Link;
  const wrapperProps = preview ? {} : { to: `/rooms/${_id}` };

  return (
    <Wrapper
      {...wrapperProps}
      data-testid="room-card"
      className="card card-hover overflow-hidden flex flex-col group focus:outline-none focus-visible:shadow-focus"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-canvas-sunken overflow-hidden">
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
        />

        {/* gradient corner for legibility */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

        {/* Top-left meta */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="chip bg-canvas-raised/90 backdrop-blur text-ink border-transparent text-[11px]">
            {roomType}
          </span>
          <span className="chip bg-canvas-raised/90 backdrop-blur text-ink-soft border-transparent text-[11px]">
            {gender}
          </span>
        </div>

        {/* Bookmark */}
        {!preview && (
          <button
            type="button"
            onClick={handleSave}
            data-testid={`bookmark-${_id}`}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full grid place-items-center transition-colors ${
              saved ? 'bg-accent-600 text-white' : 'bg-canvas-raised/90 text-ink-soft hover:text-ink backdrop-blur'
            }`}
            aria-label={saved ? 'Remove bookmark' : 'Save room'}
            aria-pressed={saved}
          >
            <Icon name={saved ? 'heartFill' : 'heart'} className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-ink-mute">
          <Icon name="pin" className="w-3.5 h-3.5" />
          <span className="truncate">{locality}</span>
        </div>

        <h3 className="font-semibold text-ink text-[15px] leading-snug line-clamp-2 group-hover:text-accent-700 transition-colors">
          {title}
        </h3>

        <div className="mt-auto pt-3 flex items-baseline justify-between">
          <span className="text-accent-700 font-bold text-lg leading-none">
            ₹{Number(price).toLocaleString('en-IN')}
            <span className="text-ink-faint font-normal text-xs ml-0.5">/mo</span>
          </span>
          {!preview && (
            <span className="text-xs text-ink-mute inline-flex items-center gap-1 group-hover:text-ink transition-colors">
              View
              <Icon name="arrow" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
