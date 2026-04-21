import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from './Toast.jsx';
import { Icon } from './Icon.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast    = useToast();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Add subtle border once the user scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-150 ${
      isActive ? 'text-ink' : 'text-ink-mute hover:text-ink'
    }`;

  const links = [
    { to: '/',          label: 'Home', end: true },
    { to: '/listings',  label: 'Browse rooms' },
    ...(user?.role === 'owner' ? [
      { to: '/dashboard',   label: 'Dashboard' },
      { to: '/add-listing', label: 'List a room' },
    ] : []),
    { to: '/saved',     label: 'Saved' },
  ];

  return (
    <nav
      data-testid="navbar"
      className={`sticky top-0 z-40 bg-canvas/80 backdrop-blur-xl transition-shadow duration-200 ${
        scrolled ? 'border-b border-ink-line' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-baseline gap-1 font-display font-extrabold text-xl tracking-tight text-ink hover:text-accent-700 transition-colors"
            data-testid="navbar-logo"
          >
            BASERA
            <span className="w-1.5 h-1.5 rounded-full bg-accent-600" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-ink rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right cluster */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-ink-mute mr-1">
                  Hi,&nbsp;<span className="text-ink font-medium">{user.name?.split(' ')[0]}</span>
                </span>
                <button onClick={handleLogout} className="btn-ghost text-sm" data-testid="logout-btn">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm" data-testid="navbar-register">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -mr-2 rounded-lg text-ink-soft hover:bg-canvas-sunken transition-colors"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            data-testid="navbar-toggle"
          >
            <Icon name={open ? 'close' : 'menu'} className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-ink-line py-3 pb-4 animate-slideUp">
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? 'bg-canvas-sunken text-ink' : 'text-ink-soft hover:bg-canvas-sunken'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="border-t border-ink-line mt-3 pt-3 px-1">
              {user ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-ink-mute">
                    Signed in as <span className="text-ink font-medium">{user.name?.split(' ')[0]}</span>
                  </div>
                  <button onClick={handleLogout} className="btn-secondary text-sm">Sign out</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="btn-secondary text-sm flex-1 justify-center">Sign in</Link>
                  <Link to="/register" className="btn-primary text-sm flex-1 justify-center">Get started</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
