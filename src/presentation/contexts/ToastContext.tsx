"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: () => void }) => {
  const typeStyles = {
    success: 'border-green-500/30 text-green-600 dark:text-green-400 bg-green-50/80 dark:bg-green-900/30',
    error: 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-900/30',
    info: 'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/30',
  };

  return (
    <div 
      className={`pointer-events-auto px-6 py-3 rounded-2xl border backdrop-blur-xl shadow-lg animate-in slide-in-from-right-full fade-in duration-300 flex items-center gap-3 ${typeStyles[toast.type]}`}
    >
      <span className="text-sm font-medium">{toast.message}</span>
      <button 
        onClick={onRemove}
        className="text-current opacity-50 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// I need to import X from lucide-react for the ToastItem
// I'll fix the imports in a moment or just use a simple 'x'
