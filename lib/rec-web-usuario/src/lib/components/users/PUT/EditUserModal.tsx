import React from 'react';
import { Modal } from '@mantine/core';
import { EditUserForm } from './EditUserForm';
import { useEditUser } from '../../../hooks/useEditUser';
import { User } from '../../../types/users.types';

interface EditUserModalProps {
  opened: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated?: (updatedUser: User) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  opened,
  onClose,
  user,
  onUserUpdated,
}) => {
  const { updateUser, loading, error, setError } = useEditUser();

  const handleSubmit = async (values: any) => {
    if (!user) return;

    try {
      const response = await updateUser(values);
      const updatedUser = response?.data;
      if (updatedUser) {
        onUserUpdated?.(updatedUser);
      }
      onClose();
    } catch (err) {
      console.error('Error actualizando usuario:', err);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  const handleClearError = () => {
    setError(null);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      size={1000}
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
      withCloseButton={!loading}
      centered
    >
      <EditUserForm
        user={user}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onClearError={handleClearError}
      />
    </Modal>
  );
};
