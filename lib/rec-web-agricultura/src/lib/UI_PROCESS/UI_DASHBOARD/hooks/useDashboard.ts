
import { useState, useEffect, useCallback } from 'react';
import { DashboardResumenDTO, EstadisticasGeneralesDTO, CultivoResumenDTO, CultivoDetalleDTO, AlertaDTO, ProximaActividadDTO, EstadisticasDeficienciasDTO, EstadisticasTratamientosDTO } from '../dto/dto';
import { service } from '../service/dashboard.service';


interface UseDashboardState {
  resumen: DashboardResumenDTO | null;
  estadisticasGenerales: EstadisticasGeneralesDTO | null;
  cultivosActivos: CultivoResumenDTO[];
  cultivoDetalle: CultivoDetalleDTO | null;
  alertas: AlertaDTO[];
  proximasActividades: ProximaActividadDTO[];
  estadisticasDeficiencias: EstadisticasDeficienciasDTO | null;
  estadisticasTratamientos: EstadisticasTratamientosDTO | null;
  loading: boolean;
  error: string | null;
}

interface FiltrosResumen {
  fechaInicio: string;
  fechaFin: string;
  cultivoIds: number[];
  estadoCultivo: string;
  severidadMinima: string;
}

interface FiltrosEstadisticas {
  fechaInicio: string;
  fechaFin: string;
}

interface FiltrosAlertas {
  tipo: string;
  severidad: string;
  soloNoLeidas: boolean;
}

interface FiltrosActividades {
  dias?: number;
  soloPrioridadAlta: boolean;
}

export const useDashboard = () => {
  const [state, setState] = useState<UseDashboardState>({
    resumen: null,
    estadisticasGenerales: null,
    cultivosActivos: [],
    cultivoDetalle: null,
    alertas: [],
    proximasActividades: [],
    estadisticasDeficiencias: null,
    estadisticasTratamientos: null,
    loading: false,
    error: null,
  });

  // ========== Obtener Resumen del Dashboard ==========
  const obtenerResumen = useCallback(async (filtros: FiltrosResumen) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.GET_RESUMEN(
        filtros.fechaInicio,
        filtros.fechaFin,
        filtros.cultivoIds,
        filtros.estadoCultivo,
        filtros.severidadMinima
      );
      setState(prev => ({ ...prev, resumen: data, loading: false }));
      return data;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Error al obtener resumen del dashboard' 
      }));
      throw error;
    }
  }, []);

  // ========== Obtener Estadísticas Generales ==========
  const obtenerEstadisticasGenerales = useCallback(async (filtros: FiltrosEstadisticas) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.GET_ESTADISTICAS_GENERALES(
        filtros.fechaInicio,
        filtros.fechaFin
      );
      setState(prev => ({ ...prev, estadisticasGenerales: data, loading: false }));
      return data;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Error al obtener estadísticas generales' 
      }));
      throw error;
    }
  }, []);

  // ========== Obtener Cultivos Activos ==========
  const obtenerCultivosActivos = useCallback(async (cultivoIds: number[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.GET_CULTIVOS_ACTIVOS(cultivoIds);
      setState(prev => ({ ...prev, cultivosActivos: data, loading: false }));
      return data;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Error al obtener cultivos activos' 
      }));
      throw error;
    }
  }, []);

  // ========== Obtener Detalle de Cultivo ==========
  const obtenerDetalleCultivo = useCallback(async (id: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.GET_DETALLE_CULTIVO(id);
      setState(prev => ({ ...prev, cultivoDetalle: data, loading: false }));
      return data;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Error al obtener detalle del cultivo' 
      }));
      throw error;
    }
  }, []);

  // ========== Obtener Alertas ==========
  const obtenerAlertas = useCallback(async (filtros: FiltrosAlertas) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.GET_ALERTAS(
        filtros.tipo,
        filtros.severidad,
        filtros.soloNoLeidas
      );
      setState(prev => ({ ...prev, alertas: data, loading: false }));
      return data;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Error al obtener alertas' 
      }));
      throw error;
    }
  }, []);

  // ========== Obtener Próximas Actividades ==========
  const obtenerProximasActividades = useCallback(async (filtros: FiltrosActividades) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.GET_PROXIMAS_ACTIVIDADES(
        filtros.dias,
        filtros.soloPrioridadAlta
      );
      setState(prev => ({ ...prev, proximasActividades: data, loading: false }));
      return data;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Error al obtener próximas actividades' 
      }));
      throw error;
    }
  }, []);

  // ========== Obtener Estadísticas de Deficiencias ==========
  const obtenerEstadisticasDeficiencias = useCallback(async (filtros: FiltrosEstadisticas) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.GET_ESTADISTICAS_DEFICIENCIAS(
        filtros.fechaInicio,
        filtros.fechaFin
      );
      setState(prev => ({ ...prev, estadisticasDeficiencias: data, loading: false }));
      return data;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Error al obtener estadísticas de deficiencias' 
      }));
      throw error;
    }
  }, []);

  // ========== Obtener Estadísticas de Tratamientos ==========
  const obtenerEstadisticasTratamientos = useCallback(async (filtros: FiltrosEstadisticas) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await service.GET_ESTADISTICAS_TRATAMIENTOS(
        filtros.fechaInicio,
        filtros.fechaFin
      );
      setState(prev => ({ ...prev, estadisticasTratamientos: data, loading: false }));
      return data;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Error al obtener estadísticas de tratamientos' 
      }));
      throw error;
    }
  }, []);

  // ========== Limpiar Error ==========
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // ========== Reset State ==========
  const resetState = useCallback(() => {
    setState({
      resumen: null,
      estadisticasGenerales: null,
      cultivosActivos: [],
      cultivoDetalle: null,
      alertas: [],
      proximasActividades: [],
      estadisticasDeficiencias: null,
      estadisticasTratamientos: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    
    obtenerResumen,
    obtenerEstadisticasGenerales,
    obtenerCultivosActivos,
    obtenerDetalleCultivo,
    obtenerAlertas,
    obtenerProximasActividades,
    obtenerEstadisticasDeficiencias,
    obtenerEstadisticasTratamientos,
    clearError,
    resetState,
  };
};

// ========== Hook Simplificado para cargar Dashboard Completo ==========
export const useDashboardCompleto = (filtrosIniciales?: Partial<FiltrosResumen>) => {
  const dashboard = useDashboard();
  const [inicializado, setInicializado] = useState(false);

  const cargarDashboardCompleto = useCallback(async (filtros: FiltrosResumen) => {
    try {
      dashboard.resetState();
      const resumenData = await dashboard.obtenerResumen(filtros);
      setInicializado(true);
      return resumenData;
    } catch (error) {
      console.error('Error al cargar dashboard completo:', error);
      throw error;
    }
  }, [dashboard]);

  useEffect(() => {
    if (filtrosIniciales && !inicializado) {
      const filtrosCompletos: FiltrosResumen = {
        fechaInicio: filtrosIniciales.fechaInicio || new Date().toISOString(),
        fechaFin: filtrosIniciales.fechaFin || new Date().toISOString(),
        cultivoIds: filtrosIniciales.cultivoIds || [],
        estadoCultivo: filtrosIniciales.estadoCultivo || 'ACTIVO',
        severidadMinima: filtrosIniciales.severidadMinima || 'BAJA',
      };
      cargarDashboardCompleto(filtrosCompletos);
    }
  }, [filtrosIniciales, inicializado, cargarDashboardCompleto]);

  return {
    ...dashboard,
    cargarDashboardCompleto,
    inicializado,
  };
};