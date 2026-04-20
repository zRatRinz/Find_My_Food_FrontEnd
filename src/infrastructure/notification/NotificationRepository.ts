import { INotificationRepository } from '@/domain/notification/INotificationRepository';
import { NotificationCount, Notification } from '@/domain/notification/Notification';
import { NotificationCountDTO, NotificationDTO, NotificationListDTO, NotificationMapper } from './NotificationDTO';
import { APP_CONFIG } from '@/infrastructure/common/config';

export class NotificationRepository implements INotificationRepository {
  private baseUrl = APP_CONFIG.api.baseUrl;

  async getUnreadNotificationCount(): Promise<NotificationCount> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);
      
      const response = await fetch(`${this.baseUrl}/notification/getUnreadNotificationCount`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result: NotificationCountDTO = await response.json();

      if (!response.ok || result.status !== 'success') {
        throw new Error(result.message || `Failed to fetch notification count: ${response.statusText}`);
      }

      return NotificationMapper.toCountDomain(result);
    } catch (error) {
      console.error('NotificationRepository.getUnreadNotificationCount error:', error);
      throw error;
    }
  }

  async getAllNotifications(): Promise<Notification[]> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);
      
      const response = await fetch(`${this.baseUrl}/notification/getAllNotification`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result: NotificationListDTO = await response.json();

      if (!response.ok || result.status !== 'success') {
        throw new Error(result.message || `Failed to fetch notifications: ${response.statusText}`);
      }

      return NotificationMapper.toNotificationListDomain(result);
    } catch (error) {
      console.error('NotificationRepository.getAllNotifications error:', error);
      throw error;
    }
  }

  async readNotifications(): Promise<void> {
    try {
      const token = localStorage.getItem(APP_CONFIG.auth.tokenKey);
      
      const response = await fetch(`${this.baseUrl}/notification/readNotification`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to mark notifications as read: ${response.statusText}`);
      }
    } catch (error) {
      console.error('NotificationRepository.readNotifications error:', error);
      throw error;
    }
  }
}
