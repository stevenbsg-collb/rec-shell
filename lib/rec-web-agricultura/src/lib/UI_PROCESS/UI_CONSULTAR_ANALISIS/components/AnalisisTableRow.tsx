import { useMemo, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import {
  Table,
  Text,
  Badge,
  Group,
  Stack,
  ThemeIcon,
  ActionIcon,
  Button,
  Modal,
  AspectRatio,
  Tooltip,
} from '@mantine/core';
import {
  IconCalendar,
  IconEye,
  IconCheck,
  IconX,
  IconTarget,
  IconMapPin,
} from '@tabler/icons-react';
import { formatDate } from '@rec-shell/rec-web-usuario';
import { AnalisisImagenYOLO_DTO } from '../../../types/yolo';
import { formatDeficiencia, getConfianzaColor, getTipoAlertaColor } from '../../UI_CARGA_IMAGEN/utils/apiUtils';


interface AnalisisTableRowProps {
  analisis: AnalisisImagenYOLO_DTO;
  onViewDetails: (analisis: AnalisisImagenYOLO_DTO) => void;
}

export function AnalisisTableRow({ analisis, onViewDetails }: AnalisisTableRowProps) {
  const [mapaAbierto, setMapaAbierto] = useState(false);
  const isMobile = useMediaQuery('(max-width: 48em)');

  const mapEmbedUrl = useMemo(() => {
    const s = (analisis.sector ?? '').trim();
    if (!s) return null;

    const match = s.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
    if (match) {
      return `https://www.google.com/maps?q=${match[1]},${match[2]}&z=16&output=embed`;
    }
    return `https://www.google.com/maps?q=${encodeURIComponent(s)}&output=embed`;
  }, [analisis.sector]);

  return (
    <>
      <Table.Tr>
      <Table.Td>
        <Text size="sm" lineClamp={2} style={{ maxWidth: 200 }}>
          {analisis.archivo}
        </Text>
      </Table.Td>

      <Table.Td className="hide-sm">
        <Badge
          color={getTipoAlertaColor(analisis.tipo_alerta)}
          variant="filled"
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
      </Table.Td>

      <Table.Td className="hide-sm">
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconTarget size={14} />
          </ThemeIcon>
          <Text size="sm" fw={500}>
            {analisis.estadisticas.total_detecciones}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Group gap="xs">
          <Text size="sm" fw={500}>
            {analisis.nombreCultivo}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
  {(() => {
    const ubic = (analisis.sector ?? '').trim();
    if (!ubic) {
      return (
        <Badge color="gray" variant="light">
          Sin ubicación
        </Badge>
      );
    }

    const match = ubic.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
    const esGps = Boolean(match);

    return (
      <Group gap="xs" wrap="nowrap">
        <Badge color={esGps ? 'green' : 'blue'} variant="light">
          {esGps ? 'GPS' : 'Texto'}
        </Badge>

        <Tooltip label={ubic} withArrow>
          <Button
            size="xs"
            variant="light"
            leftSection={<IconMapPin size={16} />}
            onClick={() => setMapaAbierto(true)}
          >
            Ver
          </Button>
        </Tooltip>
      </Group>
    );
  })()}
</Table.Td>


      <Table.Td>
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
                  ({cantidad})
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
        <ActionIcon
          variant="light"
          color="blue"
          size="lg"
          onClick={() => onViewDetails(analisis)}
        >
          <IconEye size={18} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>

    <Modal
      opened={mapaAbierto}
      onClose={() => setMapaAbierto(false)}
      title="Ubicación en el mapa"
      size={isMobile ? "100%" : "xl"}
      fullScreen={isMobile}
      centered
    >
      {mapEmbedUrl ? (
        <AspectRatio ratio={16 / 9}>
          <iframe
            src={mapEmbedUrl}
            style={{ border: 0, width: '100%', height: '100%' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </AspectRatio>
      ) : (
        <Text c="dimmed">No hay ubicación para mostrar.</Text>
      )}
    </Modal>
  </>
);

}