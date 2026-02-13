import { APIResponse, ImagenAnalisis, ResultDataYOLO } from "../types/yolo";
import { generarFallbackRecomendaciones } from "./utils";

// 1. Define la interfaz para los datos de entrada
interface DiagnosticoData {
    deficiencia: 'Nitrogeno' | 'Fosforo' | 'Potasio' | string;
    confianza: number;
    probabilidades: {
        Potasio: number;
        Nitrogeno: number;
        Fosforo: number;
        [key: string]: number; // Permite otros nutrientes en 'probabilidades'
    };
}

/**
 * Genera el prompt completo que instruye al modelo de lenguaje a 
 * actuar como especialista agrícola y aplicar las reglas de tratamiento.
 * * @param data Los datos de diagnóstico de deficiencia de nutrientes.
 * @returns Una cadena de texto (el prompt) listo para ser enviado al modelo.
 */
export function generarPromptRecomendaciones(data: DiagnosticoData): string {
    // Convierte el objeto de datos en una cadena JSON parcial para la sección de ENTRADA
    const entradaJson = JSON.stringify(data, null, 4)
        .replace(/^{|}$/g, '') // Elimina las llaves exteriores
        .trim();

    const prompt = `
Actúa como un Especialista Agrícola en Nutrición de Cultivos. 
Tu tarea es aplicar las "REGLAS DE TRATAMIENTO" al "FORMATO DE ENTRADA" proporcionado y devolver el resultado en el "FORMATO DE SALIDA" JSON.

---

### FORMATO DE ENTRADA (Diagnóstico Actual):
Se te proporciona el siguiente diagnóstico de deficiencia. 
La clave "deficiencia" indica el nutriente principal identificado:

${entradaJson}

---

### REGLAS DE TRATAMIENTO:
Asume que el cultivo es un cultivo de hoja verde genérico y que el tratamiento es foliar.
1.  Si la "deficiencia" es **Nitrógeno**:
    -   Tratamiento: Urea (46% N) o Nitrato de Amonio
    -   Dosis: 3 g / L
    -   Frecuencia: Cada 7 días
2.  Si la "deficiencia" es **Fósforo**:
    -   Tratamiento: Fosfato Monopotásico (MKP) o Ácido Fosfórico
    -   Dosis: 2 ml / L
    -   Frecuencia: Cada 10 días
3.  Si la "deficiencia" es **Potasio**:
    -   Tratamiento: Nitrato de Potasio (KNO3) o Sulfato de Potasio
    -   Dosis: 4 g / L
    -   Frecuencia: Cada 7 días
4.  Si la "deficiencia" es **Otros** (o no coincide con los 3 principales):
    -   Tratamiento: Fertilización balanceada general (NPK 20-20-20)
    -   Dosis: 2 g / L
    -   Frecuencia: Cada 14 días
5.  **Regla de Confianza**: Si la "confianza" es inferior al **70%**:
    -   Tratamiento: Monitoreo y repetir el diagnóstico. Aplicar NPK balanceado preventivo.
    -   Dosis: 2 g / L
    -   Frecuencia: Cada 14 días

---

### FORMATO DE SALIDA (Obligatorio):
Debes devolver la información exclusivamente en el siguiente formato JSON, aplicando rigurosamente las reglas anteriores:

{
    "recomendaciones": {
        "tratamiento": "[Nombre del producto o acción]",
        "dosis": "[Cantidad y unidad de dosis]",
        "frecuencia": "[Periodicidad y unidad de tiempo]"
    }
}
`;
    return prompt;
}

export const generarPromptRecomendacionesYOLO_v1 = (data: ResultDataYOLO): string => {
  const { detecciones, estadisticas } = data;

  if (detecciones.length === 0) {
    return `
Devuelve SOLO un JSON válido.

Formato:
{
  "deficiencias": [],
  "confianza_general": 0
}
`;
  }

  const deficienciasEncontradas = detecciones.map(d => d.deficiencia);
  const deficienciasUnicas = [...new Set(deficienciasEncontradas)];

  const  resumenDeficiencias = deficienciasUnicas.map(deficiencia => {
    const cantidad = estadisticas.por_tipo[deficiencia] || 0;
    const deteccionesDeEsteTipo = detecciones.filter(d => d.deficiencia === deficiencia);
    const confianzaPromedio =
      deteccionesDeEsteTipo.reduce((sum, d) => sum + d.confianza, 0) / cantidad;

    return {
      deficiencia,
      regiones_afectadas: cantidad,
      confianza_promedio: Number(confianzaPromedio.toFixed(1))
    };
  });

  return `
Devuelve EXCLUSIVAMENTE un JSON válido.
NO incluyas texto adicional.
NO uses markdown.
NO agregues explicaciones fuera del JSON.

Datos detectados:
${JSON.stringify(resumenDeficiencias, null, 2)}

Confianza general: ${estadisticas.confianza_promedio.toFixed(1)}%

Formato de respuesta OBLIGATORIO:
{
  "confianza_general": number,
  "deficiencias": [
    {
      "nombre": string,
      "confianza": number,
      "recomendaciones": {
        "tratamiento_inmediato": string[],
        "fertilizantes_recomendados": string[],
        "medidas_preventivas": string[]
      }
    }
  ]
}
`;
};


export const generarPromptRecomendacionesYOLO = (data: ResultDataYOLO): string => {
  const { detecciones, estadisticas } = data;

  if (detecciones.length === 0) {
    return `
Devuelve SOLO un JSON válido.

Formato:
{
  "deficiencias": [],
  "confianza_general": 0
}
`;
  }

  const deficienciasEncontradas = detecciones.map(d => d.deficiencia);
  const deficienciasUnicas = [...new Set(deficienciasEncontradas)];

  const resumenDeficiencias = deficienciasUnicas.map(deficiencia => {
    const cantidad = estadisticas.por_tipo[deficiencia] || 0;
    const deteccionesDeEsteTipo = detecciones.filter(d => d.deficiencia === deficiencia);
    const confianzaPromedio =
      deteccionesDeEsteTipo.reduce((sum, d) => sum + d.confianza, 0) / cantidad;

    return {
      deficiencia,
      regiones_afectadas: cantidad,
      confianza_promedio: Number(confianzaPromedio.toFixed(1))
    };
  });

  return `
Eres un experto agrónomo especializado en cultivo de cacao.

IMPORTANTE: Detectamos ${deficienciasUnicas.length} TIPO(S) de deficiencia(s). 
Debes generar EXACTAMENTE ${deficienciasUnicas.length} recomendación(es) en el array "deficiencias".
UNA recomendación por cada TIPO único de deficiencia detectada.

Datos detectados:
${JSON.stringify(resumenDeficiencias, null, 2)}

Confianza general del análisis: ${estadisticas.confianza_promedio.toFixed(1)}%

INSTRUCCIONES:
- Si detectaste "Nitrogeno" en 5 regiones diferentes → Genera 1 sola entrada para "Nitrogeno" 
- Si detectaste "Potasio" en 3 regiones diferentes → Genera 1 sola entrada para "Potasio"
- El array "deficiencias" debe tener ${deficienciasUnicas.length} elemento(s)
- Considera la cantidad de regiones afectadas para determinar la severidad

Devuelve EXCLUSIVAMENTE un JSON válido.
NO incluyas texto adicional.
NO uses markdown.
NO agregues explicaciones fuera del JSON.

Formato de respuesta OBLIGATORIO:
{
  "confianza_general": <número entre 0-100>,
  "deficiencias": [
    {
      "nombre": "<nombre exacto de la deficiencia>",
      "confianza": <confianza promedio de esta deficiencia>,
      "recomendaciones": {
        "tratamiento_inmediato": [
          "<acción urgente 1>",
          "<acción urgente 2>",
          "<acción urgente 3>"
        ],
        "fertilizantes_recomendados": [
          "<fertilizante específico con dosis>",
          "<fertilizante alternativo>",
          "<opción orgánica>"
        ],
        "medidas_preventivas": [
          "<medida preventiva 1>",
          "<medida preventiva 2>",
          "<medida preventiva 3>",
          "<medida preventiva 4>"
        ]
      }
    }
  ]
}
`;
};


export function generarFallbackDesdeImagenes(imagenes: ImagenAnalisis[]) {
  const todasLasDetecciones = imagenes
    .filter(img => img.resultado?.detecciones?.length)
    .flatMap(img => img.resultado!.detecciones!);

  if (todasLasDetecciones.length === 0) {
    return null;
  }

  const porTipo = todasLasDetecciones.reduce<Record<string, number>>(
    (acc, det) => {
      acc[det.deficiencia] = (acc[det.deficiencia] || 0) + 1;
      return acc;
    },
    {}
  );

  const confianzaPromedio =
    todasLasDetecciones.reduce((sum, det) => sum + det.confianza, 0) /
    todasLasDetecciones.length;

  // Generar recomendaciones como strings
  const recomendacionesTexto: string[] = [];

  Object.entries(porTipo).forEach(([deficiencia, cantidad]) => {
    const deteccionesDeficiencia = todasLasDetecciones.filter(
      d => d.deficiencia === deficiencia
    );
    const confianzaDeficiencia =
      deteccionesDeficiencia.reduce((sum, d) => sum + d.confianza, 0) /
      deteccionesDeficiencia.length;

    const recs = generarRecomendacionesPorDeficiencia(deficiencia);
    
    // Encabezado de la deficiencia
    recomendacionesTexto.push(
      `\n🔍 DEFICIENCIA DE ${deficiencia.toUpperCase()}`
    );
    recomendacionesTexto.push(
      `   Confianza: ${confianzaDeficiencia.toFixed(1)}% | Detecciones: ${cantidad}`
    );
    recomendacionesTexto.push('');
    
    // Tratamiento inmediato
    if (recs.tratamiento_inmediato?.length) {
      recomendacionesTexto.push('📋 TRATAMIENTO INMEDIATO:');
      recs.tratamiento_inmediato.forEach((t, i) => {
        recomendacionesTexto.push(`   ${i + 1}. ${t}`);
      });
      recomendacionesTexto.push('');
    }
    
    // Fertilizantes recomendados
    if (recs.fertilizantes_recomendados?.length) {
      recomendacionesTexto.push('🌱 FERTILIZANTES RECOMENDADOS:');
      recs.fertilizantes_recomendados.forEach((f, i) => {
        recomendacionesTexto.push(`   ${i + 1}. ${f}`);
      });
      recomendacionesTexto.push('');
    }
    
    // Medidas preventivas
    if (recs.medidas_preventivas?.length) {
      recomendacionesTexto.push('🛡️ MEDIDAS PREVENTIVAS:');
      recs.medidas_preventivas.forEach((m, i) => {
        recomendacionesTexto.push(`   ${i + 1}. ${m}`);
      });
      recomendacionesTexto.push('');
    }
    
    recomendacionesTexto.push('─'.repeat(60));
  });

  return generarFallbackRecomendaciones({
    detecciones: todasLasDetecciones,
    estadisticas: {
      total_detecciones: todasLasDetecciones.length,
      deficiencias_unicas: new Set(
        todasLasDetecciones.map(d => d.deficiencia)
      ).size,
      confianza_promedio: confianzaPromedio,
      confianza_maxima: Math.max(
        ...todasLasDetecciones.map(d => d.confianza)
      ),
      por_tipo: porTipo
    },
    metadata: {
      dimensiones_imagen: { ancho: 640, alto: 640 },
      umbral_confianza: 0.5,
      umbral_iou: 0.45
    },
    es_valido: true,
    mensaje: 'Recomendaciones generadas localmente',
    tipo_alerta: 'warning',
    recomendaciones: recomendacionesTexto
  });
}

function generarRecomendacionesPorDeficiencia(deficiencia: string) {
  const recomendaciones: Record<string, {
    tratamiento_inmediato: string[];
    fertilizantes_recomendados: string[];
    medidas_preventivas: string[];
  }> = {
    Potasio: {
      tratamiento_inmediato: [
        'Aplicar foliarmente una solución de sulfato de potasio (K2SO4) al 2-3% o nitrato de potasio (KNO3) al 1-2% para una rápida absorción, especialmente en las regiones más afectadas.',
        'Realizar análisis de suelo y foliares en las zonas afectadas y adyacentes para confirmar la severidad de la deficiencia y los niveles de otros nutrientes.',
        'Podar ligeramente las ramas afectadas para estimular nuevo crecimiento y reducir la demanda de nutrientes en tejidos dañados.'
      ],
      fertilizantes_recomendados: [
        'Sulfato de Potasio (K2SO4) al 50% de K2O: 100-200 kg/ha, fraccionado en 2-3 aplicaciones anuales, incorporado al suelo alrededor de la zona de goteo.',
        'Cloruro de Potasio (KCl) al 60% de K2O: 80-150 kg/ha, fraccionado. Considerar su uso con precaución en suelos con riesgo de salinidad.',
        'Ceniza de madera (opción orgánica): 500-1000 kg/ha, incorporada al suelo, como fuente de potasio y micronutrientes, ajustando la dosis según pH del suelo.'
      ],
      medidas_preventivas: [
        'Establecer un programa de fertilización balanceado basado en análisis de suelo y foliares periódicos (cada 1-2 años) para mantener niveles óptimos de potasio y otros nutrientes.',
        'Mejorar la materia orgánica del suelo mediante la incorporación de compost, abonos verdes o mulching, lo que aumenta la capacidad de retención y disponibilidad de potasio.',
        'Asegurar un drenaje adecuado en el cacaotal para evitar la lixiviación de potasio, especialmente en suelos arenosos o con alta precipitación.',
        'Manejar adecuadamente la sombra en el cacaotal, ya que el exceso puede afectar negativamente la absorción de nutrientes y la eficiencia fotosintética.'
      ]
    },
    Nitrógeno: {
      tratamiento_inmediato: [
        'Aplicar fertilizante nitrogenado de liberación rápida como urea (46% N) al 1-2% vía foliar para una respuesta inmediata.',
        'Evaluar el sistema de sombra y manejo del suelo para identificar causas subyacentes de la deficiencia.',
        'Realizar análisis de suelo para determinar los niveles actuales de nitrógeno y materia orgánica.'
      ],
      fertilizantes_recomendados: [
        'Urea (46% N): 50-100 kg/ha fraccionado en 2-3 aplicaciones durante el ciclo de crecimiento.',
        'Sulfato de amonio (21% N): 100-200 kg/ha, especialmente recomendado en suelos alcalinos.',
        'Nitrato de amonio (33% N): 75-150 kg/ha, para una liberación equilibrada de nitrógeno.'
      ],
      medidas_preventivas: [
        'Incorporar abonos verdes y leguminosas de cobertura para fijar nitrógeno naturalmente en el sistema.',
        'Mantener una capa de mulch orgánico de 5-10 cm para mejorar la actividad microbiana del suelo.',
        'Implementar rotación de cultivos y asociación con plantas fijadoras de nitrógeno.',
        'Monitorear regularmente los niveles de materia orgánica del suelo y aplicar compost cuando sea necesario.'
      ]
    },
    Fósforo: {
      tratamiento_inmediato: [
        'Aplicar ácido fosfórico al 1% vía foliar para una absorción rápida en casos de deficiencia severa.',
        'Realizar análisis de pH del suelo, ya que el fósforo es menos disponible en suelos muy ácidos o alcalinos.',
        'Evaluar la presencia de micorrizas, que son cruciales para la absorción de fósforo en cacao.'
      ],
      fertilizantes_recomendados: [
        'Superfosfato triple (46% P2O5): 80-150 kg/ha, aplicado al suelo en banda o al voleo.',
        'Roca fosfórica (30% P2O5): 200-400 kg/ha, especialmente efectiva en suelos ácidos con actividad microbiana alta.',
        'MAP (Fosfato monoamónico, 52% P2O5, 11% N): 100-200 kg/ha, proporciona además nitrógeno.'
      ],
      medidas_preventivas: [
        'Mantener el pH del suelo entre 6.0-6.5 para optimizar la disponibilidad de fósforo.',
        'Inocular el suelo con hongos micorrízicos arbusculares para mejorar la absorción de fósforo.',
        'Incrementar la materia orgánica del suelo para favorecer la solubilización del fósforo.',
        'Evitar el exceso de encalado que puede fijar el fósforo en formas no disponibles.'
      ]
    }
  };

  return recomendaciones[deficiencia] || {
    tratamiento_inmediato: [
      `Consultar con un agrónomo especializado para el manejo de deficiencia de ${deficiencia}.`,
      'Realizar análisis foliares y de suelo para confirmar el diagnóstico.',
      'Implementar un programa de monitoreo nutricional.'
    ],
    fertilizantes_recomendados: [
      'Realizar análisis de suelo completo para determinar fertilizantes específicos necesarios.',
      'Consultar con un laboratorio certificado para recomendaciones personalizadas.'
    ],
    medidas_preventivas: [
      'Establecer un programa de fertilización balanceada basado en análisis periódicos.',
      'Mejorar las condiciones generales del suelo (pH, materia orgánica, drenaje).',
      'Implementar un sistema de monitoreo nutricional regular.'
    ]
  };
}
