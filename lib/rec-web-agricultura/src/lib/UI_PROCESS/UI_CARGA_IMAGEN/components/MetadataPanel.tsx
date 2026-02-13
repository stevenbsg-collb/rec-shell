import React from 'react';
import { Card, Group, Text, SimpleGrid } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { ResultDataYOLO } from '../../../types/yolo';

interface MetadataPanelProps {
  metadata: ResultDataYOLO['metadata'];
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ metadata }) => {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group mb="md">
        <IconInfoCircle size={20} />
        <Text fw={600}>Información Técnica</Text>
      </Group>

      <SimpleGrid cols={2} spacing="sm">
        <div>
          <Text size="xs" c="dimmed">
            Dimensiones Imagen
          </Text>
          <Text size="sm" fw={500}>
            {metadata.dimensiones_imagen.ancho} ×{' '}
            {metadata.dimensiones_imagen.alto}px
          </Text>
        </div>

        <div>
          <Text size="xs" c="dimmed">
            Umbral Confianza
          </Text>
          <Text size="sm" fw={500}>
            {(metadata.umbral_confianza * 100).toFixed(0)}%
          </Text>
        </div>

        <div>
          <Text size="xs" c="dimmed">
            Umbral IoU
          </Text>
          <Text size="sm" fw={500}>
            {metadata.umbral_iou}
          </Text>
        </div>

        <div>
          <Text size="xs" c="dimmed">
            Proporción
          </Text>
          <Text size="sm" fw={500}>
            {(
              metadata.dimensiones_imagen.ancho /
              metadata.dimensiones_imagen.alto
            ).toFixed(2)}
            :1
          </Text>
        </div>
      </SimpleGrid>
    </Card>
  );
};