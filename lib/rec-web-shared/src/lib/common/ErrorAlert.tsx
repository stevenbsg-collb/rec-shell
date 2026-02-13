import React from 'react';
import { Alert } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

interface ErrorAlertProps {
  error: string | null;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  color?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  onClose, 
  title = 'Error',
  icon = <IconExclamationCircle size={16} />,
  color = 'red'
}) => {
  if (!error) return null;

  return (
    <Alert
      icon={icon}
      title={title}
      color={color}
      onClose={onClose}
      withCloseButton
    >
      {error}
    </Alert>
  );
};