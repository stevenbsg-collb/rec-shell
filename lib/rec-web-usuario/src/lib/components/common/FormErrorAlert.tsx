import React from 'react';
import { Alert } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { FormErrorAlertProps } from '../../types/auth.types';

export const FormErrorAlert: React.FC<FormErrorAlertProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <Alert
      icon={<IconX size="1rem" />}
      title="Error"
      color="red"
      onClose={onClose}
      withCloseButton
    >
      {error}
    </Alert>
  );
};