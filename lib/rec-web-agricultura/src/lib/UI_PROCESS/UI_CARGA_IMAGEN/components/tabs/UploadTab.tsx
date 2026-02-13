import React from 'react';
import { Paper, Stack, Group, Button, Table, ScrollArea, Text, Badge } from '@mantine/core';
import { ImagenAnalisis } from '../../../../types/yolo';
import { UploadZone } from '../UploadZone';
import { StatsGrid } from '../StatsGrid';

interface UploadTabProps {
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (files: FileList | null) => void;
  imagenes: ImagenAnalisis[];
  estadisticasGlobales: {
    completadas: number;
    analizando: number;
    error: number;
    pendientes: number;
  };
  analizarTodasLasImagenes: () => void;
  setActiveTab: (tab: string) => void;
}

export const UploadTab: React.FC<UploadTabProps> = ({
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileSelect,
  imagenes,
  estadisticasGlobales,
  analizarTodasLasImagenes,
  setActiveTab,
}) => {
  const formatGPS = (lat?: number, lon?: number) => {
    if (typeof lat !== 'number' || typeof lon !== 'number') return '—';
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  };

  return (
    <Paper shadow="sm" radius="lg" p="xl" style={{ background: 'white' }}>
      <Stack gap="lg">
        {/* Zona de carga */}
        <UploadZone
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
        />

        {/* Estadísticas rápidas */}
        {imagenes.length > 0 && (
          <>
            <StatsGrid
              total={imagenes.length}
              pendientes={estadisticasGlobales.pendientes}
              completadas={estadisticasGlobales.completadas}
              errores={estadisticasGlobales.error}
            />

            {/* Solo ubicación (GPS EXIF) extraída de las imágenes */}
            <ScrollArea h={220} type="auto" offsetScrollbars>
              <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Archivo</Table.Th>
                    <Table.Th>Ubicación (GPS)</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {imagenes.map((img) => {
                    const meta = img.metadataArchivo;
                    const gpsText = formatGPS(meta?.gps?.latitude, meta?.gps?.longitude);

                    return (
                      <Table.Tr key={img.id}>
                        <Table.Td>
                          <Text size="sm" fw={500} lineClamp={1}>
                            {img.file.name}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          {gpsText === '—' ? (
                            <Text size="sm" c="dimmed">
                              —
                            </Text>
                          ) : (
                            <Badge variant="light">{gpsText}</Badge>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            <Group grow>
              {(estadisticasGlobales.pendientes > 0 ||
                estadisticasGlobales.error > 0) && (
                <Button
                  size="lg"
                  radius="md"
                  onClick={analizarTodasLasImagenes}
                  loading={estadisticasGlobales.analizando > 0}
                  variant="gradient"
                  gradient={{ from: '#667eea', to: '#764ba2' }}
                >
                  Re-analizar{' '}
                  {estadisticasGlobales.pendientes + estadisticasGlobales.error}{' '}
                  pendiente
                  {estadisticasGlobales.pendientes + estadisticasGlobales.error > 1
                    ? 's'
                    : ''}
                </Button>
              )}

              <Button
                size="lg"
                radius="md"
                variant="light"
                onClick={() => setActiveTab('images')}
              >
                Ver Imágenes
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Paper>
  );
};