import { useCallback } from 'react';
import { environment } from '@rec-shell/rec-web-shared';
import { APIResponse, ImagenAnalisis } from '../../../types/yolo';


const API_URL = environment.yolo.url;

export const useImageAnalysis = (
  imagenes: ImagenAnalisis[],
  setImagenes: React.Dispatch<React.SetStateAction<ImagenAnalisis[]>>
) => {
  
  const analizarImagen = useCallback(async (id: string) => {
    const imagen = imagenes.find(img => img.id === id);
    if (!imagen) return;

    setImagenes(prev =>
      prev.map(img =>
        img.id === id ? { ...img, estado: 'analizando' as const } : img
      )
    );

    const formData = new FormData();
    formData.append('file', imagen.file);

    try {
      const response = await fetch(`${API_URL}/predict/visual`, {
        method: 'POST',
        body: formData,
      });

      const result: APIResponse = await response.json();

      if (result.success) {
        setImagenes(prev =>
          prev.map(img =>
            img.id === id
              ? {
                  ...img,
                  resultado: result.data,
                  estado: 'completado' as const,
                }
              : img
          )
        );
      } else {
        setImagenes(prev =>
          prev.map(img =>
            img.id === id
              ? {
                  ...img,
                  estado: 'error' as const,
                  error: 'Error al procesar la imagen',
                }
              : img
          )
        );
      }
    } catch (err) {
      console.error('Error en la API:', err);
      setImagenes(prev =>
        prev.map(img =>
          img.id === id
            ? {
                ...img,
                estado: 'error' as const,
                error: 'No se pudo conectar con el servidor',
              }
            : img
        )
      );
    }
  }, [imagenes, setImagenes]);

  const analizarTodasLasImagenes = useCallback(async () => {
    const imagenesPendientes = imagenes.filter(
      img => img.estado === 'pendiente' || img.estado === 'error'
    );

    for (const imagen of imagenesPendientes) {
      await analizarImagen(imagen.id);
    }
  }, [imagenes, analizarImagen]);

  const estadisticasGlobales = imagenes.reduce(
    (acc, img) => {
      if (img.estado === 'completado') acc.completadas++;
      if (img.estado === 'analizando') acc.analizando++;
      if (img.estado === 'error') acc.error++;
      if (img.estado === 'pendiente') acc.pendientes++;
      return acc;
    },
    { completadas: 0, analizando: 0, error: 0, pendientes: 0 }
  );

  return {
    analizarImagen,
    analizarTodasLasImagenes,
    estadisticasGlobales,
  };
};