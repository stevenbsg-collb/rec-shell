import { useState } from 'react';
import { AnalisisImagenDTO, GuardarAnalisisParams, ResultadoDetalle } from '../../../types/dto';
import { service } from '../service/agricultura1.service';
import { AnalisisImagen } from '../../../types/model';
import { NOTIFICATION_MESSAGES, useNotifications } from '@rec-shell/rec-web-shared';
import { GET_ERROR } from '../../../utils/utils';

export function useGuardarAnalisis() {
  
  const [loading, setLoading] = useState(false);
  const [analisis, setAnalisis] = useState<AnalisisImagen | null>(null);
  const [resultados, setResultados] = useState<ResultadoDetalle>();
  const [listaAnalisis, setListaAnalisis] = useState<AnalisisImagen[]>([]);
  const notifications = useNotifications();


  const mapearSeveridad = (
    probabilidad: number,
    estadoGeneral: string
  ): string => {
    if (estadoGeneral.toLowerCase().includes('sana')) {
      return 'LEVE';
    }

    if (probabilidad >= 0.8) {
      return 'SEVERA';
    } else if (probabilidad >= 0.5) {
      return 'MODERADA';
    } else {
      return 'LEVE';
    }
  };

  const guardarAnalisis = async (
    params: GuardarAnalisisParams
  ): Promise<boolean> => {
    setLoading(true);

    try {
      const analisisImagenDTO: AnalisisImagenDTO = {
        cultivoId: params.cultivoId,
        usuarioId: params.usuarioId,
        deficiencia_Id: params.deficiencia_Id,
        severidad: params.severidad,
        nombreImagen: params.nombreImagen,
        rutaImagenOriginal: params.rutaImagenOriginal,
        rutaImagenProcesada: params.rutaImagenProcesada,
        fechaAnalisis: new Date().toISOString(),
        estadoProcesamiento: 'COMPLETADO',
        tiempoProcesamintoSegundos: params.tiempoProcesamiento,
        metadatosImagen: params.metadatosImagen,
        ubicacionEspecifica: params.ubicacionEspecifica,
        condicionesClima: params.condicionesClima,
        notasUsuario: params.notasUsuario,

        confianzaPrediccion: params.confianzaPrediccion,
        diagnosticoPrincipal: params.diagnosticoPrincipal,
        observacionesIa: params.observacionesIa,
        areasAfectadas: params.areasAfectadas,
      };

      await service.POST(analisisImagenDTO);

      notifications.success(); 

      return true;
    } catch (error : unknown) {
      console.error('Error al guardar análisis:', error);
      notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title, GET_ERROR(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const obtenerAnalisis = async (id: string): Promise<void> => {
    setLoading(true);

    try {
      const analisisObtenido = await service.GET_ID(id);
      setAnalisis(analisisObtenido);
    } catch (error) {
      console.error('Error al obtener análisis:', error);
      notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title, GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  };

  const obtenerTodosAnalisis = async (): Promise<void> => {
    setLoading(true);

    try {
      const analisisObtenidos = await service.GET();
      setListaAnalisis(analisisObtenidos);
    } catch (error) {
      console.error('Error al obtener análisis:', error);
      notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title, GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  };

  const obtenerResultados = async (analisisId: number): Promise<ResultadoDetalle> => {
    setLoading(true);

    try {
      const resultadosObtenidos = await service.GET_RESULTADOS(analisisId);
      setResultados(resultadosObtenidos);
      return resultadosObtenidos;
    } catch (error) {
      console.error('Error al obtener resultados:', error);
      notifications.error(NOTIFICATION_MESSAGES.GENERAL.ERROR.title, GET_ERROR(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    analisis,
    resultados,
    listaAnalisis,

    guardarAnalisis,
    obtenerAnalisis,
    obtenerTodosAnalisis,
    obtenerResultados,
    mapearSeveridad,
  };
}
