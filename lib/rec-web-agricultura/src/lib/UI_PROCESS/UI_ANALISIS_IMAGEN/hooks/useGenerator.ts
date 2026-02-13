import { useState, useRef } from 'react';
import { useGemini, handleModelResponse } from '@rec-shell/rec-web-shared';
import { usePlanesTratamiento } from '../hooks/useAgricultura';
import {
  GenerarPlanAnalisisRequest,
  PlanTratamientoResponse,
} from '../../../types/dto';
import { AnalisisImagenYOLO_DTO } from '../../../types/yolo';
import {
  fallbackPlan,
  generarPromptPlanTratamiento,
} from '../../../utils/generarPromptPlanTratamiento';

export function usePlanTratamientoGenerator() {
  const { loading: loadingPlan, generarPlan } = usePlanesTratamiento();
  const [planTratamientoGenerado, setPlanTratamientoGenerado] =
    useState<PlanTratamientoResponse>(fallbackPlan);
  const analisisActualRef = useRef<AnalisisImagenYOLO_DTO | null>(null);

  // ✅ Para que el "loading" solo se vea en la fila seleccionada

  const [generatingAnalisisId, setGeneratingAnalisisId] = useState<number | null>(null);


  const guardarPlanTratamiento = (plan: PlanTratamientoResponse) => {
    const analisisActual = analisisActualRef.current;
    if (!analisisActual) return;

    const request: GenerarPlanAnalisisRequest = {
      analisisId: analisisActual.id,
      planTratamiento: plan,
    };

    // IMPORTANTE: como este hook maneja 1 generación a la vez, limpiamos el ref aquí
    // y liberamos el loading del botón cuando termine de guardarse el plan.
    analisisActualRef.current = null;
    Promise.resolve(generarPlan(request)).finally(() => {
      setGeneratingAnalisisId(null);
    });
  };

  const { loading: loadingGemini, error: errorGemini, generateText } = useGemini({
    onSuccess: (text: string) =>
      handleModelResponse<PlanTratamientoResponse>({
        text,
        onParsed: (data: PlanTratamientoResponse) => {
          console.log('Plan de tratamiento generado:', data);
          setPlanTratamientoGenerado(data);
          guardarPlanTratamiento(data);
        },
        onError: (err) => {
          console.error('Error al parsear plan de tratamiento:', err);
          setPlanTratamientoGenerado(fallbackPlan);
          guardarPlanTratamiento(fallbackPlan);
        },
        onFinally: () => {
          console.log('✨ Finalizó el procesamiento del plan de tratamiento');
        },
      }),
    onError: (err: string) => {
      console.error('Error de Gemini API:', err);
      setPlanTratamientoGenerado(fallbackPlan);
      guardarPlanTratamiento(fallbackPlan);
    },
  });

  const handleGenerarPlan = async (analisis: AnalisisImagenYOLO_DTO) => {
    try {
      // Evitar doble click mientras está procesando
      if (loadingGemini || loadingPlan) return;


      setGeneratingAnalisisId(analisis.id ?? null);
      analisisActualRef.current = analisis;
      analisis.imagenBase64 = '';
      const prompt = generarPromptPlanTratamiento(analisis);

      console.log('Generando plan de tratamiento para:', analisis.archivo);
      await generateText(prompt);
    } catch (error) {
      console.error('Error al generar plan:', error);
      analisisActualRef.current = null;
      setGeneratingAnalisisId(null);
    }
  };

  return {
    loadingGemini,
    errorGemini,
    loadingPlan,
    planTratamientoGenerado,
    generatingAnalisisId,
    isProcessing: loadingGemini || loadingPlan,
    handleGenerarPlan,
  };
}
