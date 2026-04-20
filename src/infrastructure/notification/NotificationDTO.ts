import { NotificationCount, Notification } from '@/domain/notification/Notification';

export interface NotificationCountDTO {
  status: string;
  message: string | null;
  data: {
    notification_count: number;
  };
}

export interface NotificationDTO {
  notification_id: number;
  title: string;
  body: string;
  create_date: string;
  is_read: boolean;
}

export interface NotificationListDTO {
  status: string;
  message: string | null;
  data: NotificationDTO[];
}

export class NotificationMapper {
  static toCountDomain(dto: NotificationCountDTO): NotificationCount {
    return {
      count: dto.data.notification_count,
    };
  }

  static toNotificationDomain(dto: NotificationDTO): Notification {
    return {
      id: dto.notification_id,
      title: dto.title,
      body: dto.body,
      createdAt: dto.create_date,
      isRead: dto.is_read,
    };
  }

  static toNotificationListDomain(dto: NotificationListDTO): Notification[] {
    return dto.data.map(item => this.toNotificationDomain(item));
  }
}
