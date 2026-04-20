"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { NotificationRepository } from '@/infrastructure/notification/NotificationRepository';
import { Notification } from '@/domain/notification/Notification';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = () => {
  const [count, setCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const notificationRepo = new NotificationRepository();

  const fetchNotificationCount = async () => {
    try {
      setIsLoadingCount(true);
      const result = await notificationRepo.getUnreadNotificationCount();
      setCount(result.count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    } finally {
      setIsLoadingCount(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setIsLoadingList(true);
      const result = await notificationRepo.getAllNotifications();
      
      // Sort: Unread first, then Newest first
      const sortedNotifications = [...result].sort((a, b) => {
        if (a.isRead !== b.isRead) {
          return a.isRead ? 1 : -1; // Unread (false) comes first
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
      });

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchNotificationCount();
    
    // Temporarily disabled polling to reduce API calls
    // const interval = setInterval(fetchNotificationCount, 60000);
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleBellClick = async () => {
    if (!isOpen) {
      try {
        // 1. Fetch and Sort notifications first
        await fetchNotifications();
        
        // 2. Mark as read in the backend (but we don't update local state to keep the colors)
        await notificationRepo.readNotifications();
        
        // 3. Refresh the unread count badge to 0
        await fetchNotificationCount();
      } catch (error) {
        console.error('Error in handleBellClick sequence:', error);
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="relative cursor-pointer text-luxury-text hover:text-luxury-accent-start transition-colors group"
        onClick={handleBellClick}
      >
        <Bell 
          className={`w-6 h-6 transition-transform duration-300 group-hover:rotate-12 ${isLoadingCount ? 'opacity-50' : 'opacity-100'}`} 
        />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-luxury-gradient text-white text-[9px] font-bold px-1.5 rounded-full animate-in zoom-in duration-300 shadow-sm">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>

      {isOpen && (
        <NotificationDropdown 
          notifications={notifications} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
};

export default NotificationBell;
