import { Stack, Paper, Group, Badge, Text } from '@mantine/core';
import { AnalisisImagenYOLO_DTO } from '../../../types/yolo';
import { formatDeficiencia, getConfianzaColor } from '../../UI_CARGA_IMAGEN/utils/apiUtils';

interface DeteccionesListProps {
  detecciones: AnalisisImagenYOLO_DTO['detecciones'];
}

export function DeteccionesList({ detecciones }: DeteccionesListProps) {
  return (
    <Stack gap="sm">
      {detecciones.map((deteccion) => (
        <Paper key={deteccion.area} p="md" withBorder>
          <Stack gap="xs">
            <Group justify="space-between">
              <Badge size="lg" variant="filled" color="blue">
                Región {deteccion.area}
              </Badge>
              <Badge
                size="lg"
                color={getConfianzaColor(deteccion.confianza)}
              >
                {deteccion.confianza.toFixed(1)}% confianza
              </Badge>
            </Group>

            <Group>
              <Text fw={500}>Deficiencia:</Text>
              <Badge color="teal" variant="light">
                {formatDeficiencia(deteccion.deficiencia)}
              </Badge>
            </Group>

            <Group>
              <Text fw={500} size="sm">
                Área:
              </Text>
              <Text size="sm">
                {deteccion.area.toLocaleString()} px²
              </Text>
            </Group>

            <Group>
              <Text fw={500} size="sm">
                Ubicación:
              </Text>
              <Text size="sm" c="dimmed">
                ({deteccion.bbox.x1}, {deteccion.bbox.y1}) →
                ({deteccion.bbox.x2}, {deteccion.bbox.y2})
              </Text>
            </Group>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}