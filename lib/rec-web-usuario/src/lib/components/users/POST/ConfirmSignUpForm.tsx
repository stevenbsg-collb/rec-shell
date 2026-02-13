import React, { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  PinInput,
  Center,
  LoadingOverlay,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { NOTIFICATION_MESSAGES, useNotifications } from '@rec-shell/rec-web-shared';
import { useConfirmSignUp } from '../../../hooks/useConfirmSignUp';
import { ConfirmSignUpFormProps } from '../../../types/auth.types';
import { FormErrorAlert } from '../../common/FormErrorAlert';


export const ConfirmSignUpForm: React.FC<ConfirmSignUpFormProps> = ({
  username,
  onSuccess,
  onBack,
}) => {
  const { confirmSignUp, loading, error, setError } = useConfirmSignUp();
  const [code, setCode] = useState('');
  const [resending, setResending] = useState(false);
  const notifications = useNotifications();

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    try {
      await confirmSignUp(username, code);

      notifications.success(
        NOTIFICATION_MESSAGES.AUTH.CONFIRMATION_SUCCESS.title,
        NOTIFICATION_MESSAGES.AUTH.CONFIRMATION_SUCCESS.message,
        <IconCheck />
      );     
      onSuccess?.();
    } catch (err) {
      console.error('Error en confirmación:', err);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      notifications.info(
        NOTIFICATION_MESSAGES.AUTH.CODE_RESENT.title,
        NOTIFICATION_MESSAGES.AUTH.CODE_RESENT.message,
      );
    } catch (err) {
      notifications.error(
        NOTIFICATION_MESSAGES.AUTH.RESEND_ERROR.title,
        NOTIFICATION_MESSAGES.AUTH.RESEND_ERROR.message
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

        <Title style={{ textAlign: 'center', marginBottom: 'var(--mantine-spacing-md)' }}>
          Confirmar Registro
        </Title>

        <Text size="sm" c="dimmed" ta="center" mb="xl">
          Hemos enviado un código de 6 dígitos a tu email.
          <br />
          Usuario: <strong>{username}</strong>
        </Text>

        <FormErrorAlert error={error} onClose={() => setError('')} />

        <Stack gap="lg">
          <Center>
            <PinInput
              length={6}
              type="number"
              placeholder="○"
              value={code}
              onChange={setCode}
              size="lg"
            />
          </Center>

          <Button
            fullWidth
            onClick={handleSubmit}
            loading={loading}
            disabled={code.length !== 6}
          >
            Confirmar Código
          </Button>

          <Group justify="center" gap="xs">
            <Text size="sm" c="dimmed">
              ¿No recibiste el código?
            </Text>
            <Button
              size="sm"
              variant="subtle"
              onClick={handleResendCode}
              loading={resending}
            >
              Reenviar
            </Button>
          </Group>

          <Button variant="subtle" fullWidth onClick={onBack}>
            Volver al registro
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};