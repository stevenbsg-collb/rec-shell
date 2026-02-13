import { useState, useEffect, useCallback } from 'react';
import { ParametroMonitoreo } from '../../types/model';
import { service } from '../services/agricultura.service';
import { GET_ERROR } from '../../utils/utils';

export const useParametrosMonitoreo = () => {
  const [parametros, setParametros] = useState<ParametroMonitoreo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BUSCAR = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.GET();
      setParametros(data);
      console.log('Parametros:', data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    BUSCAR();
  }, [BUSCAR]);

  return {
    parametros,
    loading,
    error,
    refetch: BUSCAR
  };
};

export const useParametroMonitoreoPorId = (id: string | null) => {
  const [parametro, setParametro] = useState<ParametroMonitoreo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BUSCAR_ID = useCallback(async (parametroId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.GET_ID(parametroId);
      setParametro(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      BUSCAR_ID(id);
    }
  }, [id, BUSCAR_ID]);

  return {
    parametro,
    loading,
    error,
    refetch: () => id && BUSCAR_ID(id)
  };
};

export const useParametrosPorCultivo = (cultivoId: string | null) => {
  const [parametros, setParametros] = useState<ParametroMonitoreo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarParametrosPorCultivo = useCallback(async (cultivo: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.GET_BY_CULTIVO(cultivo);
      setParametros(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cultivoId) {
      buscarParametrosPorCultivo(cultivoId);
    }
  }, [cultivoId, buscarParametrosPorCultivo]);

  return {
    parametros,
    loading,
    error,
    refetch: () => cultivoId && buscarParametrosPorCultivo(cultivoId)
  };
};

export const useParametrosPorFuente = (fuenteDatos: string | null) => {
  const [parametros, setParametros] = useState<ParametroMonitoreo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarParametrosPorFuente = useCallback(async (fuente: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.GET_BY_FUENTE(fuente);
      setParametros(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fuenteDatos) {
      buscarParametrosPorFuente(fuenteDatos);
    }
  }, [fuenteDatos, buscarParametrosPorFuente]);

  return {
    parametros,
    loading,
    error,
    refetch: () => fuenteDatos && buscarParametrosPorFuente(fuenteDatos)
  };
};

export const useParametrosPorCultivoOrdenados = (cultivoId: string | null) => {
  const [parametros, setParametros] = useState<ParametroMonitoreo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarParametrosOrdenados = useCallback(async (cultivo: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.GET_BY_CULTIVO_ORDERED(cultivo);
      setParametros(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cultivoId) {
      buscarParametrosOrdenados(cultivoId);
    }
  }, [cultivoId, buscarParametrosOrdenados]);

  return {
    parametros,
    loading,
    error,
    refetch: () => cultivoId && buscarParametrosOrdenados(cultivoId)
  };
};

export const useParametrosPorRangoFechas = (
  cultivoId: string | null,
  fechaInicio: string | null,
  fechaFin: string | null
) => {
  const [parametros, setParametros] = useState<ParametroMonitoreo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarParametrosPorRango = useCallback(async (
    cultivo: string,
    inicio: string,
    fin: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.GET_BY_RANGOS_DATE(cultivo, inicio, fin);
      setParametros(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cultivoId && fechaInicio && fechaFin) {
      buscarParametrosPorRango(cultivoId, fechaInicio, fechaFin);
    }
  }, [cultivoId, fechaInicio, fechaFin, buscarParametrosPorRango]);

  return {
    parametros,
    loading,
    error,
    refetch: () => cultivoId && fechaInicio && fechaFin && 
      buscarParametrosPorRango(cultivoId, fechaInicio, fechaFin)
  };
};

export const useTemperaturaPromedio = (
  cultivoId: string | null,
  fechaInicio: string | null
) => {
  const [temperatura, setTemperatura] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarTemperaturaPromedio = useCallback(async (
    cultivo: string,
    inicio: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.GET_TEMPERATURA_PROMEDIO(cultivo, inicio);
      setTemperatura(data);
    } catch (error: unknown) {
      setError(GET_ERROR(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (cultivoId && fechaInicio) {
      buscarTemperaturaPromedio(cultivoId, fechaInicio);
    }
  }, [cultivoId, fechaInicio, buscarTemperaturaPromedio]);

  return {
    temperatura,
    loading,
    error,
    refetch: () => cultivoId && fechaInicio && 
      buscarTemperaturaPromedio(cultivoId, fechaInicio)
  };
};

  export const useParametrosMonitoreoCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CREAR = async (parametro: Omit<ParametroMonitoreo, 'id'>): Promise<ParametroMonitoreo | null> => {
    try {
      setLoading(true);
      setError(null);
      const nuevoParametro = await service.POST(parametro);
      return nuevoParametro;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const ACTUALIZAR = async (
    id: string,
    parametro: Omit<ParametroMonitoreo, 'id'>
  ): Promise<ParametroMonitoreo | null> => {
    try {
      setLoading(true);
      setError(null);
      const parametroActualizado = await service.PUT(id, parametro);
      return parametroActualizado;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const ELIMINAR = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await service.DELETE(id);
      return true;
    } catch (error: unknown) {
      setError(GET_ERROR(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    CREAR,
    ACTUALIZAR,
    ELIMINAR,
    clearError: () => setError(null)
  };
};