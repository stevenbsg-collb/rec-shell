import { useState, useCallback } from 'react';
import { pdfService } from '../services/PDFService.service';

interface UsePDFOptions {
  onSummarySuccess?: (summary: string) => void;
  onQuestionsSuccess?: (questions: string) => void;
  onError?: (error: string) => void;
}

interface UsePDFReturn {
  summary: string | null;
  questions: string | null;
  loading: boolean;
  error: string | null;
  summarizePDF: (file: File) => Promise<void>;
  generateQuestions: (summary: string, numberOfQuestions?: number) => Promise<void>;
  reset: () => void;
}

export const usePDF = ({
  onSummarySuccess,
  onQuestionsSuccess,
  onError
}: UsePDFOptions = {}): UsePDFReturn => {
  const [summary, setSummary] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const summarizePDF = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await pdfService.summarizePDF(file);
      setSummary(result);
      onSummarySuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al generar resumen del PDF';
      
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onSummarySuccess, onError]);

  const generateQuestions = useCallback(async (
    summaryText: string, 
    numberOfQuestions = 10
  ) => {
    setLoading(true);
    setError(null);
    setQuestions(null);

    try {
      const result = await pdfService.generateQuestions(summaryText, numberOfQuestions);
      setQuestions(result);
      onQuestionsSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al generar preguntas';
      
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onQuestionsSuccess, onError]);

  const reset = useCallback(() => {
    setSummary(null);
    setQuestions(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    summary,
    questions,
    loading,
    error,
    summarizePDF,
    generateQuestions,
    reset
  };
};