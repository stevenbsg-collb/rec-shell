import React from 'react';
import {
  Card,
  Group,
  Badge,
  Stack,
  Text,
  Divider,
  SimpleGrid,
  Paper,
} from '@mantine/core';
import { IconZoomScan } from '@tabler/icons-react';
import { Deteccion } from '../../../types/yolo';

interface DeteccionCardProps {
  deteccion: Deteccion;
  index: number;
}

const getSeverityColor = (confianza: number) => {
  if (confianza >= 90) return 'red';
  if (confianza >= 70) return 'orange';
  return 'yellow';
};

export const DeteccionCard: React.FC<DeteccionCardProps> = ({
  deteccion,
  index,
}) => {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <Badge
            color={getSeverityColor(deteccion.confianza)}
            size="lg"
            variant="filled"
            leftSection={<IconZoomScan size={12} />}
          >
            Región {deteccion.area}
          </Badge>
          <Badge color="blue" variant="light" style={{ textTransform: 'none' }}>
            {deteccion.deficiencia}
          </Badge>
        </Group>
        <Badge color="gray" variant="light">
          #{index + 1}
        </Badge>
      </Group>

      <Stack gap="xs">
        <Group justify="space-between">
          <Text size="sm" fw={500}>
            Confianza:
          </Text>
          <Text size="sm" fw={700} c={getSeverityColor(deteccion.confianza)}>
            {deteccion.confianza.toFixed(2)}%
          </Text>
        </Group>

        <Divider />

        <Text size="sm" fw={600} mb={4}>
          Ubicación en la imagen:
        </Text>
        <SimpleGrid cols={2} spacing="xs">
          <Paper p="xs" radius="sm" style={{ background: '#f8f9fa' }}>
            <Text size="xs" c="dimmed">
              Esquina superior
            </Text>
            <Text size="xs">
              X: {deteccion.bbox.x1}, Y: {deteccion.bbox.y1}
            </Text>
          </Paper>
          <Paper p="xs" radius="sm" style={{ background: '#f8f9fa' }}>
            <Text size="xs" c="dimmed">
              Esquina inferior
            </Text>
            <Text size="xs">
              X: {deteccion.bbox.x2}, Y: {deteccion.bbox.y2}
            </Text>
          </Paper>
        </SimpleGrid>

        <SimpleGrid cols={2} spacing="xs">
          <Paper p="xs" radius="sm" style={{ background: '#f0f7ff' }}>
            <Text size="xs" c="dimmed">
              Ancho
            </Text>
            <Text size="xs" fw={600}>
              {Math.abs(deteccion.bbox.x2 - deteccion.bbox.x1)} px
            </Text>
          </Paper>
          <Paper p="xs" radius="sm" style={{ background: '#f0f7ff' }}>
            <Text size="xs" c="dimmed">
              Alto
            </Text>
            <Text size="xs" fw={600}>
              {Math.abs(deteccion.bbox.y2 - deteccion.bbox.y1)} px
            </Text>
          </Paper>
        </SimpleGrid>

        <Paper p="xs" radius="sm" style={{ background: '#e6f7ff' }}>
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              Área total detectada:
            </Text>
            <Text size="xs" fw={600}>
              {deteccion.area.toLocaleString()} px²
            </Text>
          </Group>
        </Paper>
      </Stack>
    </Card>
  );
};