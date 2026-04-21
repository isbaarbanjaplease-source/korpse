import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import RoomCard from '../components/RoomCard.jsx';
import SEO from '../components/SEO.jsx';
import { Icon } from '../components/Icon.jsx';
import { LOCALITIES } from '../constants.js';
import { GridSkeleton } from '../components/Skeleton.jsx';

const FEATURES = [
  {
    icon: 'shield',
    title: 'Verified by owners',
    desc: 'Every listing comes from a real local owner — no brokers, no surprise fees.',
  },
  {
    icon: 'pin',
    title: 'Hyperlocal coverage',
    desc: 'Rooms near HNBGU, Bus Stand, Bada Bazaar and every Srinagar Garhwal neighbourhood.',
  },
  {
    icon: 'zap',
    title: 'Direct contact',
    desc: 'Reach the owner instantly over WhatsApp or phone. No queues, no waiting.',
  },
  {
    icon: 'sliders',
    title: 'Filters that fit',
    desc: 'Narrow down by price, gender, room type and amenities to find your match.',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/rooms', { params: { limit: 6 } })
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data.rooms || []);
        setFeatured(list.slice(0, 6));
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Rooms in Srinagar Garhwal"
        description="BASERA — verified rooms, PGs and shared apartments in Srinagar Garhwal. Direct contact with owners."
      />

      {/* HERO */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-16 sm:pt-24 pb-16">
          <div className="max-w-3xl">
            <span className="chip chip-accent">
              <Icon name="pin" className="w-3.5 h-3.5" />
              Srinagar Garhwal · Uttarakhand
            </span>

            <h1 className="font-display font-extrabold text-ink text-[2.4rem] sm:text-6xl leading-[1.05] tracking-tight mt-5">
              A quieter way to find
              <br />
              <span className="text-accent-700">your next room.</span>
            </h1>

            <p className="mt-5 text-ink-mute text-lg leading-relaxed max-w-xl">
              BASERA is a calm, owner-first marketplace for students and working
              professionals looking to rent in Srinagar Garhwal — verified rooms, fair
              pricing, no middlemen.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/listings" className="btn-primary text-[15px] px-6 py-3" data-testid="hero-browse">
                Browse rooms
                <Icon name="arrow" className="w-4 h-4" />
              </Link>
              <Link to="/register" className="btn-secondary text-[15px] px-6 py-3" data-testid="hero-list">
                List a room
              </Link>
            </div>

            {/* Quick locality jump */}
            <div className="mt-10">
              <p className="text-xs text-ink-faint font-semibold uppercase tracking-wider mb-2.5">
                Popular localities
              </p>
              <div className="flex flex-wrap gap-1.5">
                {LOCALITIES.map((l) => (
                  <Link
                    key={l}
                    to={`/listings?locality=${encodeURIComponent(l)}`}
                    className="chip hover:border-ink-mute hover:text-ink"
                  >
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative panel on the right (desktop) */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute right-0 top-0 h-full w-[42%] pointer-events-none"
        >
          <div className="absolute inset-0 m-12 rounded-2xl border border-ink-line bg-canvas-raised overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-px bg-ink-line/60">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-canvas-raised relative">
                  <div className="absolute inset-3 rounded-lg bg-canvas-sunken" />
                </div>
              ))}
            </div>
            <div className="absolute bottom-5 right-5 px-3 py-1.5 rounded-full bg-ink text-canvas text-[10px] font-medium tracking-wider uppercase">
              Live listings
            </div>
          </div>
        </div>
      </section>

      <div className="divider max-w-7xl mx-auto" />

      {/* FEATURES */}
      <section className="page-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 card-hover">
              <div className="w-10 h-10 rounded-lg bg-accent-50 text-accent-700 grid place-items-center">
                <Icon name={f.icon} className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm text-ink-mute leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="page-container pt-0">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">Latest listings</h2>
            <p className="text-sm text-ink-mute mt-1">Freshly added rooms in Srinagar Garhwal</p>
          </div>
          <Link to="/listings" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent-700 transition-colors">
            View all
            <Icon name="arrow" className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <GridSkeleton count={6} />
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((r) => <RoomCard key={r._id} room={r} />)}
          </div>
        ) : (
          <div className="card p-10 text-center">
            <h3 className="font-semibold text-ink">No listings published yet</h3>
            <p className="text-sm text-ink-mute mt-1.5">
              Be the first owner to list a room in Srinagar Garhwal.
            </p>
            <Link to="/register" className="btn-accent mt-5 inline-flex">Become an owner</Link>
          </div>
        )}
      </section>

      {/* OWNER CTA */}
      <section className="page-container pt-0">
        <div className="card bg-ink text-canvas px-8 sm:px-12 py-10 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-ink">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
              Own a room in Srinagar Garhwal? <br />
              <span className="text-accent-300">List it for free in 5 minutes.</span>
            </h2>
            <p className="mt-3 text-sm text-canvas/70 leading-relaxed">
              Reach hundreds of seekers every week. No commission, no listing fee.
            </p>
          </div>
          <Link
            to="/register"
            className="btn bg-canvas text-ink px-6 py-3 hover:bg-accent-50 transition-colors"
          >
            Start listing
            <Icon name="arrow" className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
