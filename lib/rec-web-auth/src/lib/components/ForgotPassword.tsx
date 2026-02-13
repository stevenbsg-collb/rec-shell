
import React, { useState } from 'react';
import {
  Paper,
  TextInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Alert,
  LoadingOverlay,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconAlertCircle,
  IconMail,
  IconUser,
  IconArrowLeft,
  IconCheck,
} from '@tabler/icons-react';

interface ForgotPasswordProps {
  onSubmit?: (username: string) => Promise<void>;
  onBackToSignIn?: () => void;
  onContinue?: () => void;
  loading?: boolean;
  error?: string;
  success?: boolean;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onSubmit,
  onBackToSignIn,
  loading = false,
  error,
  success = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      username: '',
    },

    validate: {
      username: (value) => {
        if (!value) return 'El nombre de usuario es requerido';
        if (value.length < 3) return 'El nombre de usuario debe tener al menos 3 caracteres';
        return null;
      },
    },
  });

  const handleSubmit = async (values: { username: string }) => {
    if (!onSubmit) return;

    try {
      setIsSubmitting(true);
      await onSubmit(values.username);
    } catch (err) {
      console.log('Forgot password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  if (success) {
    return (
      <Box maw={400} mx="auto">
        <Paper withBorder shadow="md" p={30} radius="md">
          <Alert
            icon={<IconCheck size="1.5rem" />}
            title="Solicitud enviada"
            color="green"
            mb="lg"
          >
            <Text size="sm">
              Si el usuario existe en nuestro sistema, recibirás un código de confirmación
              para restablecer tu contraseña.
            </Text>
          </Alert>

          <Text ta="center" mb="lg">
            Revisa tu método de contacto registrado (email o SMS) para obtener el código
            de verificación.
          </Text>

          {onBackToSignIn && (
            <Button
              variant="light"
              fullWidth
              leftSection={<IconArrowLeft size="1rem" />}
              onClick={onBackToSignIn}
            >
              Volver al inicio de sesión
            </Button>
          )}
        </Paper>
      </Box>
    );
  }

  return (
    <Box maw={400} mx="auto" pos="relative">
      <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
      
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title order={2} ta="center" mb={20}>
          Recuperar Contraseña
        </Title>

        <Text c="dimmed" size="sm" ta="center" mb={30}>
          Ingresa tu nombre de usuario para recibir un código de verificación
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
            <TextInput
              label="Usuario"
              placeholder="Ingresa tu nombre de usuario"
              leftSection={<IconUser size="1rem" />}
              required
              disabled={isLoading}
              {...form.getInputProps('username')}
            />

            <Button
              type="submit"
              fullWidth
              leftSection={<IconMail size="1rem" />}
              disabled={isLoading}
              loading={isLoading}
              mt="md"
            >
              Enviar código de recuperación
            </Button>

            {onBackToSignIn && (
              <Text ta="center" mt="md">
                <Anchor
                  component="button"
                  type="button"
                  c="dimmed"
                  onClick={onBackToSignIn}
                  size="sm"
                  disabled={isLoading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <IconArrowLeft size="0.8rem" />
                  Volver al inicio de sesión
                </Anchor>
              </Text>
            )}
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;