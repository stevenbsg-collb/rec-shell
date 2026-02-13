import { useState, useCallback } from 'react';
import { Tratamiento } from '../../types/model';
import { service } from '../services/agricultura.service';
import { GET_ERROR } from '../../utils/utils';

export const useTratamientos = () => {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [tratamiento, setTratamiento] = useState<Tratamiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const BUSCAR = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET();
      setTratamientos(data);
    } catch (err: unknown) {
      setError(GET_ERROR(err));
    } 
    setLoading(false);
  }, []);

  const BUSCAR_ID = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_ID(id);
      setTratamiento(data);
      return data;
    } catch (err: unknown) {
      setError(GET_ERROR(err));
      //return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const LISTAR = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET();
      setTratamientos(data);
    } catch (err: unknown) {
      setError(GET_ERROR(err));
    } 
    setLoading(false);
  }, []);

  const obtenerPorDeficiencia = useCallback(async (deficienciaId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_DEFICIENCIA(deficienciaId);
      setTratamientos(data);
    } catch (err: unknown) {
      setError(GET_ERROR(err));
    } 
    setLoading(false);
  }, []);

  const obtenerActivos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_ACTIVE();
      setTratamientos(data);
    } catch (err: unknown) {
      setError(GET_ERROR(err));
    } 
    setLoading(false);
  }, []);

  const obtenerPorTipo = useCallback(async (tipoTratamiento: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_TYPE(tipoTratamiento);
      setTratamientos(data);
    } catch (err: unknown) {
      setError(GET_ERROR(err));
    } 
    setLoading(false);
  }, []);

  const obtenerActivosPorDeficiencia = useCallback(async (deficienciaId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_ACTIVE_DEFICIENCIA(deficienciaId);
      setTratamientos(data);
    } catch (err: unknown) {
      setError(GET_ERROR(err));
    } 
    setLoading(false);
  }, []);

  const obtenerRapidos = useCallback(async (diasMaximos: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.GET_FLASH(diasMaximos);
      setTratamientos(data);
    } catch (err: unknown) {
      setError(GET_ERROR(err));
    } 
    setLoading(false);
  }, []);

  const CREAR = useCallback(async (tratamiento: Omit<Tratamiento, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.POST(tratamiento);
      setTratamientos(prev => [...prev, data]);
      return data;
    } catch (err: unknown) {
      setError(GET_ERROR(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const ACTUALIZAR = useCallback(async (id: number, tratamiento: Omit<Tratamiento, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.PUT(id, tratamiento);
      setTratamientos(prev => prev.map(t => t.id === id ? data : t));
      return data;
    } catch (err: unknown) {
      setError(GET_ERROR(err));
       //return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const ELIMINAR = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await service.DELETE(id);
      setTratamientos(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err: unknown) {
      setError(GET_ERROR(err)); 
      //return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tratamientos,
    tratamiento,
    loading,
    error,
    BUSCAR,
    BUSCAR_ID,
    obtenerPorDeficiencia,
    obtenerActivos,
    obtenerPorTipo,
    obtenerActivosPorDeficiencia,
    obtenerRapidos,
    CREAR,
    ACTUALIZAR,
    ELIMINAR,
    LISTAR
  };
};