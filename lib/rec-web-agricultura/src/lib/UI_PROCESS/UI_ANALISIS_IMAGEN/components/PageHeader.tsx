import { Group, Title, Text, Stack } from '@mantine/core';
import { ActionButtons } from '@rec-shell/rec-web-shared';

interface PageHeaderProps {
  onRefresh: () => void;
}

export function PageHeader({ onRefresh }: PageHeaderProps) {
  return (
    <Group justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', gap: 16 }}>
      <Stack gap={4}>
        <Title order={2} style={{ fontSize: 'clamp(20px, 3vw, 28px)', lineHeight: 1.15 }}>Generar Planes de Tratamiento</Title>
        <Text c="dimmed" size="sm">
          Análisis de Imágenes
        </Text>
      </Stack>
      <ActionButtons.Refresh onClick={onRefresh} />
    </Group>
  );
}