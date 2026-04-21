import React from 'react';
import { Icon } from './Icon.jsx';

export default function EmptyState({
  icon = 'building',
  title = 'Nothing here yet',
  description,
  action,
}) {
  return (
    <div className="card border-dashed bg-canvas-raised/60 px-8 py-14 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-canvas-sunken grid place-items-center text-ink-mute">
        <Icon name={icon} className="w-5 h-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-ink-mute max-w-sm mx-auto">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
