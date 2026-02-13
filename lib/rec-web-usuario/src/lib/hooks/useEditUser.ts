import { useState } from 'react';
import { service } from '../services/users.service';
import { UserData } from '@rec-shell/rec-web-shared';

export const useEditUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (userData: UserData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await service.PUT(userData);
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUser,
    loading,
    error,
    setError
  };
};