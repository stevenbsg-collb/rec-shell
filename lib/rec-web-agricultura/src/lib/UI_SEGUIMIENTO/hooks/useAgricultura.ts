import { useState, useCallback } from 'react';
import { ActividadSeguimiento } from '../../types/model';
import { service } from '../services/agricultura.service';
import { EstadoActividad } from '../../enums/Enums';

export const useActividadSeguimiento = () => {
  const [actividades, setActividades] = useState<ActividadSeguimiento[]>([]);
  const [actividad, setActividad] = useState<ActividadSeguimiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CREAR = useCallback(async (actividadData: ActividadSeguimiento) => {
    try {
      setLoading(true);
      setError(null);
      const nuevaActividad = await service.POST(actividadData);
      setActividades(prev => [...prev, nuevaActividad]);
      return nuevaActividad;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear actividad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

   const ACTUALIZAR = useCallback(async (id: string, actividadData: ActividadSeguimiento) => {
    try {
      setLoading(true);
      setError(null);
      const actividadActualizada = await service.PUT(id, actividadData);
      setActividades(prev => prev.map(act => act.id === id ? actividadActualizada : act));
      setActividad(actividadActualizada);
      return actividadActualizada;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar actividad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const ELIMINAR = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await service.DELETE(id);
      setActividades(prev => prev.filter(act => act.id !== id));
      if (actividad?.id === id) {
        setActividad(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar actividad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [actividad?.id]);

  const BUSCAR_ID = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const actividadObtenida = await service.GET_ID(id);
      setActividad(actividadObtenida);
      return actividadObtenida;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener actividad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const BUSCAR = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const todasActividades = await service.GET();
      setActividades(todasActividades);
      return todasActividades;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener actividades');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerActividadesPorPlan = useCallback(async (planId: string) => {
    try {
      setLoading(true);
      setError(null);
      const actividadesPlan = await service.GET_PLAN(planId);
      setActividades(actividadesPlan);
      return actividadesPlan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener actividades del plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerActividadesPorEstado = useCallback(async (estado: EstadoActividad) => {
    try {
      setLoading(true);
      setError(null);
      const actividadesEstado = await service.GET_STATE(estado);
      setActividades(actividadesEstado);
      return actividadesEstado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener actividades por estado');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerActividadesPorFecha = useCallback(async (fecha: string) => {
    try {
      setLoading(true);
      setError(null);
      const actividadesFecha = await service.GET_DATE(fecha);
      setActividades(actividadesFecha);
      return actividadesFecha;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener actividades por fecha');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerActividadesPorUsuario = useCallback(async (usuarioId: string) => {
    try {
      setLoading(true);
      setError(null);
      const actividadesUsuario = await service.GET_ACTIVITY_BY_USER(usuarioId);
      setActividades(actividadesUsuario);
      return actividadesUsuario;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener actividades del usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerActividadesVencidas = useCallback(async (fecha?: string) => {
    try {
      setLoading(true);
      setError(null);
      const actividadesVencidas = await service.GET_VENCIDAS(fecha);
      setActividades(actividadesVencidas);
      return actividadesVencidas;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener actividades vencidas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerActividadesParaRecordatorio = useCallback(async (fecha?: string) => {
    try {
      setLoading(true);
      setError(null);
      const actividadesRecordatorio = await service.GET_RECORDATORY(fecha);
      setActividades(actividadesRecordatorio);
      return actividadesRecordatorio;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener actividades para recordatorio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const contarActividadesEjecutadas = useCallback(async (planId: string) => {
    try {
      setLoading(true);
      setError(null);
      const conteo = await service.GET_EJECUTADAS(planId);
      return conteo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al contar actividades ejecutadas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const RESET = useCallback(() => {
    setActividades([]);
    setActividad(null);
  }, []);

  return {
    actividades,
    actividad,
    loading,
    error,
    CREAR,
    BUSCAR_ID,
    BUSCAR,
    obtenerActividadesPorPlan,
    obtenerActividadesPorEstado,
    obtenerActividadesPorFecha,
    obtenerActividadesPorUsuario,
    obtenerActividadesVencidas,
    obtenerActividadesParaRecordatorio,
    contarActividadesEjecutadas,
    ACTUALIZAR,
    ELIMINAR,
    clearError,
    RESET
  };
};