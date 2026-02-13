export interface NotificationConfig {
  title: string;
  message: string;
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'orange';
  icon?: React.ReactNode;
  autoClose?: boolean | number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

export interface NotificationService {
  show: (config: NotificationConfig) => void;
  success: (title: string, message: string, icon?: React.ReactNode) => void;
  error: (title: string, message: string) => void;
  info: (title: string, message: string) => void;
  warning: (title: string, message: string) => void;
}