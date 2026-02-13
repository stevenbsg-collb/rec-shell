import { useState } from 'react';
import { MedidaPreventiva } from '../../types/model';
import { MedidaPreventivaInput } from '../../types/dto';
import { service } from '../services/agricultura.service';
import { GET_ERROR } from '../../utils/utils';

export const useMedidaPreventiva = () => {
  const [medidas, setMedidas] = useState<MedidaPreventiva[]>([]);
  const [medida, setMedida] = useState<MedidaPreventiva | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    setError(GET_ERROR(error));
    setLoading(false);
  };

  const CREAR = async (input: MedidaPreventivaInput) => {
    try {
      setLoading(true);
      setError(null);
      const nuevaMedida = await service.POST(input);
      setMedidas(prev => [...prev, nuevaMedida]);
      return nuevaMedida;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const BUSCAR_ID = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const medida = await service.GET_ID(id);
      setMedida(medida);
      return medida;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const BUSCAR = async () => {
    try {
      setLoading(true);
      setError(null);
      const medidas = await service.GET();
      setMedidas(medidas);
      return medidas;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const buscarPorDeficiencia = async (deficienciaId: number) => {
    try {
      setLoading(true);
      setError(null);
      const medidas = await service.GET_DEFICIENCIA(deficienciaId);
      setMedidas(medidas);
      return medidas;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const buscarActivas = async () => {
    try {
      setLoading(true);
      setError(null);
      const medidas = await service.GET_STATE();
      setMedidas(medidas);
      return medidas;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const buscarPorTipo = async (tipoMedida: string) => {
    try {
      setLoading(true);
      setError(null);
      const medidas = await service.GET_TYPE(tipoMedida);
      setMedidas(medidas);
      return medidas;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const buscarActivasPorDeficiencia = async (deficienciaId: number) => {
    try {
      setLoading(true);
      setError(null);
      const medidas = await service.GET_DEFINCIENCIA_ACTIVE(deficienciaId);
      setMedidas(medidas);
      return medidas;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const buscarPorEfectividadMinima = async (efectividadMinima: number) => {
    try {
      setLoading(true);
      setError(null);
      const medidas = await service.GET_EFECT_MINIMA(efectividadMinima);
      setMedidas(medidas);
      return medidas;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const ACTUALIZAR = async (id: number, input: MedidaPreventivaInput) => {
    try {
      setLoading(true);
      setError(null);
      const medidaActualizada = await service.PUT(id, input);
      setMedidas(prev => prev.map(m => m.id === id ? medidaActualizada : m));
      setMedida(medidaActualizada);
      return medidaActualizada;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const ELIMINAR = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await service.DELETE(id);
      setMedidas(prev => prev.filter(m => m.id !== id));
      if (medida?.id === id) {
        setMedida(null);
      }
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const activarMedida = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const medidaActivada = await service.IS_ACTIVE(id);
      setMedidas(prev => prev.map(m => m.id === id ? medidaActivada : m));
      setMedida(medidaActivada);
      return medidaActivada;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const desactivarMedida = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const medidaDesactivada = await service.IS_INACTIVE(id);
      setMedidas(prev => prev.map(m => m.id === id ? medidaDesactivada : m));
      setMedida(medidaDesactivada);
      return medidaDesactivada;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearMedida = () => setMedida(null);
  const clearMedidas = () => setMedidas([]);

  return {
    medidas,
    medida,
    loading,
    error,

    CREAR,
    BUSCAR_ID,
    BUSCAR,
    ACTUALIZAR,
    ELIMINAR,

    buscarPorDeficiencia,
    buscarActivas,
    buscarPorTipo,
    buscarActivasPorDeficiencia,
    buscarPorEfectividadMinima,

    activarMedida,
    desactivarMedida,

    clearError,
    clearMedida,
    clearMedidas
  };
};