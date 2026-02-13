import { useState, useEffect, useCallback } from 'react';

import { EstadoCultivo } from '../../enums/Enums';
import { Cultivo, CultivoFilters } from '../../types/model';
import { service } from '../services/agricultura.service';
import { UseCultivosState } from '../../types/dto';
import { NOTIFICATION_MESSAGES, useNotifications } from '@rec-shell/rec-web-shared';
import { useHandleError } from '../../utils/errorHandler';
import { ST_GET_USER_ID } from '../../utils/utils';

interface UseCultivosActions {
  BUSCAR: (filtros?: CultivoFilters) => Promise<void>;
  LISTAR: () => Promise<void>;
  BUSCAR_ID: (id: string) => Promise<void>;
  fetchAreaTotalActiva: () => Promise<void>;
  isExistencia: (id: string) => Promise<boolean>;
  
  CREAR: (cultivo: Cultivo) => Promise<Cultivo | null>;
  ACTUALIZAR: (id: string, cultivo: Cultivo) => Promise<Cultivo | null>;
  ELIMINAR: (id: string) => Promise<boolean>;
  actualizarEstado: (id: string, nuevoEstado: EstadoCultivo) => Promise<Cultivo | null>;
  
  clearError: () => void;
  clearCultivo: () => void;
  refetch: () => Promise<void>;
}

export const useCultivos = (filtrosIniciales?: CultivoFilters): UseCultivosState & UseCultivosActions => {
  const [state, setState] = useState<UseCultivosState>({
    cultivos: [],
    cultivo: null,
    loading: false,
    error: null,
    areaTotalActiva: null
  });

  const [currentFilters, setCurrentFilters] = useState<CultivoFilters | undefined>(filtrosIniciales);
  const notifications = useNotifications();
  const handleError = useHandleError<UseCultivosState>();
  
  
  const BUSCAR = useCallback(async (filtros?: CultivoFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const filtrosToUse = filtros || currentFilters;
      setCurrentFilters(filtrosToUse);
      
      const data = await service.GET_FILTER(filtrosToUse || {});
      setState(prev => ({ ...prev, cultivos: Array.isArray(data) ? data : []  , loading: false }));
    } catch (error: unknown) {
      handleError(error, setState);
    }
  }, [currentFilters, handleError]);

  const LISTAR = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.GET();
      setState(prev => ({ ...prev, cultivos: Array.isArray(data) ? data : []  , loading: false }));
    } catch (error: unknown) {
      handleError(error, setState);
    }
  }, [handleError]);

  const BUSCAR_ID = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.GET_BY_ID(id);
      setState(prev => ({ ...prev, cultivo: data, loading: false }));
    } catch (error: unknown) {
      handleError(error, setState);
    }
  }, [handleError]);

  const fetchAreaTotalActiva = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.GET_AREA_TOTAL_ACTIVA_BY_USER();
      setState(prev => ({ ...prev, areaTotalActiva: data, loading: false }));
    } catch (error: unknown) {
      handleError(error, setState);
    }
  }, [handleError]);

  const isExistencia = useCallback(async (id: string): Promise<boolean> => {
    try {
      return await service.IS_EXIST(id);
    } catch (error: unknown) {
      handleError(error, setState);
      return false;
    }
  }, [handleError]);

  const CREAR = useCallback(async (cultivoData: Cultivo): Promise<Cultivo | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      cultivoData.usuarioId = ST_GET_USER_ID();
      const nuevoCultivo = await service.POST(cultivoData);
      setState(prev => ({ 
        ...prev, 
        cultivos: [...prev.cultivos, nuevoCultivo],
        loading: false 
      }));
      
      notifications.success();      
      return nuevoCultivo;
    } catch (error: unknown) {
      handleError(error, setState);
      return null;
    }
  }, [handleError, notifications]);

  const ACTUALIZAR = useCallback(async (id: string, cultivoData: Cultivo): Promise<Cultivo | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      cultivoData.usuarioId = ST_GET_USER_ID();
      const cultivoActualizado = await service.PUT(id, cultivoData);
      setState(prev => ({
        ...prev,
        cultivos: prev.cultivos.map(c => c.id === id ? cultivoActualizado : c),
        cultivo: prev.cultivo?.id === id ? cultivoActualizado : prev.cultivo,
        loading: false
      }));
      
      notifications.success();
      
      return cultivoActualizado;
    } catch (error: unknown) {
      handleError(error, setState);
      return null;
    }
  }, [handleError, notifications]);

  const actualizarEstado = useCallback(async (id: string, nuevoEstado: EstadoCultivo): Promise<Cultivo | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const cultivoActualizado = await service.PUT_STATE(id, nuevoEstado);
      setState(prev => ({
        ...prev,
        cultivos: prev.cultivos.map(c => c.id === id ? cultivoActualizado : c),
        cultivo: prev.cultivo?.id === id ? cultivoActualizado : prev.cultivo,
        loading: false
      }));
      
      notifications.success(NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title, `Estado del cultivo cambiado a ${nuevoEstado}`);
      
      return cultivoActualizado;
    } catch (error: unknown) {
      handleError(error, setState);
      return null;
    }
  }, [handleError, notifications]);

 const ELIMINAR = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await service.DELETE(id);
      setState(prev => ({
        ...prev,
        cultivos: prev.cultivos.filter(c => c.id !== id),
        cultivo: prev.cultivo?.id === id ? null : prev.cultivo,
        loading: false
      }));
      
      notifications.success(NOTIFICATION_MESSAGES.GENERAL.SUCCESS.title, NOTIFICATION_MESSAGES.GENERAL.DELETE.message);
      
      return true;
    } catch (error: unknown) {
      handleError(error, setState);
      return false;
    }
  }, [handleError, notifications]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearCultivo = useCallback(() => {
    setState(prev => ({ ...prev, cultivo: null }));
  }, []);

  const refetch = useCallback(async () => {
    await BUSCAR(currentFilters);
  }, [BUSCAR, currentFilters]);

  useEffect(() => {
    if (filtrosIniciales) {
      BUSCAR(filtrosIniciales);
    }
  }, []);

  return {
    ...state,
    LISTAR,
    BUSCAR,
    BUSCAR_ID,
    fetchAreaTotalActiva,
    isExistencia,
    CREAR,
    ACTUALIZAR,
    actualizarEstado,
    ELIMINAR,
    clearError,
    clearCultivo,
    refetch
  };
};