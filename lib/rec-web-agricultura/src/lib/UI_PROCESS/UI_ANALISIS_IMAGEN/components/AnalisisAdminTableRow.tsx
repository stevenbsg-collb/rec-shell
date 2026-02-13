import {
  Table,
  Text,
  Badge,
  Group,
  Stack,
  ThemeIcon,
  Button,
  Tooltip,
  Modal,
} from '@mantine/core';
import {
  IconCalendar,
  IconFileText,
  IconCheck,
  IconX,
  IconTarget,
  IconMapPin,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { formatDate } from '@rec-shell/rec-web-usuario';
import { AnalisisImagenYOLO_DTO } from '../../../types/yolo';
import {
  formatDeficiencia,
  getConfianzaColor,
  getTipoAlertaColor,
} from '../../UI_CARGA_IMAGEN/utils/apiUtils';

interface AnalisisAdminTableRowProps {
  analisis: AnalisisImagenYOLO_DTO;
  onGenerarPlan: (analisis: AnalisisImagenYOLO_DTO) => void;
  isProcessing: boolean;
  generatingAnalisisId: number | null;
}

export function AnalisisAdminTableRow({
  analisis,
  onGenerarPlan,
  isProcessing,
  generatingAnalisisId,
}: AnalisisAdminTableRowProps) {
  const analisisId = analisis.id ?? null;
  const isThisRowLoading = isProcessing && generatingAnalisisId === analisisId;
  const isOtherRowProcessing = isProcessing && generatingAnalisisId !== analisisId;

  // Ubicación (GPS o texto) guardada en "sector".
  const mapsQuery = (analisis.sector ?? '').trim();
  const hasLocation = mapsQuery.length > 0;
  const mapsEmbedUrl = hasLocation
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`
    : null;
  const mapsExternalUrl = hasLocation
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`
    : null;

  const [mapOpened, setMapOpened] = useState(false);
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <Table.Tr>
      <Table.Td>
        <Text size="sm" lineClamp={2} style={{ maxWidth: 200 }}>
          {analisis.archivo}
        </Text>
      </Table.Td>

      {/* Ubicación: botón "Ver" que abre un mapa dentro de la app */}
      <Table.Td>
        {hasLocation ? (
          <>
            <Tooltip label={mapsQuery} withinPortal>
              <Button
                size="xs"
                variant="light"
                leftSection={<IconMapPin size={16} />}
                onClick={() => setMapOpened(true)}
              >
                Ver
              </Button>
            </Tooltip>

            <Modal
              opened={mapOpened}
              onClose={() => setMapOpened(false)}
              title="Ubicación"
              size={isMobile ? "100%" : "lg"}
              fullScreen={isMobile}
              centered
            >
              <iframe
                title={`Mapa - ${mapsQuery}`}
                src={mapsEmbedUrl!}
                style={{ width: '100%', height: isMobile ? '70vh' : 360, border: 0, borderRadius: 8 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {mapsExternalUrl ? (
                <Group justify="flex-end" mt="md">
                  <Button
                    component="a"
                    href={mapsExternalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="light"
                  >
                    Abrir en Google Maps
                  </Button>
                </Group>
              ) : null}
            </Modal>
          </>
        ) : (
          <Text size="sm" c="dimmed">
            —
          </Text>
        )}
      </Table.Td>

      <Table.Td>
        <Badge
          color={getTipoAlertaColor(analisis.tipo_alerta)}
          variant="filled"
          size="sm"
          leftSection={
            analisis.es_valido ? <IconCheck size={14} /> : <IconX size={14} />
          }
        >
          {analisis.es_valido ? 'Válido' : 'Inválido'}
        </Badge>
      </Table.Td>

      <Table.Td className="hide-sm">
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconTarget size={14} />
          </ThemeIcon>
          <Text size="sm" fw={500}>
            {analisis.estadisticas.total_detecciones}
          </Text>
          <Text size="xs" c="dimmed">
            ({analisis.estadisticas.deficiencias_unicas} únicas)
          </Text>
        </Group>
      </Table.Td>

      <Table.Td className="hide-sm">
        <Badge
          color={getConfianzaColor(analisis.estadisticas.confianza_promedio)}
          variant="light"
          size="lg"
        >
          {analisis.estadisticas.confianza_promedio.toFixed(1)}%
        </Badge>
      </Table.Td>

      <Table.Td className="hide-sm">
        <Stack gap={4}>
          {Object.entries(analisis.estadisticas.por_tipo).map(
            ([deficiencia, cantidad]) => (
              <Group key={deficiencia} gap="xs">
                <Badge size="sm" variant="dot" color="teal">
                  {formatDeficiencia(deficiencia)}
                </Badge>
                <Text size="xs" c="dimmed">
                  ({cantidad}x)
                </Text>
              </Group>
            )
          )}
        </Stack>
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="gray">
            <IconCalendar size={14} />
          </ThemeIcon>
          <Text size="xs">{formatDate(analisis.fecha)}</Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <Tooltip label="Generar plan de tratamiento con IA" withinPortal>
            <Button
              size="xs"
              variant="light"
              color="green"
              leftSection={<IconFileText size={16} />}
              onClick={() => onGenerarPlan(analisis)}
              loading={isThisRowLoading}
              disabled={
                isThisRowLoading || isOtherRowProcessing || !analisis.es_valido
              }
            >
              Plan
            </Button>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}
