import React, { useState, useEffect, useCallback } from 'react';
import { Container, Title, Text, Group, Tabs, Alert, Stack } from '@mantine/core';
import { IconLeaf, IconPhoto, IconEye, IconBulb } from '@tabler/icons-react';
import { useFileUpload } from '../hook/useFileUpload';
import { useImageAnalysis } from '../hook/useImageAnalysis';
import { useRecommendations } from '../hook/useRecommendations';

import { UploadTab } from './tabs/UploadTab';
import { ImagesTab } from './tabs/ImagesTab';
import { RecommendationsTab } from './tabs/RecommendationsTab';

import { construirAnalisisDTO } from '../../../types/yolo';
import { useAnalisisImagen } from '../hook/useAgriculturaMchl';
import { ST_GET_USER_ID } from '../../../utils/utils';

export function Analisis() {
  const [activeTab, setActiveTab] = useState<string | null>('upload');
  const [nombreCultivo, setNombreCultivo] = useState<string | null>(null);
  const [sector, setSector] = useState<string | null>(null);
  const [infoGuardar, setInfoGuardar] = useState<string | null>(null);

  // Custom hooks
  const {
    imagenes,
    setImagenes,
    isDragging,
    setIsDragging,
    handleFileSelect,
    eliminarImagen,
    limpiarImagenes,
  } = useFileUpload();

  const { analizarImagen, analizarTodasLasImagenes, estadisticasGlobales } =
    useImageAnalysis(imagenes, setImagenes);

  const {
    recomendacionesGlobal,
    isLoadingRecommendations,
    errorGemini,
    generarRecomendacionesConsolidadas,
    setRecomendacionesGlobal,
  } = useRecommendations(imagenes, setActiveTab);

  const {
    loading: guardandoAnalisis,
    error: errorGuardar,
    REGISTRAR,
  } = useAnalisisImagen();

  // ✅ Memoizar analizarImagen
  const analizarImagenMemoized = useCallback(
    (imagenId: string) => {
      analizarImagen(imagenId);
    },
    [analizarImagen]
  );

  // ✅ Auto-analizar imágenes pendientes
  useEffect(() => {
    const imagenesPendientes = imagenes.filter((img) => img.estado === 'pendiente');

    if (imagenesPendientes.length > 0) {
      imagenesPendientes.forEach((imagen) => {
        analizarImagenMemoized(imagen.id);
      });
    }
  }, [imagenes, analizarImagenMemoized]);

  // ✅ Si alguna imagen trae GPS en EXIF, lo usamos como "sector" (ubicación) automáticamente
  useEffect(() => {
    const sectorActual = (sector ?? '').trim();
    if (sectorActual) return;

    const conGPS = imagenes.find((img) => img.metadataArchivo?.gps);
    const gps = conGPS?.metadataArchivo?.gps;
    if (!gps) return;

    const ubicacion = `${gps.latitude.toFixed(6)}, ${gps.longitude.toFixed(6)}`;
    setSector(ubicacion);
  }, [imagenes, sector]);

  // Wrapper para agregar auto-análisis al cargar archivos
  const handleFileSelectWithAutoAnalysis = async (files: FileList | null) => {
    const nuevosIds = await handleFileSelect(files);
    if (nuevosIds && nuevosIds.length > 0) {
      setActiveTab('images');
    }
  };

  // Handlers para drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelectWithAutoAnalysis(e.dataTransfer.files);
  };

  // Guardar análisis
  const handleGuardarAnalisis = async () => {
    setInfoGuardar(null);

    const imagenesCompletadas = imagenes.filter(
      (img) => img.estado === 'completado' && img.resultado
    );

    if (imagenesCompletadas.length === 0 || !recomendacionesGlobal) return;
    if (!nombreCultivo) return;

    let guardados = 0;
    let omitidos = 0;

    for (const imagen of imagenesCompletadas) {
      if (!imagen.resultado) continue;

      // ✅ No guardar si NO se detectaron deficiencias (0 detecciones) o el resultado no es válido
      const totalDet =
        imagen.resultado.estadisticas?.total_detecciones ??
        imagen.resultado.detecciones?.length ??
        0;

      const mensaje = (imagen.resultado.mensaje ?? '').toLowerCase();
      const sinDeficiencias =
        !imagen.resultado.es_valido ||
        totalDet === 0 ||
        mensaje.includes('no se detect') ||
        mensaje.includes('sin deficien');

      if (sinDeficiencias) {
        omitidos++;
        continue;
      }

      // ✅ Ubicación por imagen:
      // - si el archivo trae GPS (EXIF) => guarda esas coordenadas
      // - si no trae GPS => usa "sector" global (puede ser null)
      const gps = imagen.metadataArchivo?.gps;
      const sectorImagen = gps
        ? `${gps.latitude.toFixed(6)}, ${gps.longitude.toFixed(6)}`
        : sector;

      const usuarioId = ST_GET_USER_ID();
      const analisisDTO = construirAnalisisDTO(
        imagen.resultado,
        imagen.file,
        imagen.base64,
        recomendacionesGlobal,
        nombreCultivo,
        sectorImagen,
        usuarioId
      );
      await REGISTRAR(analisisDTO);
      guardados++;
    }

    // Si no se guardó nada, NO limpiamos ni cambiamos de pestaña
    if (guardados === 0) {
      setInfoGuardar('No se guardó ningún análisis porque no se detectaron deficiencias.');
      return;
    }

    if (omitidos > 0) {
      setInfoGuardar(
        `Se guardaron ${guardados} análisis. Se omitieron ${omitidos} sin deficiencias detectadas.`
      );
    } else {
      setInfoGuardar('Análisis guardado correctamente.');
    }

    limpiarImagenes();
    setRecomendacionesGlobal(null);
    setActiveTab('upload');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', background: '#f5f7fa' }}>
      <Container size="xl">
        {/* Header */}
        <Group justify="center" mb="xl">
          <IconLeaf size={36} color="#667eea" />
          <div>
            <Title order={1} size="h2" style={{ margin: 0 }}>
              Detector de Deficiencias en Cacao
            </Title>
            <Text size="sm" c="dimmed">
              Análisis de deficiencias nutricionales con IA YOLO
            </Text>
          </div>
        </Group>

        {/* Tabs principales */}
        <Tabs value={activeTab} onChange={setActiveTab} radius="md">
          <Tabs.List grow style={{ flexWrap: 'wrap', gap: 8 }}>
            <Tabs.Tab value="upload" style={{ flex: '1 1 160px' }} leftSection={<IconPhoto size={16} />}>
              Cargar Imágenes
            </Tabs.Tab>

            <Tabs.Tab
              value="images"
              style={{ flex: '1 1 160px' }}
              leftSection={<IconEye size={16} />}
              disabled={imagenes.length === 0}
            >
              Imágenes ({imagenes.length})
            </Tabs.Tab>

            <Tabs.Tab
              value="recommendations"
              style={{ flex: '1 1 160px' }}
              leftSection={<IconBulb size={16} />}
              disabled={!recomendacionesGlobal}
            >
              Recomendaciones
            </Tabs.Tab>
          </Tabs.List>

          {/* Tab 1: Upload */}
          <Tabs.Panel value="upload" pt="md">
            <UploadTab
              isDragging={isDragging}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileSelect={handleFileSelectWithAutoAnalysis}
              imagenes={imagenes}
              estadisticasGlobales={estadisticasGlobales}
              analizarTodasLasImagenes={analizarTodasLasImagenes}
              setActiveTab={(tab) => setActiveTab(tab)}
            />
          </Tabs.Panel>

          {/* Tab 2: Imágenes */}
          <Tabs.Panel value="images" pt="md">
            <ImagesTab
              imagenes={imagenes}
              estadisticasGlobales={estadisticasGlobales}
              analizarImagen={analizarImagen}
              eliminarImagen={eliminarImagen}
              generarRecomendacionesConsolidadas={generarRecomendacionesConsolidadas}
              isLoadingRecommendations={isLoadingRecommendations}
            />
          </Tabs.Panel>

          {/* Tab 3: Recomendaciones */}
          <Tabs.Panel value="recommendations" pt="md">
            <RecommendationsTab
              recomendacionesGlobal={recomendacionesGlobal}
              isLoadingRecommendations={isLoadingRecommendations}
              guardandoAnalisis={guardandoAnalisis}
              handleGuardarAnalisis={handleGuardarAnalisis}
              nombreCultivo={nombreCultivo}
              setNombreCultivo={setNombreCultivo}
              sector={sector}
              setSector={setSector}
            />
          </Tabs.Panel>
        </Tabs>

        {/* Errores globales */}
        {(errorGuardar || errorGemini || infoGuardar) && (
          <Stack gap="sm" mt="md">
            {errorGuardar && (
              <Alert color="red" title="Error al guardar" radius="md">
                {errorGuardar}
              </Alert>
            )}
            {errorGemini && (
              <Alert color="orange" title="Error al generar recomendaciones" radius="md">
                {errorGemini}
              </Alert>
            )}
            {infoGuardar && (
              <Alert color="blue" title="Información" radius="md">
                {infoGuardar}
              </Alert>
            )}
          </Stack>
        )}
      </Container>
    </div>
  );
}
