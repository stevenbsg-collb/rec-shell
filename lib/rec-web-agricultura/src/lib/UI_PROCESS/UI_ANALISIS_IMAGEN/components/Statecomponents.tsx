import { Container, Stack, Loader, Alert, Center, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Cargando análisis...' }: LoadingStateProps) {
  return (
    <Container size="lg" py="xl">
      <Center h={400}>
        <Stack align="center" gap="md">
          <Loader size="xl" />
          <Text c="dimmed">{message}</Text>
        </Stack>
      </Center>
    </Container>
  );
}

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <Container size="lg" py="xl">
      <Alert icon={<IconAlertCircle size={20} />} title="Error" color="red">
        {error}
      </Alert>
    </Container>
  );
}

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = 'No hay análisis registrados. Realiza tu primer análisis para comenzar.',
}: EmptyStateProps) {
  return (
    <Alert
      icon={<IconAlertCircle size={20} />}
      title="Sin registros"
      color="blue"
    >
      {message}
    </Alert>
  );
}