import { useState } from 'react';
import { DeficienciaNutriente } from '../../types/model';
import { service } from '../services/agricultura.service';
import { DeficienciaNutrienteInput } from '../../types/dto';
import { GET_ERROR } from '../../utils/utils';

export const useAgricultura = () => {
  const [deficiencias, setDeficiencias] = useState<DeficienciaNutriente[]>([]);
  const [deficiencia, setDeficiencia] = useState<DeficienciaNutriente | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const handleError = (err: unknown) => {
    setError(GET_ERROR(err));
    console.error('Error en operación:', err);
  };

  const clearError = () => setError(null);

  const CREAR = async (data: DeficienciaNutrienteInput): Promise<DeficienciaNutriente | null> => {
    try {
      setLoading(true);
      clearError();
      
      const nuevaDeficiencia = await service.POST(data);
      
      if (nuevaDeficiencia) {
        setDeficiencias(prev => [...prev, nuevaDeficiencia]);
        return nuevaDeficiencia;
      }
      return null;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const BUSCAR_ID = async (id: string): Promise<DeficienciaNutriente | null> => {
    try {
      setLoading(true);
      clearError();
      const deficienciaEncontrada = await service.GET_ID(id);
      setDeficiencia(deficienciaEncontrada);
      return deficienciaEncontrada;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const buscarPorCodigo = async (codigo: string): Promise<DeficienciaNutriente | null> => {
    try {
      setLoading(true);
      clearError();
      const deficienciaEncontrada = await service.GET_BY_CODE(codigo);
      setDeficiencia(deficienciaEncontrada);
      return deficienciaEncontrada;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const BUSCAR = async () => {
    try {
      setLoading(true);
      clearError();
      const todasDeficiencias = await service.GET();
      setDeficiencias(todasDeficiencias);
      return todasDeficiencias;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const buscarActivas = async () => {
    try {
      setLoading(true);
      clearError();
      const deficienciasActivas = await service.GET_STATE();
      setDeficiencias(deficienciasActivas);
      return deficienciasActivas;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const buscarPorNutriente = async (nutriente: string) => {
    try {
      setLoading(true);
      clearError();
      const deficienciasPorNutriente = await service.GET_NUTRIENTES(nutriente);
      setDeficiencias(deficienciasPorNutriente);
      return deficienciasPorNutriente;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const buscarActivasOrdenadas = async () => {
    try {
      setLoading(true);
      clearError();
      const deficienciasOrdenadas = await service.GET_STATE_ORDERED();
      setDeficiencias(deficienciasOrdenadas);
      return deficienciasOrdenadas;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const contarActivas = async (): Promise<number> => {
    try {
      setLoading(true);
      clearError();
      const count = await service.COUNT_ACTIVE();
      return count;
    } catch (err) {
      handleError(err);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  const ACTUALIZAR = async (id: string, data: DeficienciaNutrienteInput): Promise<DeficienciaNutriente | null> => {
    try {
      setLoading(true);
      clearError();
      const deficienciaActualizada = await service.PUT(id, data);
      setDeficiencias(prev => 
        prev.map(def => def.id.toString() === id ? deficienciaActualizada : def)
      );
      if (deficiencia?.id.toString() === id) {
        setDeficiencia(deficienciaActualizada);
      }
      return deficienciaActualizada;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const ELIMINAR = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      await service.DELETE(id);
      setDeficiencias(prev => prev.filter(def => def.id.toString() !== id));
      if (deficiencia?.id.toString() === id) {
        setDeficiencia(null);
      }
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const activar = async (id: string): Promise<DeficienciaNutriente | null> => {
    try {
      setLoading(true);
      clearError();
      const deficienciaActivada = await service.IS_ACTIVE(id);
      setDeficiencias(prev => 
        prev.map(def => def.id.toString() === id ? deficienciaActivada : def)
      );
      if (deficiencia?.id.toString() === id) {
        setDeficiencia(deficienciaActivada);
      }
      return deficienciaActivada;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const desactivar = async (id: string): Promise<DeficienciaNutriente | null> => {
    try {
      setLoading(true);
      clearError();
      const deficienciaDesactivada = await service.IS_INACTIVE(id);
      setDeficiencias(prev => 
        prev.map(def => def.id.toString() === id ? deficienciaDesactivada : def)
      );
      if (deficiencia?.id.toString() === id) {
        setDeficiencia(deficienciaDesactivada);
      }
      return deficienciaDesactivada;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    deficiencias,
    deficiencia,
    loading,
    error,
    
    CREAR,
    BUSCAR_ID,
    buscarPorCodigo,
    BUSCAR,
    buscarActivas,
    buscarPorNutriente,
    buscarActivasOrdenadas,
    contarActivas,
    ACTUALIZAR,
    ELIMINAR,
    activar,
    desactivar,
    clearError
  };
};