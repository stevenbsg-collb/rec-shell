export interface DataSummaryProps {
  filteredCount: number;
  totalCount: number;
  itemName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface LoadingScreenProps {
  message?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  containerSize?: string;
  height?: number;
}

export interface ErrorAlertProps {
  error: string | null;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface LoadingMessageProps {
  message?: string;
  withBorder?: boolean;
  padding?: string;
  textColor?: string;
}

export interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  padding?: string;
  textColor?: string;
  withIcon?: boolean;
  actionButton?: React.ReactNode;
}