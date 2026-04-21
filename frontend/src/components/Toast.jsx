import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

const ToastContext = createContext(null);

let counter = 0;
const nextId = () => ++counter;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    const tm = timersRef.current.get(id);
    if (tm) {
      clearTimeout(tm);
      timersRef.current.delete(id);
    }
  }, []);

  const push = useCallback((toast) => {
    const id = nextId();
    const item = {
      id,
      variant: 'info',
      duration: 3500,
      ...toast,
    };
    setToasts((t) => [...t, item]);
    if (item.duration !== Infinity) {
      const tm = setTimeout(() => dismiss(id), item.duration);
      timersRef.current.set(id, tm);
    }
    return id;
  }, [dismiss]);

  const api = useMemo(
    () => ({
      toast:   (msg, opts = {}) => push({ message: msg, ...opts }),
      success: (msg, opts = {}) => push({ message: msg, variant: 'success', ...opts }),
      error:   (msg, opts = {}) => push({ message: msg, variant: 'error', duration: 5000, ...opts }),
      info:    (msg, opts = {}) => push({ message: msg, variant: 'info', ...opts }),
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))] pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

const VARIANT_STYLES = {
  success: { ring: 'border-emerald-200', bg: 'bg-emerald-50', icon: 'check',  iconColor: 'text-emerald-600' },
  error:   { ring: 'border-red-200',     bg: 'bg-red-50',     icon: 'alert',  iconColor: 'text-red-600' },
  info:    { ring: 'border-ink-line',    bg: 'bg-canvas-raised', icon: 'info', iconColor: 'text-accent-600' },
};

function ToastItem({ toast, onDismiss }) {
  const v = VARIANT_STYLES[toast.variant] || VARIANT_STYLES.info;
  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto card ${v.bg} ${v.ring} px-4 py-3 flex items-start gap-3 animate-slideUp shadow-lift`}
    >
      <Icon name={v.icon} className={`w-5 h-5 shrink-0 mt-0.5 ${v.iconColor}`} />
      <div className="flex-1 text-sm text-ink leading-snug">
        {toast.title && <p className="font-semibold mb-0.5">{toast.title}</p>}
        <p className="text-ink-soft">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-ink-faint hover:text-ink-soft transition-colors -mr-1 -mt-1 p-1"
        aria-label="Dismiss"
      >
        <Icon name="close" className="w-4 h-4" />
      </button>
    </div>
  );
}

export default ToastProvider;
