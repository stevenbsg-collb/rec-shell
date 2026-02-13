import React, { useState } from 'react';
import {
  Paper,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Alert,
  LoadingOverlay,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconAlertCircle,
  IconLock,
  IconShieldCheck,
  IconCheck,
  IconKey,
} from '@tabler/icons-react';

interface ChangePasswordProps {
  onSubmit?: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  loading?: boolean;
  error?: string;
  success?: boolean;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({
  onSubmit,
  loading = false,
  error,
  success = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },

    validate: {
      currentPassword: (value) => {
        if (!value) return 'La contraseña actual es requerida';
        return null;
      },
      newPassword: (value) => {
        if (!value) return 'La nueva contraseña es requerida';
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
        }
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) return 'Confirma tu nueva contraseña';
        if (value !== values.newPassword) return 'Las contraseñas no coinciden';
        return null;
      },
    },
  });

  const handleSubmit = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (!onSubmit) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      form.reset();
    } catch (err) {
      console.error('Change password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <Box maw={400} mx="auto" pos="relative">
      <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
      
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title order={2} ta="center" mb={20}>
          Cambiar Contraseña
        </Title>

        <Text c="dimmed" size="sm" ta="center" mb={30}>
          Ingresa tu contraseña actual y la nueva contraseña
        </Text>

        {success && (
          <Alert
            icon={<IconCheck size="1rem" />}
            title="Contraseña actualizada"
            color="green"
            mb="lg"
          >
            Tu contraseña ha sido cambiada exitosamente.
          </Alert>
        )}

        {error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error"
            color="red"
            mb="lg"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <PasswordInput
              label="Contraseña actual"
              placeholder="Ingresa tu contraseña actual"
              leftSection={<IconKey size="1rem" />}
              required
              disabled={isLoading}
              {...form.getInputProps('currentPassword')}
            />

            <PasswordInput
              label="Nueva contraseña"
              placeholder="Ingresa tu nueva contraseña"
              leftSection={<IconLock size="1rem" />}
              required
              disabled={isLoading}
              {...form.getInputProps('newPassword')}
            />

            <PasswordInput
              label="Confirmar nueva contraseña"
              placeholder="Confirma tu nueva contraseña"
              leftSection={<IconShieldCheck size="1rem" />}
              required
              disabled={isLoading}
              {...form.getInputProps('confirmPassword')}
            />

            <Button
              type="submit"
              fullWidth
              leftSection={<IconCheck size="1rem" />}
              disabled={isLoading}
              loading={isLoading}
              mt="md"
            >
              Cambiar contraseña
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ChangePassword;