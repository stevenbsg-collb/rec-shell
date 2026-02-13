import {
  Modal,
  Stack,
  Image,
  Divider,
  Group,
  Text,
  Badge,
  SimpleGrid,
  Paper,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { formatDate } from '@rec-shell/rec-web-usuario';
import { AnalisisImagenYOLO_DTO } from '../../../types/yolo';
import { EstadisticasCards } from './EstadisticasCards';
import { DeteccionesList } from './DeteccionesList';
import { RecomendacionesSection } from './RecomendacionesSection';
import { getTipoAlertaColor } from '../../UI_CARGA_IMAGEN/utils/apiUtils';

interface AnalisisDetalleModalProps {
  opened: boolean;
  onClose: () => void;
  analisis: AnalisisImagenYOLO_DTO | null;
}

export function AnalisisDetalleModal({
  opened,
  onClose,
  analisis,
}: AnalisisDetalleModalProps) {
  if (!analisis) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={600}>Detalles del Análisis</Text>}
      size="xl"
    >
      <Stack gap="md">
        <Image
          src={analisis.imagenBase64}
          style={{ maxWidth: 200, maxHeight: 300 }}
          alt={analisis.archivo}
          fit="contain"
        />

        <Divider />

        <Group>
          <Text fw={500}>Archivo:</Text>
          <Text>{analisis.archivo}</Text>
        </Group>

        <Group>
          <Text fw={500}>Fecha:</Text>
          <Text>{formatDate(analisis.fecha)}</Text>
        </Group>

        <Group>
          <Text fw={500}>Estado:</Text>
          <Badge
            color={getTipoAlertaColor(analisis.tipo_alerta)}
            leftSection={
              analisis.es_valido ? (
                <IconCheck size={14} />
              ) : (
                <IconX size={14} />
              )
            }
          >
            {analisis.mensaje}
          </Badge>
        </Group>

        <Divider />

        <Text fw={500} size="lg">
          Estadísticas Generales
        </Text>

        <SimpleGrid cols={2}>
          <EstadisticasCards
            totalDetecciones={analisis.estadisticas.total_detecciones}
            deficienciasUnicas={analisis.estadisticas.deficiencias_unicas}
            confianzaPromedio={analisis.estadisticas.confianza_promedio}
            confianzaMaxima={analisis.estadisticas.confianza_maxima}
          />
        </SimpleGrid>

        <Divider />

        <Text fw={500} size="lg">
          Detecciones por Región
        </Text>

        <DeteccionesList detecciones={analisis.detecciones} />

        {analisis.recomendaciones &&
          Object.keys(analisis.recomendaciones).length > 0 && (
            <>
              <Divider />
              <Text fw={500} size="lg">
                Recomendaciones
              </Text>
              <RecomendacionesSection recomendaciones={analisis.recomendaciones} />
            </>
          )}

        {analisis.metadata && (
          <>
            <Divider />
            <Text fw={500} size="lg">
              Metadata del Modelo
            </Text>
            <Paper p="md" withBorder>
              <SimpleGrid cols={2}>
                <div>
                  <Text size="sm" c="dimmed">
                    Modelo
                  </Text>
                  <Text fw={500}>{analisis.metadata.modelo}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">
                    Versión
                  </Text>
                  <Text fw={500}>{analisis.metadata.version}</Text>
                </div>
              </SimpleGrid>
            </Paper>
          </>
        )}
      </Stack>
    </Modal>
  );
}