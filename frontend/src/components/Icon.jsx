import React from 'react';

// Tiny line-icon set so we never import emoji clipart.
// All icons share strokeWidth, currentColor, 24×24 viewBox.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
};

export function Icon({ name, className = 'w-5 h-5', ...rest }) {
  const paths = ICONS[name];
  if (!paths) return null;
  return (
    <svg {...base} className={className} aria-hidden="true" {...rest}>
      {paths}
    </svg>
  );
}

const ICONS = {
  search:    <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  pin:       <><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  bed:       <><path d="M3 18v-7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7" /><path d="M3 14h18" /><path d="M7 11h4" /></>,
  user:      <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  menu:      <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  close:     <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
  heart:     <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z" />,
  heartFill: <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z" fill="currentColor" stroke="none" />,
  share:     <><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="m8.2 10.8 7.6-3.6" /><path d="m8.2 13.2 7.6 3.6" /></>,
  arrowLeft: <><path d="M19 12H5" /><path d="m12 5-7 7 7 7" /></>,
  arrowRight:<><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  chevronL:  <path d="m15 6-6 6 6 6" />,
  chevronR:  <path d="m9 6 6 6-6 6" />,
  check:     <path d="m5 12 5 5 9-11" />,
  alert:     <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z" /></>,
  info:      <><circle cx="12" cy="12" r="9" /><path d="M12 8h.01" /><path d="M11 12h1v4h1" /></>,
  spark:     <><path d="M12 3v3" /><path d="M12 18v3" /><path d="M3 12h3" /><path d="M18 12h3" /><path d="m5.6 5.6 2.1 2.1" /><path d="m16.3 16.3 2.1 2.1" /><path d="m5.6 18.4 2.1-2.1" /><path d="m16.3 7.7 2.1-2.1" /></>,
  plus:      <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  edit:      <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" /></>,
  trash:     <><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="m5 6 1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" /></>,
  eye:       <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  phone:     <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />,
  whatsapp:  <path d="M16 8a6 6 0 0 1 .8 11.2L13 22l1-3.5A6 6 0 1 1 16 8Z" />,
  upload:    <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5" /><path d="M12 3v12" /></>,
  image:     <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4.5-4.5L5 22" /></>,
  filter:    <><path d="M4 5h16" /><path d="M7 12h10" /><path d="M10 19h4" /></>,
  sort:      <><path d="M3 6h13" /><path d="M3 12h9" /><path d="M3 18h5" /><path d="m17 9 3 3-3 3" /><path d="M14 12h6" /></>,
  sliders:   <><path d="M4 21v-7" /><path d="M4 10V3" /><path d="M12 21v-9" /><path d="M12 8V3" /><path d="M20 21v-5" /><path d="M20 12V3" /><path d="M2 14h4" /><path d="M10 8h4" /><path d="M18 16h4" /></>,
  building:  <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 7h.01" /><path d="M15 7h.01" /><path d="M9 11h.01" /><path d="M15 11h.01" /><path d="M9 15h.01" /><path d="M15 15h.01" /><path d="M10 21v-3h4v3" /></>,
  shield:    <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />,
  zap:       <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />,
  globe:     <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a13 13 0 0 1 0 18" /><path d="M12 3a13 13 0 0 0 0 18" /></>,
  link:      <><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 1 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 1 0 7 7l1-1" /></>,
  copy:      <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  expand:    <><path d="M3 9V3h6" /><path d="M21 9V3h-6" /><path d="M3 15v6h6" /><path d="M21 15v6h-6" /></>,
  star:      <path d="m12 2 3 7 7 .6-5.5 4.7L18 22l-6-3.7L6 22l1.5-7.7L2 9.6 9 9l3-7Z" />,
  arrow:     <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  spinner:   null, // handled by Spinner component
};
