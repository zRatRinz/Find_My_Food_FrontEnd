export interface NotificationCount {
  count: number;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
}
