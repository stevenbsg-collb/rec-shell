import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Paper,
  Stack,
  Group,
  Text,
  Button,
  Badge,
  Card,
  Image,
  Alert,
  Divider,
  Table,
  ScrollArea,
} from '@mantine/core';
import {
  IconPlayerPlay,
  IconPlayerStop,
  IconAlertTriangle,
  IconCamera,
  IconBulb,
  IconDeviceFloppy,
  IconEye,
} from '@tabler/icons-react';
import { environment } from '@rec-shell/rec-web-shared';
import { ImagenAnalisis, ResultDataYOLO, Deteccion } from '../../../../types/yolo';
import { LiveDetectionModal } from './LiveDetectionModal';

type LiveResponse = {
  success: boolean;
  data?: ResultDataYOLO;
  error?: string;
  timestamp?: string;
};

interface LiveTabProps {
  onAddImagen: (img: ImagenAnalisis) => void;
  goToImages: () => void;
  goToRecommendations: () => void;
  generarRecomendacionesConsolidadas: () => void;
  hasRecommendations: boolean;
}

const API_HTTP = environment.yolo.url; // ej: http://localhost:8000
const WS_URL = API_HTTP.replace(/^http/i, 'ws') + '/realtime';

const MIN_CONF = 90; // Solo mostrar/capturar >=90%
const EMPTY_RESET_FRAMES = 4;

export const LiveTab: React.FC<LiveTabProps> = ({
  onAddImagen,
  goToImages,
  goToRecommendations,
  generarRecomendacionesConsolidadas,
  hasRecommendations,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  const lastRawFrameRef = useRef<string | null>(null);

  // “Evento” de detección: captura 1 sola vez por aparición
  const eventActiveRef = useRef(false);
  const emptyStreakRef = useRef(0);

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [processedImg, setProcessedImg] = useState<string | null>(null);
  const [detecciones, setDetecciones] = useState<Deteccion[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // acciones después de capturar
  const [ultimaCapturaOk, setUltimaCapturaOk] = useState(false);

  // modal popup
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    detecciones: Deteccion[];
    estadisticas: ResultDataYOLO['estadisticas'];
    metadata: ResultDataYOLO['metadata'];
  } | null>(null);

  const detecciones90 = useMemo(
    () => (detecciones || []).filter((d) => (d.confianza ?? 0) >= MIN_CONF),
    [detecciones]
  );

  const resetEventState = () => {
    eventActiveRef.current = false;
    emptyStreakRef.current = 0;
  };

  const stopAll = () => {
    setIsRunning(false);

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setMensaje(null);
    setDetecciones([]);
    setProcessedImg(null);
    resetEventState();
  };

  const dataUrlToFile = async (dataUrl: string, filename: string) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  };

  const buildImagenAnalisisFromLive = async (
    rawDataUrl: string,
    result: ResultDataYOLO,
    fileNameBase: string
  ): Promise<ImagenAnalisis> => {
    const file = await dataUrlToFile(rawDataUrl, `${fileNameBase}.jpg`);
    const previewUrl = URL.createObjectURL(file);

    return {
      id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      file,
      previewUrl,
      base64: rawDataUrl, // igual que useFileUpload (DataURL)
      resultado: result,
      estado: 'completado',
    };
  };

  // ✅ Captura automática 1 vez por evento
  const handleEventCapture = async (data: ResultDataYOLO) => {
    const dets = data?.detecciones ?? [];
    const dets90_local = dets.filter((d) => (d.confianza ?? 0) >= MIN_CONF);

    if (dets90_local.length > 0) {
      emptyStreakRef.current = 0;

      // primera vez del evento => capturar
      if (!eventActiveRef.current) {
        eventActiveRef.current = true;

        const raw = lastRawFrameRef.current;
        const fileBase = `captura_live_${new Date().toISOString().replace(/[:.]/g, '-')}`;

        // usar frame raw, si no existe, usar processedImg como fallback
        const rawToUse = raw ?? '';

        if (!rawToUse) {
          setError('No se pudo capturar el frame (raw).');
          return;
        }

        const safeResult: ResultDataYOLO = {
          ...data,
          detecciones: dets90_local,
          estadisticas: data.estadisticas ?? {
            total_detecciones: dets90_local.length,
            deficiencias_unicas: new Set(dets90_local.map((d) => d.deficiencia)).size,
            confianza_promedio:
              dets90_local.reduce((s, d) => s + d.confianza, 0) / dets90_local.length,
            confianza_maxima: Math.max(...dets90_local.map((d) => d.confianza)),
            por_tipo: dets90_local.reduce<Record<string, number>>((acc, d) => {
              acc[d.deficiencia] = (acc[d.deficiencia] || 0) + 1;
              return acc;
            }, {}),
          },
          metadata: data.metadata ?? {
            dimensiones_imagen: { ancho: 0, alto: 0 },
            umbral_confianza: 0.9,
            umbral_iou: 0.6,
          },
        };

        const imgAnalisis = await buildImagenAnalisisFromLive(rawToUse, safeResult, fileBase);

        // ✅ esto hace que salga como “Imagen Analizada” normal
        onAddImagen(imgAnalisis);

        // ✅ popup tipo tu captura
        setModalData({
          detecciones: dets90_local,
          estadisticas: safeResult.estadisticas,
          metadata: safeResult.metadata,
        });
        setModalOpen(true);

        setUltimaCapturaOk(true);
      }
      return;
    }

    // si no hay detecciones >=90, reset por frames vacíos
    emptyStreakRef.current += 1;
    if (emptyStreakRef.current >= EMPTY_RESET_FRAMES) {
      eventActiveRef.current = false;
    }
  };

  const start = async () => {
    try {
      setError(null);
      setMensaje(null);
      setDetecciones([]);
      setProcessedImg(null);
      resetEventState();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      streamRef.current = stream;
      if (!videoRef.current) throw new Error('No se encontró el elemento video');

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => setIsRunning(true);

      ws.onerror = () => {
        setError('Error conectando al WebSocket. Verifica FastAPI /realtime.');
        stopAll();
      };

      ws.onclose = () => setIsRunning(false);

      ws.onmessage = async (event) => {
        try {
          const res: LiveResponse = JSON.parse(event.data);

          if (!res.success || !res.data) {
            setError(res.error ?? 'Respuesta inválida del servidor');
            return;
          }

          const data = res.data;

          setMensaje(data.mensaje ?? null);
          setDetecciones(data.detecciones ?? []);

          if (data.imagen_procesada) {
            setProcessedImg(`data:image/jpeg;base64,${data.imagen_procesada}`);
          }

          await handleEventCapture(data);
        } catch (e) {
          console.error(e);
        }
      };

      // enviar frames cada 300ms
      intervalRef.current = window.setInterval(() => {
        const v = videoRef.current;
        const c = canvasRef.current;
        const w = wsRef.current;

        if (!v || !c || !w) return;
        if (w.readyState !== WebSocket.OPEN) return;

        const ctx = c.getContext('2d');
        if (!ctx) return;

        const vw = v.videoWidth || 640;
        const vh = v.videoHeight || 480;

        c.width = vw;
        c.height = vh;

        ctx.drawImage(v, 0, 0, vw, vh);

        const dataUrl = c.toDataURL('image/jpeg', 0.85);
        lastRawFrameRef.current = dataUrl;

        const base64 = dataUrl.split(',')[1];
        w.send(base64);
      }, 300);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo iniciar la cámara');
      stopAll();
    }
  };

  useEffect(() => {
    return () => stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper shadow="sm" radius="lg" p="md" style={{ background: 'white' }}>
      <Stack gap="md">
        {error && (
          <Alert color="red" title="Error" radius="md" icon={<IconAlertTriangle size={16} />}>
            {error}
          </Alert>
        )}

        {ultimaCapturaOk && (
          <Alert color="teal" title="✅ Captura agregada a Imágenes Analizadas" radius="md">
            <Group justify="space-between" align="center">
              <Text size="sm" c="dimmed">
                Ya puedes generar recomendaciones y luego guardar en la BD como siempre.
              </Text>
              <Group gap="sm">
                <Button size="xs" leftSection={<IconEye size={14} />} onClick={goToImages}>
                  Ver en Imágenes
                </Button>

                <Button
                  size="xs"
                  variant="gradient"
                  gradient={{ from: '#f093fb', to: '#f5576c' }}
                  leftSection={<IconBulb size={14} />}
                  onClick={generarRecomendacionesConsolidadas}
                >
                  Generar Recomendaciones
                </Button>

                <Button
                  size="xs"
                  color="green"
                  leftSection={<IconDeviceFloppy size={14} />}
                  onClick={goToRecommendations}
                  disabled={!hasRecommendations}
                >
                  Ir a Guardar (BD)
                </Button>
              </Group>
            </Group>
          </Alert>
        )}

        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconCamera size={18} />
            <Text fw={700}>📡 Detección en vivo (YOLO)</Text>
          </Group>

          <Group gap="sm">
            <Badge variant="light">WS: {WS_URL}</Badge>
            <Badge variant="filled" color={isRunning ? 'green' : 'gray'}>
              {isRunning ? 'ACTIVO' : 'DETENIDO'}
            </Badge>
            <Badge color="blue" variant="light">
              Filtro: ≥ {MIN_CONF}%
            </Badge>
          </Group>
        </Group>

        <Group gap="sm">
          <Button leftSection={<IconPlayerPlay size={16} />} onClick={start} disabled={isRunning}>
            Iniciar
          </Button>

          <Button
            color="red"
            variant="outline"
            leftSection={<IconPlayerStop size={16} />}
            onClick={stopAll}
            disabled={!isRunning}
          >
            Detener
          </Button>
        </Group>

        {mensaje && (
          <Text size="sm" c="dimmed">
            {mensaje}
          </Text>
        )}

        <Divider />

        <Group align="flex-start" grow>
          <Card withBorder radius="md" padding="sm">
            <Text fw={600} mb="xs">
              Cámara
            </Text>
            <video
              ref={videoRef}
              style={{ width: '100%', borderRadius: 10, background: '#000' }}
              playsInline
              muted
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </Card>

          <Card withBorder radius="md" padding="sm">
            <Text fw={600} mb="xs">
              Resultado (boxes)
            </Text>
            {processedImg ? (
              <Image src={processedImg} radius="md" />
            ) : (
              <Text size="sm" c="dimmed">
                Inicia para ver el resultado procesado…
              </Text>
            )}
          </Card>
        </Group>

        <Card withBorder radius="md" padding="md">
          <Group justify="space-between" align="center" mb="sm">
            <Text fw={700}>📊 Detecciones actuales ≥ {MIN_CONF}%</Text>
            <Badge variant="filled" color={detecciones90.length > 0 ? 'green' : 'gray'}>
              {detecciones90.length} detección(es)
            </Badge>
          </Group>

          {detecciones90.length === 0 ? (
            <Text size="sm" c="dimmed">
              No hay detecciones por encima del umbral.
            </Text>
          ) : (
            <ScrollArea type="auto" offsetScrollbars>
            <Table striped highlightOnHover withTableBorder withColumnBorders style={{ minWidth: 720 }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Deficiencia</Table.Th>
                  <Table.Th>Confianza</Table.Th>
                  <Table.Th>BBox</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {detecciones90.map((d, idx) => (
                  <Table.Tr key={`${d.deficiencia}-${idx}`}>
                    <Table.Td>{d.deficiencia}</Table.Td>
                    <Table.Td>
                      <Badge color="green" variant="light">
                        {d.confianza.toFixed(2)}%
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs">
                        x1:{d.bbox.x1} y1:{d.bbox.y1} x2:{d.bbox.x2} y2:{d.bbox.y2}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
          )}
        </Card>

        {/* ✅ POPUP cuando detecta */}
        <LiveDetectionModal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          detecciones={modalData?.detecciones ?? []}
          estadisticas={modalData?.estadisticas}
          metadata={modalData?.metadata}
        />
      </Stack>
    </Paper>
  );
};
