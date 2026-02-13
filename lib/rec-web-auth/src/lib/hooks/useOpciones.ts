import { useState } from 'react';
import { OpcionDTO } from '../types/auth';
import { authService } from '../services/authService.service';
export const useOpciones = () => {
  const [opciones, setOpciones] = useState<OpcionDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const OBTENER_OPCIONES = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.GET_OPCIONES();
      setOpciones(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener opciones';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const OBTENER_OPCIONES_BY_ROL = async (roleName: string, opcion : string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.GET_OPCION_BY_ROL(roleName, opcion);
      setOpciones(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener opciones por rol';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    opciones,
    loading,
    error,
    OBTENER_OPCIONES,
    OBTENER_OPCIONES_BY_ROL,
  };
};