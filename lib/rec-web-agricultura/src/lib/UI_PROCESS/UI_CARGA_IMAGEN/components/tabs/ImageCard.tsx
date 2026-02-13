import React from 'react';
import {
  Card,
  Group,
  Text,
  Badge,
  Button,
  ActionIcon,
  Alert,
  Stack,
  Center,
  Loader,
  Image,
  Grid,
  SimpleGrid,
  Tooltip,
} from '@mantine/core';
import {
  IconTrash,
  IconAlertCircle,
  IconCircleCheck,
  IconShieldCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import { DeteccionCard } from '../DeteccionCard';
import { ImagenAnalisis} from '../../../../types/yolo';
import { EstadisticasPanel } from '../EstadisticasPanel';
import { MetadataPanel } from '../MetadataPanel';

interface ImageCardProps {
  imagen: ImagenAnalisis;
  analizarImagen: (id: string) => void;
  eliminarImagen: (id: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  imagen,
  analizarImagen,
  eliminarImagen,
}) => {
  const getBorderColor = () => {
    switch (imagen.estado) {
      case 'completado':
        return '#40c057';
      case 'analizando':
        return '#228be6';
      case 'error':
        return '#fa5252';
      default:
        return '#868e96';
    }
  };

  const getBadgeProps = () => {
    switch (imagen.estado) {
      case 'completado':
        return { color: 'green', text: '✓ Completado' };
      case 'analizando':
        return { color: 'blue', text: '⏳ Analizando' };
      case 'error':
        return { color: 'red', text: '✗ Error' };
      default:
        return { color: 'gray', text: '⏸ Pendiente' };
    }
  };

  const badgeProps = getBadgeProps();

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      style={{ borderLeft: `4px solid ${getBorderColor()}` }}
    >
      <Group justify="space-between" mb="md">
        <Group>
          <Text fw={500}>{imagen.file.name}</Text>
          <Badge color={badgeProps.color} variant="light">
            {badgeProps.text}
          </Badge>
        </Group>
        <Group>
          {imagen.estado === 'pendiente' && (
            <Button size="xs" onClick={() => analizarImagen(imagen.id)}>
              Analizar
            </Button>
          )}
          {imagen.estado === 'error' && (
            <Button
              size="xs"
              color="orange"
              onClick={() => analizarImagen(imagen.id)}
            >
              Reintentar
            </Button>
          )}
          <ActionIcon
            color="red"
            variant="light"
            onClick={() => eliminarImagen(imagen.id)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Estado: Analizando */}
      {imagen.estado === 'analizando' && (
        <Center py="xl">
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text>Analizando imagen con YOLO...</Text>
          </Stack>
        </Center>
      )}

      {/* Estado: Error */}
      {imagen.error && (
        <Alert color="red" title="Error" icon={<IconAlertCircle />}>
          {imagen.error}
        </Alert>
      )}

      {/* Estado: Completado */}
      {imagen.resultado && imagen.estado === 'completado' && (
        <Stack gap="lg">
          {/* Mensaje de resultado */}
          <Alert
            color={
              imagen.resultado.tipo_alerta === 'success'
                ? 'green'
                : imagen.resultado.tipo_alerta === 'warning'
                ? 'yellow'
                : 'red'
            }
            title="Resultado del Análisis"
            icon={
              imagen.resultado.es_valido ? (
                <IconCircleCheck />
              ) : (
                <IconAlertCircle />
              )
            }
          >
            <Text fw={600}>{imagen.resultado.mensaje}</Text>
            {imagen.resultado.detecciones.length > 0 && (
              <Text size="sm" mt="xs">
                Se detectaron {imagen.resultado.detecciones.length} región(es)
                con deficiencias
              </Text>
            )}
          </Alert>

          {/* Vista de dos columnas para resultados */}
          <Grid>
            <Grid.Col span={6}>
              {/* Imágenes */}
              <Stack gap="md">
                <div>
                  <Text size="sm" fw={600} mb="xs">
                    Imagen Original
                  </Text>
                  <Image
                    src={imagen.previewUrl}
                    alt={imagen.file.name}
                    radius="md"
                    style={{
                      maxHeight: '300px',
                      objectFit: 'contain',
                    }}
                  />
                </div>

                {imagen.resultado.imagen_procesada && (
                  <div>
                    <Text size="sm" fw={600} mb="xs">
                      Imagen Procesada
                      <Tooltip label="Imagen con bounding boxes de las deficiencias detectadas por región">
                        <IconInfoCircle
                          size={14}
                          style={{ marginLeft: '8px' }}
                        />
                      </Tooltip>
                    </Text>
                    <Image
                      src={`data:image/jpeg;base64,${imagen.resultado.imagen_procesada}`}
                      alt="Procesada"
                      radius="md"
                      style={{
                        maxHeight: '300px',
                        objectFit: 'contain',
                      }}
                    />
                    <Text size="xs" c="dimmed" mt={5}>
                      Cada región numerada muestra una deficiencia detectada
                    </Text>
                  </div>
                )}
              </Stack>
            </Grid.Col>

            <Grid.Col span={6}>
              {/* Resultados detallados */}
              <Stack gap="md">
                {imagen.resultado.detecciones.length > 0 ? (
                  <>
                    <Text size="lg" fw={600}>
                      Regiones con Deficiencias (
                      {imagen.resultado.detecciones.length})
                    </Text>
                    <SimpleGrid cols={2} spacing="md">
                      {imagen.resultado.detecciones.map((deteccion, index) => (
                        <DeteccionCard
                          key={index}
                          deteccion={deteccion}
                          index={index}
                        />
                      ))}
                    </SimpleGrid>

                    <EstadisticasPanel
                      estadisticas={imagen.resultado.estadisticas}
                    />
                    <MetadataPanel metadata={imagen.resultado.metadata} />
                  </>
                ) : (
                  <Alert color="green" title="¡Excelente!" icon={<IconShieldCheck />}>
                    <Text>No se detectaron deficiencias en esta imagen.</Text>
                    <Text size="sm" mt="xs">
                      La planta parece estar saludable.
                    </Text>
                  </Alert>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      )}

      {/* Estado: Pendiente */}
      {imagen.estado === 'pendiente' && (
        <Image
          src={imagen.previewUrl}
          alt={imagen.file.name}
          radius="md"
          style={{
            maxHeight: '200px',
            objectFit: 'contain',
          }}
        />
      )}
    </Card>
  );
};