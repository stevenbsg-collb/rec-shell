import { UserData } from '@rec-shell/rec-web-shared';
import { useState } from 'react';
import { service } from '../services/users.service';

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signUp = async (userData: UserData) => {
    setLoading(true);
    setError('');

    try {
      const response = await service.POST(userData);
      setLoading(false);
      return response;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error, setError };
};