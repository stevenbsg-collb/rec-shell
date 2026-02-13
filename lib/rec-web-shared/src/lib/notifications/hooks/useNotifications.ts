import { useCallback } from 'react';
import { NotificationConfig } from '../types';
import { notificationService } from '../notification.service';
import { NOTIFICATION_MESSAGES } from '../constants';
export const useNotifications = () => {
  const showNotification = useCallback((config: NotificationConfig) => {
    notificationService.show(config);
  }, []);

  const showSuccess = useCallback((
    title: string = NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title,
    message: string = NOTIFICATION_MESSAGES.GENERAL.SUCCESS.message,
    icon?: React.ReactNode) => {
    notificationService.success(title, message, icon);
  }, []);

  const showError = useCallback((title: string, message: string) => {
    notificationService.error(title, message);
  }, []);

  const showInfo = useCallback((title: string, message: string) => {
    notificationService.info(title, message);
  }, []);

  const showWarning = useCallback((title: string, message: string) => {
    notificationService.warning(title, message);
  }, []);

  return {
    show: showNotification,
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
  };
};