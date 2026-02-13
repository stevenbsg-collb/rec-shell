import { AnalisisImagenMCHLDTO } from "../types/dto";
import { AnalisisImagenYOLO_DTO } from "../types/yolo";

/**
 * Genera el prompt para crear un plan de tratamiento agronómico
 * basado en el análisis de imagen de cultivo de cacao
 */
export const generarPromptPlanTratamiento = (
  analisis: AnalisisImagenYOLO_DTO
): string => {
  const analisisJSON = JSON.stringify(analisis, null, 2);

  return `Actúa como un ingeniero agrónomo experto en nutrición vegetal especializado en cultivos de cacao.

Con base EXCLUSIVA en el siguiente análisis dinámico en formato JSON:

${analisisJSON}

Tu única tarea es generar un PLAN DE TRATAMIENTO AGRONÓMICO detallado, estructurado y técnicamente correcto.

REGLAS CRÍTICAS:
1. Tu respuesta DEBE ser ÚNICAMENTE el objeto JSON válido, sin texto adicional
2. NO uses bloques markdown (ni \`\`\`json ni \`\`\`)
3. NO incluyas introducciones, explicaciones o texto fuera del JSON
4. TODOS los strings deben estar correctamente escapados
5. NO uses saltos de línea dentro de los valores de texto
6. Todos los valores deben ser técnicamente coherentes con la deficiencia detectada
7. Si algún dato no se puede determinar con certeza, usa null

ESTRUCTURA OBLIGATORIA (respeta exactamente este formato):

{
  "tratamiento": "string descriptivo sin saltos de línea",
  "planAplicacion": {
    "tipo": "string ",
    "dosisPorLitro": "string con formato: X g/L o X ml/L",
    "volumenPorHectareaEstimado_L": 500,
    "dosisPorHectareaEstimada": "string calculado basado en dosis por litro",
    "frecuenciaDias": número entero,
    "numeroAplicaciones": número entero,
    "duracionTratamientoDias": número entero,
    "horaRecomendada": "06:00 - 09:00",
    "precauciones": "string con precauciones separadas por punto y coma si son múltiples"
  },
  "tratamientoSuelo": {
    "accion": "string sin saltos de línea",
    "productoSugerido": "string con nombre del producto",
    "dosisOrientativa": "string con formato: X kg/ha",
    "metodo": "string describiendo el método"
  },
  "seguimiento": {
    "observableMejora": null,
    "notasTecnico": "string con notas técnicas sin saltos de línea",
    "imagenesSeguimiento": []
  }
}

IMPORTANTE: Responde SOLO con el objeto JSON válido, comenzando con { y terminando con }`;
};

/**
 * Interface para el tipo de respuesta esperada del plan de tratamiento
 */
export interface PlanTratamientoResponse {
  tratamiento: string;
  planAplicacion: {
    tipo: string;
    dosisPorLitro: string;
    volumenPorHectareaEstimado_L: number;
    dosisPorHectareaEstimada: string;
    frecuenciaDias: number;
    numeroAplicaciones: number;
    duracionTratamientoDias: number;
    horaRecomendada: string;
    precauciones: string;
  };
  tratamientoSuelo: {
    accion: string;
    productoSugerido: string;
    dosisOrientativa: string;
    metodo: string;
  };
  seguimiento: {
    observableMejora: string | null;
    notasTecnico: string;
    imagenesSeguimiento: string[];
  };
}

export const fallbackPlan: PlanTratamientoResponse = {
  tratamiento: "Plan de corrección de deficiencia de Potasio en cacao, combinando aplicación foliar para respuesta rápida y enmienda al suelo para sostenibilidad.",
  planAplicacion: {
    tipo: "Foliar",
    dosisPorLitro: "15 g/L",
    volumenPorHectareaEstimado_L: 500,
    dosisPorHectareaEstimada: "7.5 kg/ha de Sulfato de Potasio",
    frecuenciaDias: 7,
    numeroAplicaciones: 3,
    duracionTratamientoDias: 14,
    horaRecomendada: "06:00 - 09:00",
    precauciones: "Evitar aplicar en horas de máxima insolación; Asegurar buena cobertura foliar; No mezclar con productos incompatibles sin prueba previa; Usar equipo de protección personal."
  },
  tratamientoSuelo: {
    accion: "Aporte de potasio al suelo para corrección de deficiencia a mediano y largo plazo, y mejora de la disponibilidad nutricional general.",
    productoSugerido: "Cloruro de Potasio (MOP) o Sulfato de Potasio (SOP)",
    dosisOrientativa: "150-250 kg/ha/año",
    metodo: "Aplicación al voleo o en banda alrededor de la zona de goteo de los árboles, fraccionado en 2-3 aplicaciones anuales, idealmente incorporado ligeramente al suelo y seguido de riego."
  },
  seguimiento: {
    observableMejora: null,
    notasTecnico: "Es fundamental realizar un análisis foliar y de suelo detallado para confirmar la severidad de la deficiencia y ajustar las dosis de potasio. Monitorear los síntomas de mejora en las hojas nuevas. Evaluar y corregir el pH del suelo si es necesario, ya que niveles extremos afectan la disponibilidad de potasio. Continuar con el manejo de materia orgánica y sombra.",
    imagenesSeguimiento: []
  }
};
