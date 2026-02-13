import { Deteccion } from "../../../types/yolo";

// Función auxiliar para manejar respuesta del modelo
export function handleModelResponse<T>({
  text,
  onParsed,
  onError,
  onFinally,
}: {
  text: string;
  onParsed: (data: T) => void;
  onError: (err: string) => void;
  onFinally?: () => void;
}) {
  try {
    let jsonText = text.trim();
    
    // Extraer JSON de bloques markdown
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim();
    } else {
      // Buscar objeto JSON en el texto
      const braceMatch = text.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        jsonText = braceMatch[0];
      }
    }

    const parsed = JSON.parse(jsonText) as T;
    onParsed(parsed);
  } catch (err) {
    console.error('Error al parsear JSON:', err);
    onError(err instanceof Error ? err.message : 'Error desconocido');
  } finally {
    onFinally?.();
  }
}

// Utilidad para calcular estadísticas consolidadas
export function calcularEstadisticasConsolidadas(detecciones: Deteccion[]) {
  return {
    total_detecciones: detecciones.length,
    deficiencias_unicas: new Set(detecciones.map(d => d.deficiencia)).size,
    confianza_promedio:
      detecciones.reduce((sum, det) => sum + det.confianza, 0) / detecciones.length,
    confianza_maxima: Math.max(...detecciones.map(d => d.confianza)),
    por_tipo: detecciones.reduce<Record<string, number>>((acc, det) => {
      acc[det.deficiencia] = (acc[det.deficiencia] || 0) + 1;
      return acc;
    }, {}),
  };
}

// Utilidad para obtener color de severidad
export function getSeverityColor(confianza: number): string {
  if (confianza >= 90) return 'red';
  if (confianza >= 70) return 'orange';
  return 'yellow';
}

// Utilidad para obtener color de badge por tipo de nutriente
export function getNutrientColor(tipo: string): string {
  const colorMap: Record<string, string> = {
    'Potasio': 'orange',
    'Nitrogeno': 'blue',
    'Fosforo': 'red',
    'Zinc': 'green',
    'Magnesio': 'violet',
  };
  return colorMap[tipo] || 'gray';
}

export const getTipoAlertaColor = (tipo: string): string => {
  const colors: Record<string, string> = {
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'blue',
  };
  return colors[tipo] || 'gray';
};

// Utilidad para formatear nombre de deficiencia
export const formatDeficiencia = (deficiencia: string): string => {
  return deficiencia
    .replace('deficienciia_', '')
    .replace('deficiencia_', '')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Utilidad para color según confianza
export const getConfianzaColor = (confianza: number): string => {
  if (confianza >= 80) return 'green';
  if (confianza >= 60) return 'yellow';
  return 'orange';
};