import React from 'react';
import { Grid, Paper, Text } from '@mantine/core';

interface StatsGridProps {
  total: number;
  pendientes: number;
  completadas: number;
  errores: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  total,
  pendientes,
  completadas,
  errores,
}) => {
  return (
    <Grid>
      <Grid.Col span={3}>
        <Paper
          p="md"
          radius="md"
          style={{ background: '#f0f7ff', border: '1px solid #d0e1ff' }}
        >
          <Text size="xs" c="dimmed" mb={5}>
            Total
          </Text>
          <Text size="xl" fw={700}>
            {total}
          </Text>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper
          p="md"
          radius="md"
          style={{ background: '#fff5f0', border: '1px solid #ffd8cc' }}
        >
          <Text size="xs" c="dimmed" mb={5}>
            Pendientes
          </Text>
          <Text size="xl" fw={700}>
            {pendientes}
          </Text>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper
          p="md"
          radius="md"
          style={{ background: '#f0fff4', border: '1px solid #c6f6d5' }}
        >
          <Text size="xs" c="dimmed" mb={5}>
            Completadas
          </Text>
          <Text size="xl" fw={700}>
            {completadas}
          </Text>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper
          p="md"
          radius="md"
          style={{ background: '#fff0f0', border: '1px solid #ffc9c9' }}
        >
          <Text size="xs" c="dimmed" mb={5}>
            Errores
          </Text>
          <Text size="xl" fw={700}>
            {errores}
          </Text>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};