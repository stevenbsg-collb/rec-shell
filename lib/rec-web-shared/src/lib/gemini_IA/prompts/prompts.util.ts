export const generateSummaryPrompt = (): string => {
  return `Por favor, analiza este documento PDF y genera un resumen completo que incluya:

1. Tema principal del documento
2. Puntos clave y conceptos importantes
3. Conclusiones o resultados relevantes
4. Cualquier dato o estadística significativa

Proporciona el resumen en español de forma clara y estructurada.`;
};

export const generateQuestionsPrompt = (
  summary: string,
  numberOfQuestions = 10
): string => {
  return `Basándote en el siguiente resumen, genera exactamente ${numberOfQuestions} preguntas de opción múltiple.
Para cada pregunta, proporciona 3 opciones: 1 correcta y 2 incorrectas.

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido en el siguiente formato, sin texto adicional antes o después:
{
  "preguntas": [
    {
      "pregunta": "texto de la pregunta",
      "opciones": ["opción correcta", "opción incorrecta 1", "opción incorrecta 2"],
      "respuestaCorrecta": 0
    }
  ]
}

REGLAS:
- Genera exactamente ${numberOfQuestions} pregunta${numberOfQuestions !== 1 ? 's' : ''}
- Cada pregunta debe tener exactamente 3 opciones
- La primera opción (índice 0) siempre debe ser la correcta
- Las opciones incorrectas deben ser plausibles pero claramente incorrectas
- Las preguntas deben cubrir diferentes aspectos del resumen
- Usa un lenguaje claro y preciso

Resumen:
${summary}`;
};

/**
 * Configuraciones de generación para diferentes tipos de contenido
 */
export const GENERATION_CONFIGS = {
  summary: {
    temperature: 0.4,
    maxOutputTokens: 8192,
  },
  questions: {
    temperature: 0.4,
    maxOutputTokens: 4096,
  },
  general: {
    temperature: 0.7,
    maxOutputTokens: 2048,
  },
} as const;


export const PROMPT_LIMITS = {
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 50,
  DEFAULT_QUESTIONS: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB en bytes
} as const;