import React from 'react';
import {
  Card,
  Group,
  Text,
  Paper,
  SimpleGrid,
  Progress,
  Divider,
  Badge,
} from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import { getNutrientColor } from '../utils/apiUtils';
import { ResultDataYOLO } from '../../../types/yolo';

interface EstadisticasPanelProps {
  estadisticas: ResultDataYOLO['estadisticas'];
}

export const EstadisticasPanel: React.FC<EstadisticasPanelProps> = ({
  estadisticas,
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group mb="md">
        <IconChartBar size={20} />
        <Text fw={600} size="lg">
          Estadísticas del Análisis
        </Text>
      </Group>

      <SimpleGrid cols={2} spacing="md">
        <Paper p="md" radius="sm" style={{ background: '#f0f7ff' }}>
          <Text size="sm" c="dimmed" mb={4}>
            Total Detecciones
          </Text>
          <Text size="2rem" fw={700} c="blue">
            {estadisticas.total_detecciones}
          </Text>
        </Paper>

        <Paper p="md" radius="sm" style={{ background: '#f0fff4' }}>
          <Text size="sm" c="dimmed" mb={4}>
            Deficiencias Únicas
          </Text>
          <Text size="2rem" fw={700} c="green">
            {estadisticas.deficiencias_unicas}
          </Text>
        </Paper>

        <Paper p="md" radius="sm" style={{ background: '#fff7f0' }}>
          <Text size="sm" c="dimmed" mb={4}>
            Confianza Promedio
          </Text>
          <Group align="flex-end" gap="xs">
            <Text size="2rem" fw={700} c="orange">
              {estadisticas.confianza_promedio.toFixed(1)}%
            </Text>
            <Progress
              value={estadisticas.confianza_promedio}
              size="sm"
              radius="xl"
              style={{ flex: 1 }}
            />
          </Group>
        </Paper>

        <Paper p="md" radius="sm" style={{ background: '#fff0f0' }}>
          <Text size="sm" c="dimmed" mb={4}>
            Confianza Máxima
          </Text>
          <Text size="2rem" fw={700} c="red">
            {estadisticas.confianza_maxima.toFixed(1)}%
          </Text>
        </Paper>
      </SimpleGrid>

      <Divider my="md" />

      <Text size="sm" fw={600} mb="sm">
        Distribución por Tipo:
      </Text>

      <SimpleGrid cols={3} spacing="xs">
        {Object.entries(estadisticas.por_tipo).map(([tipo, cantidad]) => (
          <Badge
            key={tipo}
            color={getNutrientColor(tipo)}
            size="lg"
            variant="light"
            style={{ textTransform: 'none' }}
          >
            {tipo}: {cantidad}
          </Badge>
        ))}
      </SimpleGrid>
    </Card>
  );
};