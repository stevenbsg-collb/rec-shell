import { useState } from 'react';
import { service } from '../services/users.service';

export const useConfirmSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const confirmSignUp = async (username: string, confirmationCode: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await service.CONFIRM_POST(username, confirmationCode);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { confirmSignUp, loading, error, setError };
};