import React from 'react';
import { Modal, Group, Text, Badge, Card, Stack, Divider } from '@mantine/core';

type Deteccion = {
  deficiencia: string;
  confianza: number;
  bbox: { x1: number; y1: number; x2: number; y2: number; ancho?: number; alto?: number };
  area?: number;
};

type Props = {
  opened: boolean;
  onClose: () => void;
  detecciones: Deteccion[];
  metadata?: any;
  estadisticas?: any;
};

const fmt = (n: number) => (Number.isFinite(n) ? n : 0);

export function LiveDetectionModal({
  opened,
  onClose,
  detecciones,
  metadata,
  estadisticas,
}: Props) {
  const total = estadisticas?.total_detecciones ?? detecciones.length;
  const unicas = estadisticas?.deficiencias_unicas ?? new Set(detecciones.map(d => d.deficiencia)).size;
  const prom = fmt(estadisticas?.confianza_promedio ?? 0);
  const max = fmt(estadisticas?.confianza_maxima ?? 0);
  const porTipo = estadisticas?.por_tipo ?? {};

  const anchoImg = metadata?.dimensiones_imagen?.ancho ?? 0;
  const altoImg = metadata?.dimensiones_imagen?.alto ?? 0;
  const umbral = metadata?.umbral_confianza ?? 0.9;
  const iou = metadata?.umbral_iou ?? 0.6;

  return (
    <Modal opened={opened} onClose={onClose} title="✅ Detección en vivo" size="xl" centered>
      <Stack gap="md">
        {/* Tarjetas por detección */}
        {detecciones.map((d, idx) => {
          const area = d.area ?? ((d.bbox.x2 - d.bbox.x1) * (d.bbox.y2 - d.bbox.y1));
          return (
            <Card key={idx} withBorder radius="md" padding="md">
              <Group justify="space-between" align="center" mb="xs">
                <Badge color="red" variant="filled">
                  REGIÓN {area.toLocaleString()}
                </Badge>
                <Badge color="blue" variant="light">
                  {d.deficiencia}
                </Badge>
              </Group>

              <Text fw={700} mb="xs">
                Confianza: <Text span c="red">{d.confianza.toFixed(2)}%</Text>
              </Text>

              <Divider my="sm" />

              <Text fw={600} mb="xs">Ubicación en la imagen:</Text>

              <Group grow align="stretch">
                <Card withBorder radius="md" padding="sm">
                  <Text size="xs" c="dimmed">Esquina superior</Text>
                  <Text size="sm">X: {d.bbox.x1}, Y: {d.bbox.y1}</Text>
                </Card>

                <Card withBorder radius="md" padding="sm">
                  <Text size="xs" c="dimmed">Esquina inferior</Text>
                  <Text size="sm">X: {d.bbox.x2}, Y: {d.bbox.y2}</Text>
                </Card>
              </Group>

              <Group grow mt="sm">
                <Card withBorder radius="md" padding="sm">
                  <Text size="xs" c="dimmed">Ancho</Text>
                  <Text size="sm">{(d.bbox.ancho ?? (d.bbox.x2 - d.bbox.x1))} px</Text>
                </Card>

                <Card withBorder radius="md" padding="sm">
                  <Text size="xs" c="dimmed">Alto</Text>
                  <Text size="sm">{(d.bbox.alto ?? (d.bbox.y2 - d.bbox.y1))} px</Text>
                </Card>
              </Group>

              <Card withBorder radius="md" padding="sm" mt="sm" style={{ background: '#E8F7FF' }}>
                <Text size="xs" c="dimmed">Área total detectada:</Text>
                <Text fw={700}>{area.toLocaleString()} px²</Text>
              </Card>
            </Card>
          );
        })}

        {/* Estadísticas */}
        <Card withBorder radius="md" padding="md">
          <Text fw={700} mb="sm">📊 Estadísticas del Análisis</Text>

          <Group grow>
            <Card withBorder radius="md" padding="sm">
              <Text size="xs" c="dimmed">Total Detecciones</Text>
              <Text fw={800} size="xl">{total}</Text>
            </Card>
            <Card withBorder radius="md" padding="sm">
              <Text size="xs" c="dimmed">Deficiencias Únicas</Text>
              <Text fw={800} size="xl">{unicas}</Text>
            </Card>
          </Group>

          <Group grow mt="sm">
            <Card withBorder radius="md" padding="sm">
              <Text size="xs" c="dimmed">Confianza Promedio</Text>
              <Text fw={800} size="xl" c="orange">
                {prom.toFixed(1)}%
              </Text>
            </Card>
            <Card withBorder radius="md" padding="sm">
              <Text size="xs" c="dimmed">Confianza Máxima</Text>
              <Text fw={800} size="xl" c="red">
                {max.toFixed(1)}%
              </Text>
            </Card>
          </Group>

          <Divider my="sm" />
          <Text fw={600} mb="xs">Distribución por Tipo:</Text>
          <Group gap="xs">
            {Object.keys(porTipo).length === 0 ? (
              <Text size="sm" c="dimmed">Sin datos</Text>
            ) : (
              Object.entries(porTipo).map(([k, v]) => (
                <Badge key={k} variant="light" color="blue">
                  {k}: {String(v)}
                </Badge>
              ))
            )}
          </Group>
        </Card>

        {/* Info técnica */}
        <Card withBorder radius="md" padding="md">
          <Text fw={700} mb="sm">ℹ️ Información Técnica</Text>
          <Group grow>
            <Card withBorder radius="md" padding="sm">
              <Text size="xs" c="dimmed">Dimensiones Imagen</Text>
              <Text fw={700}>{anchoImg} × {altoImg}px</Text>
            </Card>
            <Card withBorder radius="md" padding="sm">
              <Text size="xs" c="dimmed">Umbral Confianza</Text>
              <Text fw={700}>{(umbral * 100).toFixed(0)}%</Text>
            </Card>
          </Group>
          <Group grow mt="sm">
            <Card withBorder radius="md" padding="sm">
              <Text size="xs" c="dimmed">Umbral IoU</Text>
              <Text fw={700}>{iou}</Text>
            </Card>
            <Card withBorder radius="md" padding="sm">
              <Text size="xs" c="dimmed">Proporción</Text>
              <Text fw={700}>
                {altoImg > 0 ? (anchoImg / altoImg).toFixed(2) : '0.00'}:1
              </Text>
            </Card>
          </Group>
        </Card>
      </Stack>
    </Modal>
  );
}
