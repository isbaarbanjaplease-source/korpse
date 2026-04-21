import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink-line bg-canvas-raised mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-baseline gap-1 font-display font-extrabold text-xl text-ink">
              BASERA
              <span className="w-1.5 h-1.5 rounded-full bg-accent-600" />
            </Link>
            <p className="mt-3 text-sm text-ink-mute leading-relaxed max-w-xs">
              Verified rooms, PGs and shared apartments in Srinagar Garhwal —
              direct from owners, no brokers.
            </p>
          </div>

          <FooterCol
            title="Discover"
            links={[
              { to: '/listings', label: 'Browse rooms' },
              { to: '/listings?roomType=PG', label: 'PG accommodations' },
              { to: '/listings?roomType=1BHK', label: '1BHK apartments' },
              { to: '/listings?gender=Female', label: 'For women' },
            ]}
          />

          <FooterCol
            title="For owners"
            links={[
              { to: '/register', label: 'List a room' },
              { to: '/login', label: 'Owner login' },
              { to: '/dashboard', label: 'Dashboard' },
            ]}
          />

          <FooterCol
            title="Localities"
            links={[
              { to: '/listings?locality=HNBGU+Campus', label: 'HNBGU Campus' },
              { to: '/listings?locality=Bada+Bazaar', label: 'Bada Bazaar' },
              { to: '/listings?locality=Bus+Stand', label: 'Bus Stand' },
              { to: '/listings?locality=Chaura+Maidan', label: 'Chaura Maidan' },
            ]}
          />
        </div>

        <div className="mt-12 pt-6 border-t border-ink-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-ink-mute">
          <p>© {year} BASERA · Srinagar Garhwal, Uttarakhand</p>
          <p className="text-ink-faint">
            Designed for students &amp; working professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link to={l.to} className="text-sm text-ink-mute hover:text-ink transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
