"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  isLoading = false
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white dark:bg-luxury-surface border border-luxury-border shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="mb-2 text-xl font-serif italic text-luxury-text">
            {title}
          </h3>

          <p className="mb-6 text-xs font-light text-luxury-text-muted leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs font-medium text-luxury-text-muted hover:text-luxury-text transition-colors rounded-xl hover:bg-luxury-surface/50 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
