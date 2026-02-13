import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Divider,
  Card,
  Progress,
  Accordion,
  Badge,
  Loader,
  Alert,
  Modal,
  AspectRatio,
} from '@mantine/core';
import { IconDeviceFloppy, IconMapPin, IconAlertTriangle } from '@tabler/icons-react';
import { RecomendacionesGemini } from '../../../../types/yolo';

interface RecommendationsTabProps {
  recomendacionesGlobal: RecomendacionesGemini | null;
  isLoadingRecommendations: boolean;
  guardandoAnalisis: boolean;
  handleGuardarAnalisis: () => void;

  nombreCultivo: string | null;
  setNombreCultivo: (value: string | null) => void;

  /**
   * Usamos el mismo campo "sector" como "ubicación" (GPS).
   * Si la imagen trae GPS en EXIF, se llena automáticamente desde Analisis.tsx.
   * Si no, el usuario puede obtener la ubicación del dispositivo manualmente.
   */
  sector: string | null;
  setSector: (value: string | null) => void;
}

const CULTIVO_FIJO = 'Cacao - CCN-51';

export const RecommendationsTab: React.FC<RecommendationsTabProps> = ({
  recomendacionesGlobal,
  isLoadingRecommendations,
  guardandoAnalisis,
  handleGuardarAnalisis,
  nombreCultivo,
  setNombreCultivo,
  sector,
  setSector,
}) => {
  const [geoCargando, setGeoCargando] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [mapaAbierto, setMapaAbierto] = useState(false);
  const isMobile = useMediaQuery('(max-width: 48em)');

  useEffect(() => {
    if (nombreCultivo !== CULTIVO_FIJO) setNombreCultivo(CULTIVO_FIJO);
  }, [nombreCultivo, setNombreCultivo]);

  const sectorVacio = !((sector ?? '').trim());

  // URL para embeber el mapa dentro de la app (NO redirecciona)
  const mapEmbedUrl = useMemo(() => {
    const s = (sector ?? '').trim();
    if (!s) return null;

    // Esperamos formato: "lat, lon"
    const match = s.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
    if (match) {
      return `https://www.google.com/maps?q=${match[1]},${match[2]}&z=16&output=embed`;
    }

    // Si es texto (Sector B-3, A-1, etc.)
    return `https://www.google.com/maps?q=${encodeURIComponent(s)}&output=embed`;
  }, [sector]);

  // (Opcional) URL para abrir en pestaña nueva como fallback si el iframe se bloquea
  const mapsOpenUrl = useMemo(() => {
    const s = (sector ?? '').trim();
    if (!s) return null;

    const match = s.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
    if (match) return `https://www.google.com/maps?q=${match[1]},${match[2]}`;

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s)}`;
  }, [sector]);

  const obtenerUbicacionDispositivo = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeoError('Este navegador no soporta geolocalización.');
      return;
    }

    setGeoError(null);
    setGeoCargando(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setSector(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
        setGeoCargando(false);
      },
      (err) => {
        setGeoCargando(false);
        setGeoError(
          err?.message ||
            'No se pudo obtener la ubicación del dispositivo (permiso denegado o sin señal).'
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, [setSector]);

  const onGuardarClick = () => {
    // ✅ Guardado 100% manual. La ubicación es opcional (algunas imágenes traerán GPS EXIF y otras no).
    handleGuardarAnalisis();
  };

  return (
    <Paper shadow="sm" radius="lg" p={isMobile ? "md" : "xl"} style={{ background: 'white' }}>
      <Stack gap="lg">
        {isLoadingRecommendations ? (
          <Group justify="center" p="xl">
            <Loader size="lg" />
            <Text>Generando recomendaciones con IA...</Text>
          </Group>
        ) : recomendacionesGlobal ? (
          <>
            <Group justify="space-between" align="flex-start" gap="md" style={{ flexWrap: 'wrap' }}>
              <div>
                <Title order={2} size="h3">
                  <span role="img" aria-label="recomendaciones">
                    🌱
                  </span>{' '}
                  Recomendaciones IA
                </Title>
                <Text size="sm" c="dimmed">
                  Se extrae solo la ubicación. El análisis se guarda manualmente con el botón “Guardar Análisis”.
                </Text>
              </div>

              <Button
                size="lg"
                radius="md"
                onClick={onGuardarClick}
                disabled={guardandoAnalisis || !nombreCultivo}
                loading={guardandoAnalisis}
                fullWidth={isMobile}
                leftSection={<IconDeviceFloppy size={20} />}
                variant="gradient"
                gradient={{ from: '#11998e', to: '#38ef7d' }}
              >
                Guardar Análisis
              </Button>
            </Group>

            <Divider />

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Stack gap="sm">
                <Group gap="xs" align="center">
                  <Text fw={600}>Cultivo:</Text>
                  <Text>{CULTIVO_FIJO}</Text>
                  <input type="hidden" name="cultivo" value={CULTIVO_FIJO} />
                </Group>

                <Group justify="space-between" align="flex-start" gap="md" style={{ flexWrap: 'wrap' }}>
                  <div>
                    <Group gap={6} align="center">
                      <IconMapPin size={18} />
                      <Text fw={600}>Ubicación</Text>
                    </Group>

                    <Text size="sm" c={sectorVacio ? 'dimmed' : 'dark'}>
                      {sectorVacio
                        ? geoCargando
                          ? 'Obteniendo ubicación...'
                          : 'Sin GPS en la imagen. Presiona “Actualizar ubicación” para usar la ubicación del dispositivo.'
                        : sector}
                    </Text>

                    {/* mantenemos el mismo campo para el backend */}
                    <input type="hidden" name="sector" value={sector ?? ''} />
                  </div>

                  <Group gap="xs">
                    <Button
                      variant="light"
                      radius="md"
                      onClick={obtenerUbicacionDispositivo}
                      loading={geoCargando}
                     fullWidth={isMobile}>
                      Actualizar ubicación
                    </Button>

                    {mapEmbedUrl && (
                      <Button
                        variant="light"
                        radius="md"
                        leftSection={<IconMapPin size={16} />}
                        onClick={() => setMapaAbierto(true)}
                       fullWidth={isMobile}>
                        Ver en mapa
                      </Button>
                    )}
                  </Group>
                </Group>

                {geoError && (
                  <Alert
                    color="yellow"
                    icon={<IconAlertTriangle size={18} />}
                    title="Ubicación no disponible"
                    radius="md"
                  >
                    {geoError}
                  </Alert>
                )}
              </Stack>
            </Card>

            <Divider />

            {/* Confianza general */}
            <Card radius="md" padding="lg" style={{ background: '#f8f9ff' }}>
              <Text size="sm" fw={600} mb="sm">
                Confianza General del Análisis
              </Text>
              <Group align="center" gap="md">
                <Progress
                  value={recomendacionesGlobal.confianza_general}
                  size="xl"
                  radius="xl"
                  style={{ flex: 1 }}
                  styles={{
                    section: {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    },
                  }}
                />
                <Text
                  size="2rem"
                  fw={700}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {recomendacionesGlobal.confianza_general}%
                </Text>
              </Group>
            </Card>

            {/* Deficiencias */}
            <Accordion
              variant="separated"
              radius="md"
              defaultValue={recomendacionesGlobal.deficiencias[0]?.nombre}
            >
              {recomendacionesGlobal.deficiencias.map((deficiencia, idx) => (
                <Accordion.Item key={idx} value={deficiencia.nombre}>
                  <Accordion.Control>
                    <Group justify="space-between">
                      <Text size="md" fw={600}>
                        {deficiencia.nombre}
                      </Text>
                      <Badge variant="gradient" gradient={{ from: '#667eea', to: '#764ba2' }}>
                        {deficiencia.confianza.toFixed(1)}%
                      </Badge>
                    </Group>
                  </Accordion.Control>

                  <Accordion.Panel>
                    <Stack gap="md">
                      {/* Tratamiento inmediato */}
                      <div>
                        <Text size="sm" fw={600} mb="xs" c="red">
                          <span role="img" aria-label="tratamiento">
                            🚨
                          </span>{' '}
                          Tratamiento Inmediato
                        </Text>
                        <Paper p="sm" radius="md" style={{ background: '#fff5f5' }}>
                          <Stack gap={5}>
                            {deficiencia.recomendaciones.tratamiento_inmediato.map((t, i) => (
                              <Text key={i} size="sm">
                                • {t}
                              </Text>
                            ))}
                          </Stack>
                        </Paper>
                      </div>

                      {/* Fertilizantes */}
                      <div>
                        <Text size="sm" fw={600} mb="xs" c="blue">
                          <span role="img" aria-label="fertilizantes">
                            💊
                          </span>{' '}
                          Fertilizantes Recomendados
                        </Text>
                        <Paper p="sm" radius="md" style={{ background: '#f0f7ff' }}>
                          <Stack gap={5}>
                            {deficiencia.recomendaciones.fertilizantes_recomendados.map((f, i) => (
                              <Text key={i} size="sm">
                                • {f}
                              </Text>
                            ))}
                          </Stack>
                        </Paper>
                      </div>

                      {/* Preventivas */}
                      <div>
                        <Text size="sm" fw={600} mb="xs" c="green">
                          <span role="img" aria-label="medidas preventivas">
                            🛡️
                          </span>{' '}
                          Medidas Preventivas
                        </Text>
                        <Paper p="sm" radius="md" style={{ background: '#f0fff4' }}>
                          <Stack gap={5}>
                            {deficiencia.recomendaciones.medidas_preventivas.map((m, i) => (
                              <Text key={i} size="sm">
                                • {m}
                              </Text>
                            ))}
                          </Stack>
                        </Paper>
                      </div>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>

            {/* Modal del mapa (dentro de la app) */}
            <Modal
              opened={mapaAbierto}
              onClose={() => setMapaAbierto(false)}
              title="Ubicación en el mapa"
              size={isMobile ? "100%" : "xl"}
              fullScreen={isMobile}
              centered
            >
              {mapEmbedUrl ? (
                <Stack gap="sm">
                  <AspectRatio ratio={16 / 9}>
                    <iframe
                      src={mapEmbedUrl}
                      style={{ border: 0, width: '100%', height: '100%' }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </AspectRatio>

                  {mapsOpenUrl && (
                    <Button
                      variant="light"
                      component="a"
                      href={mapsOpenUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir en Google Maps
                    </Button>
                  )}
                </Stack>
              ) : (
                <Text c="dimmed">No hay ubicación para mostrar.</Text>
              )}
            </Modal>
          </>
        ) : (
          <Text ta="center" c="dimmed" py="xl">
            No hay recomendaciones generadas aún
          </Text>
        )}
      </Stack>
    </Paper>
  );
};
