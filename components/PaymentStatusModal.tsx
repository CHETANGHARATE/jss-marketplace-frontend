'use client';

import React from 'react';
import { Sparkles, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface PaymentStatusModalProps {
  isOpen: boolean;
  status: 'processing' | 'success' | 'failed';
  errorMessage?: string;
  onRetry?: () => void;
  onClose?: () => void;
}

export function PaymentStatusModal({
  isOpen,
  status,
  errorMessage,
  onRetry,
  onClose,
}: PaymentStatusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card text-foreground w-full max-w-sm border border-border/40 rounded-3xl p-6 shadow-2xl space-y-6 text-center">
        {status === 'processing' && (
          <div className="space-y-4 py-4">
            <Sparkles className="w-12 h-12 text-primary animate-spin mx-auto" />
            <h3 className="text-xl font-bold text-foreground">Processing Payment</h3>
            <p className="text-xs text-foreground/60">
              Communicating securely with the payment gateway. Please do not close or refresh this page.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold text-foreground">Payment Verified!</h3>
            <p className="text-xs text-foreground/60">
              Your transaction has been approved and your order is confirmed.
            </p>
            {onClose && (
              <button
                onClick={onClose}
                className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs rounded-2xl shadow-sm hover:bg-primary/90"
              >
                Continue
              </button>
            )}
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-4 py-4">
            <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-xl font-bold text-foreground">Payment Failed</h3>
            <p className="text-xs text-rose-500/80 font-medium">
              {errorMessage || 'The payment transaction could not be authorized or was cancelled.'}
            </p>
            <div className="flex gap-2 pt-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold text-xs rounded-2xl shadow-sm hover:bg-primary/90 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Payment</span>
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-3 border border-border/40 text-foreground font-bold text-xs rounded-2xl hover:bg-muted"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
