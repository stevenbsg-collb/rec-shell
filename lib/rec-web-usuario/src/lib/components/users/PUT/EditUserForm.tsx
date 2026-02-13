import React, { useEffect } from 'react';
import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Stack,
  Box,
  LoadingOverlay,
  Select,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconCheck,
  IconMail,
  IconUser,
  IconPhone,
  IconArrowLeft,
} from '@tabler/icons-react';


import {
  ActionButtons,
  NOTIFICATION_MESSAGES,
  useNotifications,
} from '@rec-shell/rec-web-shared';
import { User, EditUserFormValues, statusOptions } from '../../../types/users.types';
import { FormErrorAlert } from '../../common/FormErrorAlert';

interface EditUserFormProps {
  user: User | null;
  loading?: boolean;
  error?: string | null;
  onSubmit: (values: EditUserFormValues) => Promise<void>;
  onCancel: () => void;
  onClearError?: () => void;
}

// Validaciones para el formulario de edición
const editUserValidations = {
  username: (value: string) => {
    if (!value) return 'El nombre de usuario es requerido';
    if (value.length < 3)
      return 'El nombre de usuario debe tener al menos 3 caracteres';
    return null;
  },
  email: (value: string) => {
    if (!value) return 'El email es requerido';
    if (!/^\S+@\S+$/.test(value)) return 'Email inválido';
    return null;
  },
  firstName: (value: string) => {
    if (!value) return 'El nombre es requerido';
    if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
    return null;
  },
  lastName: (value: string) => {
    if (!value) return 'El apellido es requerido';
    if (value.length < 2) return 'El apellido debe tener al menos 2 caracteres';
    return null;
  },
  phoneNumber: (value: string) => {
    if (!value) return 'El teléfono es requerido';
    if (!/^\+?[\d\s\-\(\)]+$/.test(value))
      return 'Formato de teléfono inválido';
    return null;
  },
  newPassword: (value: string | undefined) => {
    if (value && value.length > 0 && value.length < 6) {
      return 'La nueva contraseña debe tener al menos 6 caracteres';
    }
    return null;
  },
  confirmNewPassword: (
    value: string | undefined,
    values: EditUserFormValues
  ) => {
    if (values.newPassword && value !== values.newPassword) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  },
};

export const EditUserForm: React.FC<EditUserFormProps> = ({
  user,
  loading = false,
  error,
  onSubmit,
  onCancel,
  onClearError,
}) => {
  const notifications = useNotifications();

  const form = useForm<EditUserFormValues>({
    initialValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      enabled: true,
      status: 'CONFIRMED',
      newPassword: '',
      confirmNewPassword: '',
    },
    validate: editUserValidations,
  });

  // Loading data users
  useEffect(() => {
    if (user) {
      form.setValues({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        enabled: user.enabled ?? true,
        status: user.status || 'CONFIRMED',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  }, [user]);

  const handleSubmit = async (values: EditUserFormValues) => {
    try {
      // Si no hay nueva contraseña, remover los campos de contraseña
      const submitData = { ...values };
      if (!values.newPassword || values.newPassword.trim() === '') {
        delete submitData.newPassword;
        delete submitData.confirmNewPassword;
      }

      await onSubmit(submitData);

      notifications.success(
        NOTIFICATION_MESSAGES.AUTH.UPDATE_SUCCESS.title,
        NOTIFICATION_MESSAGES.AUTH.UPDATE_SUCCESS.message,
        <IconCheck />
      );
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="w-full mx-auto">
      <Paper withBorder p={40} mt={30} radius="md" pos="relative">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <Group justify="space-between" align="center" mb="md">
          <Title order={2}>Editar Usuario</Title>
          <Group gap="sm">
          
          <ActionButtons.Cancel 
            onClick={onCancel} 
            disabled={loading} 
          />
          <ActionButtons.Update 
            onClick={() => form.onSubmit(handleSubmit)()} 
            loading={loading} 
          />
        </Group>
        </Group>

        <FormErrorAlert error={error} onClose={() => onClearError?.()} />

        <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            {/* Información básica */}
            <Group grow>
              <TextInput
                label="Nombre"
                placeholder="Nombre del usuario"
                required
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label="Apellido"
                placeholder="Apellido del usuario"
                required
                {...form.getInputProps('lastName')}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Email"
                placeholder="email@ejemplo.com"
                required
                leftSection={<IconMail size="1rem" />}
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Teléfono"
                placeholder="+1234567890"
                required
                leftSection={<IconPhone size="1rem" />}
                {...form.getInputProps('phoneNumber')}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Nombre de usuario"
                placeholder="Nombre de usuario"
                required
                readOnly
                leftSection={<IconUser size="1rem" />}
                styles={{
                  input: {
                    backgroundColor: '#f8f9fa',
                    color: '#6c757d',
                    cursor: 'not-allowed',
                  },
                }}
                {...form.getInputProps('username')}
              />
              <Select
                label="Estado"
                placeholder="Selecciona el estado"
                data={statusOptions}
                {...form.getInputProps('status')}
              />
            </Group>

            {/* Sección de cambio de contraseña (opcional) */}
            <Title order={4} mt="lg" mb="sm">
              Cambiar Contraseña (Opcional)
            </Title>

            <Group grow>
              <PasswordInput
                label="Nueva contraseña"
                placeholder="Deja en blanco para mantener la actual"
                {...form.getInputProps('newPassword')}
              />
              <PasswordInput
                label="Confirmar nueva contraseña"
                placeholder="Repite la nueva contraseña"
                {...form.getInputProps('confirmNewPassword')}
              />
            </Group>
          </Stack>
        </Box>
      </Paper>
    </div>
  );
};
