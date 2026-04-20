"use client";

import React from 'react';
import { Notification } from '@/domain/notification/Notification';

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationDropdown = ({ notifications, onClose }: NotificationDropdownProps) => {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(dateString));
  };

  return (
    <div 
      className="absolute right-0 mt-3 w-80 bg-luxury-surface/90 backdrop-blur-xl border border-luxury-border rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-luxury-border flex items-center justify-between bg-white/50 dark:bg-gray-900/50">
        <h3 className="text-sm font-serif font-bold text-luxury-text tracking-tight">
          Notifications
        </h3>
        <button 
          onClick={onClose}
          className="text-[10px] font-bold uppercase tracking-widest text-luxury-text-muted hover:text-luxury-accent-start transition-colors"
        >
          Close
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <p className="text-sm font-serif italic text-luxury-text-muted">
              No new inspirations at the moment
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-3 rounded-xl transition-all duration-200 cursor-pointer group relative
                  ${notification.isRead 
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-800/50' 
                    : 'bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30'
                  }`}
              >
                {!notification.isRead && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-luxury-gradient shadow-sm" />
                )}
                <div className="pl-3">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-xs font-bold ${notification.isRead ? 'text-luxury-text-muted' : 'text-luxury-text'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-[9px] text-luxury-text-muted whitespace-nowrap ml-2">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-luxury-text-muted line-clamp-2 leading-relaxed">
                    {notification.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
