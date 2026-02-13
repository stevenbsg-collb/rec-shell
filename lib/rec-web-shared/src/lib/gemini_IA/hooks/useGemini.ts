import { useState, useCallback } from 'react';
import { service } from '../services/geminiService.service';
import { UseGeminiOptions, UseGeminiReturn } from '../model/dominio';

export const useGemini = ({
  temperature = 0.7,
  maxTokens = 4096,
  onSuccess,
  onError
}: UseGeminiOptions): UseGeminiReturn => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateText = useCallback(async (prompt: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await service.generateText({
        prompt,
        temperature,
        maxTokens
      });
      setResponse(result);
      onSuccess?.(result);

    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al generar texto';
      
      setError(errorMessage);
      onError?.(errorMessage);

    } finally {
      setLoading(false);
    }
  }, [temperature, maxTokens, onSuccess, onError]);

  const reset = useCallback(() => {
    setResponse(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    response,
    loading,
    error,
    generateText,
    reset
  };
};