import { notifications } from '@mantine/notifications';
import { NotificationConfig, NotificationService } from './types';

class NotificationServiceImpl implements NotificationService {
  show(config: NotificationConfig): void {
    notifications.show({
      title: config.title,
      message: config.message,
      color: config.color || 'blue',
      icon: config.icon,
      autoClose: config.autoClose !== undefined ? config.autoClose : 4000,
      position: config.position || 'top-right',
    });
  }

  success(title: string, message: string, icon: React.ReactNode ): void {
   this.show({
      title,
      message,
      color: 'green',
      icon,
    });
  }

  error(title: string, message: string): void {
    this.show({
      title,
      message,
      color: 'red',
    });
  }

  info(title: string, message: string): void {
    this.show({
      title,
      message,
      color: 'blue',
    });
  }

  warning(title: string, message: string): void {
    this.show({
      title,
      message,
      color: 'yellow',
    });
  }
}

export const notificationService = new NotificationServiceImpl();