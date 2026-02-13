import { useState, useCallback } from 'react';
import { useGemini, useNotifications } from '@rec-shell/rec-web-shared';
import { handleModelResponse } from '../utils/apiUtils';
import { ImagenAnalisis, RecomendacionesGemini, ResultDataYOLO } from '../../../types/yolo';
import { generarFallbackDesdeImagenes, generarPromptRecomendacionesYOLO } from '../../../utils/promp';

export const useRecommendations = (
  imagenes: ImagenAnalisis[],
  onTabChange?: (tab: string) => void
) => {
  const [recomendacionesGlobal, setRecomendacionesGlobal] = 
    useState<RecomendacionesGemini | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const notifications = useNotifications();

  const {
    loading: loadingGemini,
    error: errorGemini,
    generateText,
  } = useGemini({
    onSuccess: (text: string) =>
      handleModelResponse<RecomendacionesGemini>({
        text,
        onParsed: (data) => {
          console.log('DATA:', data);
          setRecomendacionesGlobal(data);
          setIsLoadingRecommendations(false);
        },
        onError: (err) => {
          console.error('Error al parsear recomendaciones:', err);
          const fallback = generarFallbackDesdeImagenes(imagenes);
          setRecomendacionesGlobal(fallback);
          setIsLoadingRecommendations(false);
        },
      }),
    onError: (err: string) => {
      console.error('Error de Gemini:', err);
      const fallback = generarFallbackDesdeImagenes(imagenes);
      setRecomendacionesGlobal(fallback);
      setIsLoadingRecommendations(false);
    },
  });

  const generarRecomendacionesConsolidadas = useCallback(async () => {
    const imagenesCompletadas = imagenes.filter(
      img =>
        img.estado === 'completado' &&
        (img.resultado?.detecciones?.length ?? 0) > 0
    );

    if (imagenesCompletadas.length === 0) {
      notifications.error(
        'Sin detecciones',
        'No hay imágenes con deficiencias detectadas'
      );
      return;
    }

    setIsLoadingRecommendations(true);
    onTabChange?.('recommendations'); // Cambiar a tab de recomendaciones

    const todasLasDetecciones = imagenesCompletadas.flatMap(
      img => img.resultado!.detecciones
    );

    const estadisticasConsolidadas = {
      total_detecciones: todasLasDetecciones.length,
      deficiencias_unicas: new Set(
        todasLasDetecciones.map(d => d.deficiencia)
      ).size,
      confianza_promedio:
        todasLasDetecciones.reduce((sum, det) => sum + det.confianza, 0) /
        todasLasDetecciones.length,
      confianza_maxima: Math.max(
        ...todasLasDetecciones.map(d => d.confianza)
      ),
      por_tipo: todasLasDetecciones.reduce<Record<string, number>>(
        (acc, det) => {
          acc[det.deficiencia] = (acc[det.deficiencia] || 0) + 1;
          return acc;
        },
        {}
      ),
    };

    const resultadoConsolidado: ResultDataYOLO = {
      detecciones: todasLasDetecciones,
      estadisticas: estadisticasConsolidadas,
      metadata: {
        dimensiones_imagen: {
          ancho: Math.max(
            ...imagenesCompletadas.map(
              img => img.resultado!.metadata.dimensiones_imagen.ancho
            )
          ),
          alto: Math.max(
            ...imagenesCompletadas.map(
              img => img.resultado!.metadata.dimensiones_imagen.alto
            )
          ),
        },
        umbral_confianza: Math.min(
          ...imagenesCompletadas.map(
            img => img.resultado!.metadata.umbral_confianza
          )
        ),
        umbral_iou: Math.max(
          ...imagenesCompletadas.map(
            img => img.resultado!.metadata.umbral_iou
          )
        ),
      },
      es_valido: true,
      mensaje: `Se analizaron ${imagenesCompletadas.length} imágenes`,
      tipo_alerta: 'warning',
      recomendaciones: [],
    };

    try {
      const prompt = generarPromptRecomendacionesYOLO(resultadoConsolidado);
      await generateText(prompt);
    } catch (error) {
      console.error('Error al generar recomendaciones:', error);
      const fallback = generarFallbackDesdeImagenes(imagenes);
      setRecomendacionesGlobal(fallback);
      setIsLoadingRecommendations(false);
    }
  }, [imagenes, notifications, generateText]);

  return {
    recomendacionesGlobal,
    isLoadingRecommendations,
    loadingGemini,
    errorGemini,
    generarRecomendacionesConsolidadas,
    setRecomendacionesGlobal,
  };
};