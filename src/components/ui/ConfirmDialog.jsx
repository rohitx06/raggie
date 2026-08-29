import { useState, useEffect, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', confirmVariant = 'danger', onConfirm, onCancel }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onCancel(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-surface-900">{title}</h2>
            {description && <p className="text-sm text-surface-500 mt-1">{description}</p>}
          </div>
          <button onClick={onCancel} className="text-surface-400 hover:text-surface-600 transition-colors mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={onCancel} className="btn-secondary btn-sm">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'btn btn-sm',
              confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
