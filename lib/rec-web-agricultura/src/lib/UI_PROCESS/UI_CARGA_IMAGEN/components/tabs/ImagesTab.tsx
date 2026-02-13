import React from 'react';
import { Paper, Stack, Group, Text, Button, Divider } from '@mantine/core';
import { IconBulb } from '@tabler/icons-react';
import { ImagenAnalisis} from '../../../../types/yolo';
import { ImageCard } from './ImageCard';

interface ImagesTabProps {
  imagenes: ImagenAnalisis[];
  estadisticasGlobales: {
    completadas: number;
    analizando: number;
    error: number;
    pendientes: number;
  };
  analizarImagen: (id: string) => void;
  eliminarImagen: (id: string) => void;
  generarRecomendacionesConsolidadas: () => void;
  isLoadingRecommendations: boolean;
}

export const ImagesTab: React.FC<ImagesTabProps> = ({
  imagenes,
  estadisticasGlobales,
  analizarImagen,
  eliminarImagen,
  generarRecomendacionesConsolidadas,
  isLoadingRecommendations,
}) => {
  return (
    <Paper shadow="sm" radius="lg" p="md" style={{ background: 'white' }}>
      <Stack gap="md">
        {/* Botones de acción */}
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Imágenes Analizadas ({imagenes.length})
          </Text>
          <Group>
            <Button
              size="sm"
              disabled={
                estadisticasGlobales.completadas === 0 || isLoadingRecommendations
              }
              onClick={generarRecomendacionesConsolidadas}
              loading={isLoadingRecommendations}
              variant="gradient"
              gradient={{ from: '#f093fb', to: '#f5576c' }}
              leftSection={<IconBulb size={16} />}
            >
              Generar Recomendaciones
            </Button>
          </Group>
        </Group>

        <Divider />

        {/* Lista de imágenes */}
        <Stack gap="md">
          {imagenes.map((imagen) => (
            <ImageCard
              key={imagen.id}
              imagen={imagen}
              analizarImagen={analizarImagen}
              eliminarImagen={eliminarImagen}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
};