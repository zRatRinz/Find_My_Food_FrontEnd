import { NotificationCount, Notification } from './Notification';

export interface INotificationRepository {
  getUnreadNotificationCount(): Promise<NotificationCount>;
  getAllNotifications(): Promise<Notification[]>;
  readNotifications(): Promise<void>;
}
