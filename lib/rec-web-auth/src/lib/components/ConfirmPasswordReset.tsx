import React, { useState, useEffect } from 'react';
import {
  Paper,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Alert,
  LoadingOverlay,
  Box,
  PinInput,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconAlertCircle,
  IconLock,
  IconArrowLeft,
  IconCheck,
  IconShieldCheck,
  IconLogin,
} from '@tabler/icons-react';

interface ConfirmPasswordResetProps {
  username: string;
  onSubmit?: (data: { username: string; code: string; newPassword: string }) => Promise<void>;
  onBackToForgotPassword?: () => void;
  onSuccess?: () => void;
  loading?: boolean;
  error?: string;
  success?: boolean;
}

export const ConfirmPasswordReset: React.FC<ConfirmPasswordResetProps> = ({
  username,
  onSubmit,
  onBackToForgotPassword,
  onSuccess, 
  loading = false,
  error,
  success = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const form = useForm({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },

    validate: {
      newPassword: (value) => {
        if (!value) return 'La nueva contraseña es requerida';
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
        }
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) return 'Confirma tu contraseña';
        if (value !== values.newPassword) return 'Las contraseñas no coinciden';
        return null;
      },
    },
  });

  useEffect(() => {
    if (success) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, onSuccess]);

  const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
    if (!onSubmit || !confirmationCode) return;
    if (confirmationCode.length !== 6) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        username,
        code: confirmationCode,
        newPassword: values.newPassword,
      });
    } catch (err) {
      console.error('❌ Confirm password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    if (onSuccess) {
      onSuccess();
    }
  };
 
  const isLoading = loading || isSubmitting;
  //const canSubmit = confirmationCode.length === 6 && !form.validate().hasErrors;
  const canSubmit = confirmationCode.length === 6 && Object.keys(form.errors).length === 0;


  if (success || showSuccessMessage) {
    return (
      <Box maw={400} mx="auto">
        <Paper withBorder shadow="md" p={30} radius="md">
          <Alert
            icon={<IconCheck size="1.5rem" />}
            title="Contraseña restablecida"
            color="green"
            mb="lg"
          >
            <Text size="sm" mb="md">
              Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </Text>
            <Text size="xs" c="dimmed">
              Serás redirigido automáticamente al inicio de sesión en unos segundos...
            </Text>
          </Alert>

          <Button
            fullWidth
            leftSection={<IconLogin size="1rem" />}
            onClick={handleGoToLogin}
            variant="light"
          >
            Ir al inicio de sesión
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box maw={400} mx="auto" pos="relative">
      <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
      
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title order={2} ta="center" mb={20}>
          Restablecer Contraseña
        </Title>

        <Text c="dimmed" size="sm" ta="center" mb={10}>
          Ingresa el código de verificación que recibiste y tu nueva contraseña
        </Text>
        
        <Text size="sm" fw={500} ta="center" mb={30} c="blue">
          Usuario: {username}
        </Text>

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
            <Box>
              <Text size="sm" fw={500} mb={8}>
                Código de verificación
              </Text>
              <Group justify="center" mb="sm">
                <PinInput
                  length={6}
                  value={confirmationCode}
                  onChange={setConfirmationCode}
                  disabled={isLoading}
                  size="lg"
                  type="number"
                />
              </Group>
              <Text size="xs" c="dimmed" ta="center" mb="lg">
                Ingresa el código de 6 dígitos que recibiste
              </Text>
            </Box>

            <PasswordInput
              label="Nueva contraseña"
              placeholder="Ingresa tu nueva contraseña"
              leftSection={<IconLock size="1rem" />}
              required
              disabled={isLoading}
              {...form.getInputProps('newPassword')}
            />

            <PasswordInput
              label="Confirmar contraseña"
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
              disabled={isLoading || !canSubmit}
              loading={isLoading}
              mt="md"
            >
              Restablecer contraseña
            </Button>

            {onBackToForgotPassword && (
              <Text ta="center" mt="md">
                <Anchor
                  component="button"
                  type="button"
                  c="dimmed"
                  onClick={onBackToForgotPassword}
                  size="sm"
                  disabled={isLoading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <IconArrowLeft size="0.8rem" />
                  Volver
                </Anchor>
              </Text>
            )}
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ConfirmPasswordReset;