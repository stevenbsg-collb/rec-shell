import { Card, Stack, Group, ThemeIcon, Text } from '@mantine/core';
import {
  IconTarget,
  IconLeaf,
  IconChartBar,
} from '@tabler/icons-react';

interface EstadisticasCardsProps {
  totalDetecciones: number;
  deficienciasUnicas: number;
  confianzaPromedio: number;
  confianzaMaxima: number;
}

export function EstadisticasCards({
  totalDetecciones,
  deficienciasUnicas,
  confianzaPromedio,
  confianzaMaxima,
}: EstadisticasCardsProps) {
  return (
    <>
      <Card withBorder padding="md">
        <Stack gap="xs">
          <Group gap="xs">
            <ThemeIcon color="blue" variant="light">
              <IconTarget size={20} />
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              Total Detecciones
            </Text>
          </Group>
          <Text size="xl" fw={700}>
            {totalDetecciones}
          </Text>
        </Stack>
      </Card>

      <Card withBorder padding="md">
        <Stack gap="xs">
          <Group gap="xs">
            <ThemeIcon color="teal" variant="light">
              <IconLeaf size={20} />
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              Deficiencias Únicas
            </Text>
          </Group>
          <Text size="xl" fw={700}>
            {deficienciasUnicas}
          </Text>
        </Stack>
      </Card>

      <Card withBorder padding="md">
        <Stack gap="xs">
          <Group gap="xs">
            <ThemeIcon color="green" variant="light">
              <IconChartBar size={20} />
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              Confianza Promedio
            </Text>
          </Group>
          <Text size="xl" fw={700}>
            {confianzaPromedio.toFixed(1)}%
          </Text>
        </Stack>
      </Card>

      <Card withBorder padding="md">
        <Stack gap="xs">
          <Group gap="xs">
            <ThemeIcon color="orange" variant="light">
              <IconChartBar size={20} />
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              Confianza Máxima
            </Text>
          </Group>
          <Text size="xl" fw={700}>
            {confianzaMaxima.toFixed(1)}%
          </Text>
        </Stack>
      </Card>
    </>
  );
}