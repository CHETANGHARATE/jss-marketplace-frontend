'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X, ShoppingCart, Heart } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'info' | 'warning' | 'cart' | 'wishlist';

export interface Toast {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (opts: Omit<Toast, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  cartSuccess: (message: string) => void;
  wishlistSuccess: (message: string) => void;
  dismiss: (id: string) => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ variant, title, message, duration = 3500 }: Omit<Toast, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev.slice(-4), { id, variant, title, message, duration }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const success = useCallback(
    (message: string, title?: string) => toast({ variant: 'success', message, title }),
    [toast]
  );
  const error = useCallback(
    (message: string, title?: string) => toast({ variant: 'error', message, title, duration: 5000 }),
    [toast]
  );
  const info = useCallback(
    (message: string, title?: string) => toast({ variant: 'info', message, title }),
    [toast]
  );
  const warning = useCallback(
    (message: string, title?: string) => toast({ variant: 'warning', message, title, duration: 4500 }),
    [toast]
  );
  const cartSuccess = useCallback(
    (message: string) => toast({ variant: 'cart', message }),
    [toast]
  );
  const wishlistSuccess = useCallback(
    (message: string) => toast({ variant: 'wishlist', message }),
    [toast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, toast, success, error, info, warning, cartSuccess, wishlistSuccess, dismiss }}
    >
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

// ─── Toast Variant Config ──────────────────────────────────────────────────────

const variantConfig: Record<
  ToastVariant,
  {
    icon: React.ReactNode;
    barColor: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  success: {
    icon: <CheckCircle2 size={18} />,
    barColor: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
  error: {
    icon: <XCircle size={18} />,
    barColor: 'bg-rose-500',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-500',
  },
  info: {
    icon: <Info size={18} />,
    barColor: 'bg-blue-500',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    barColor: 'bg-amber-500',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
  cart: {
    icon: <ShoppingCart size={18} />,
    barColor: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
  wishlist: {
    icon: <Heart size={18} fill="currentColor" />,
    barColor: 'bg-rose-500',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-500',
  },
};

// ─── Individual Toast Item ─────────────────────────────────────────────────────

function ToastItem({ t, onDismiss }: { t: Toast; onDismiss: (id: string) => void }) {
  const cfg = variantConfig[t.variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 64, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 64, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden"
      role="alert"
      aria-live="polite"
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.barColor} rounded-l-2xl`} />

      <div className="flex items-start gap-3 px-4 py-3.5 pl-5">
        {/* Icon */}
        <div className={`mt-0.5 shrink-0 p-1.5 rounded-xl ${cfg.iconBg} ${cfg.iconColor}`}>
          {cfg.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {t.title && (
            <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {t.title}
            </p>
          )}
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-snug mt-0.5">
            {t.message}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={() => onDismiss(t.id)}
          className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      {t.duration && t.duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-[2px] ${cfg.barColor} opacity-30`}
          initial={{ scaleX: 1, transformOrigin: 'left' }}
          animate={{ scaleX: 0 }}
          transition={{ duration: t.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
}

// ─── Toast Viewport (renders the portal list) ─────────────────────────────────

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem t={t} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Checkout Loading Overlay ─────────────────────────────────────────────────

/**
 * Centered full-screen overlay with spinner for Buy Now navigation.
 * Usage: render conditionally and remove once navigation completes.
 */
export function CheckoutLoadingOverlay({ message = 'Preparing secure checkout...' }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center gap-5 max-w-xs w-full mx-4"
      >
        {/* Spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{message}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Please wait...</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
