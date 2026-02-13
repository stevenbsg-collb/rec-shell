interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  ancho: number;
  alto: number;
}

export interface Deteccion {
  deficiencia: string;
  confianza: number;
  bbox: BoundingBox;
  area: number;
}

export interface Estadisticas {
  total_detecciones: number;
  deficiencias_unicas: number;
  confianza_promedio: number;
  confianza_maxima: number;
  por_tipo: {
    [key: string]: number;
  };
}

interface Metadata {
  dimensiones_imagen: {
    ancho: number;
    alto: number;
  };
  umbral_confianza: number;
  umbral_iou: number;
}

export interface ResultDataYOLO {
  es_valido: boolean;
  mensaje: string;
  tipo_alerta: string;
  detecciones: Deteccion[];
  estadisticas: Estadisticas;
  metadata: Metadata;
  recomendaciones?: string[];
  imagen_procesada?: string; // base64 si usas /predict/visual
}

export interface APIResponse {
  success: boolean;
  data: ResultDataYOLO;
  archivo: string;
  timestamp: string;
}

export interface RecomendacionDetalle {
  tratamiento_inmediato: string[];
  fertilizantes_recomendados: string[];
  medidas_preventivas: string[];
}

export interface DeficienciaRecomendada {
  nombre: string;
  confianza: number;
  recomendaciones: RecomendacionDetalle;
}

export interface RecomendacionesIA {
  confianza_general: number;
  deficiencias: DeficienciaRecomendada[];
}


export interface AnalisisImagenYOLO_DTO {
  id? : number
  // Información general
  archivo: string;
  imagenBase64: string;
  fecha: string;
  
  // Resultados del análisis YOLO
  es_valido: boolean;
  mensaje: string;
  tipo_alerta: string;
  
  // Estadísticas generales
  estadisticas: EstadisticasDTO;
  
  // Detalle de cada detección
  detecciones: Deteccion[];
  
  // Recomendaciones de IA
  //recomendaciones: Record<string, any>;
  recomendaciones: RecomendacionesIA;
  nombreCultivo : string
  sector: string | null
  usuarioId? : string
  
  // Metadata opcional
  metadata?: {
    modelo: string;
    version: string;
    umbral_confianza: number;
    dimensiones_imagen: {
      ancho: number;
      alto: number;
    };
  };
}


export interface DeteccionDTO {
  region: number;                    // Número de región (1, 2, 3...)
  deficiencia: string;               // Nombre de la deficiencia
  confianza: number;                 // Confianza de esta detección específica
  ubicacion: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  area: number;                      // Área de la región en píxeles
}

interface EstadisticasDTO {
  total_detecciones: number;
  deficiencias_unicas: number;
  confianza_promedio: number;
  confianza_maxima: number;
  por_tipo: {
    [key: string]: number;           // Ej: { "Potasio": 2, "Nitrogeno": 1 }
  };
}



export interface EstadisticasYOLO {
  total_detecciones: number;
  deficiencias_unicas: number;
  confianza_promedio: number;
  confianza_maxima: number;
  por_tipo: Record<string, number>;
}

export interface MetadataYOLO {
  dimensiones_imagen: {
    ancho: number;
    alto: number;
  };
  umbral_confianza: number;
  umbral_iou: number;
}

export interface ResultDataYOLOConsolidado {
  detecciones: Deteccion[];
  estadisticas: EstadisticasYOLO;
  metadata: MetadataYOLO;
  es_valido: boolean;
  mensaje: string;
  tipo_alerta: 'warning';
}

export interface RecomendacionesGemini {
  confianza_general: number;
  deficiencias: {
    nombre: string;
    confianza: number;
    recomendaciones: {
      tratamiento_inmediato: string[];
      fertilizantes_recomendados: string[];
      medidas_preventivas: string[];
    };
  }[];
}

export interface ImagenAnalisis {
  id: string;
  file: File;
  previewUrl: string;
  base64: string;
  resultado: ResultDataYOLO | null;
  estado: 'pendiente' | 'analizando' | 'completado' | 'error';
  error?: string;

  /**
   * Metadata local extraída en el navegador (sin depender del backend).
   * Sirve para mostrar datos del archivo inmediatamente al cargar.
   */
  metadataArchivo?: {
    tipoMime: string;
    tamanioBytes: number;
    ultimaModificacionISO: string;
    dimensiones?: {
      ancho: number;
      alto: number;
    };

    /**
     * Ubicación GPS tomada del EXIF (si la foto la incluye).
     * Solo suele venir en imágenes JPEG capturadas con cámara/celular.
     */
    gps?: {
      latitude: number;
      longitude: number;
      altitude?: number;
    };
  };
}

export function construirAnalisisDTO(
  resultado: ResultDataYOLO | null,
  file: File,
  imagenBase64: string,
  //recomendacionesGlobal: Record<string, any>
  recomendacionesGlobal: RecomendacionesIA,
  nombreCultivo : string,
  sector: string | null,
  usuarioId: string | undefined
): AnalisisImagenYOLO_DTO {

  // Fecha actual (local) en ISO con zona horaria (evita desfases tipo 19:00 fijo)
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");

  const tz = -now.getTimezoneOffset(); // minutos respecto a UTC
  const sign = tz >= 0 ? "+" : "-";
  const hh = pad(Math.floor(Math.abs(tz) / 60));
  const mm = pad(Math.abs(tz) % 60);

  const fecha =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.` +
    `${String(now.getMilliseconds()).padStart(3, "0")}${sign}${hh}:${mm}`;


  // Si no hay resultado válido, devolvemos un DTO mínimo controlado
  if (!resultado || !resultado) {
    return {
      archivo: file.name,
      imagenBase64,
      fecha,
      es_valido: false,
      mensaje: 'No se pudo analizar la imagen',
      tipo_alerta: 'error',
      estadisticas: {
        total_detecciones: 0,
        deficiencias_unicas: 0,
        confianza_promedio: 0,
        confianza_maxima: 0,
        por_tipo: {},
      },
      detecciones: [],
      recomendaciones: recomendacionesGlobal ?? {},
      nombreCultivo: nombreCultivo,
      sector: sector
    };
  }

  const data = resultado;


  // 🔹 Mapear detecciones a DeteccionDTO
  const deteccionesDTO: Deteccion[] = data.detecciones.map(
  (det, index) => ({
    region: index + 1,
    deficiencia: det.deficiencia,
    confianza: det.confianza,
    bbox: {
      x1: det.bbox.x1,
      y1: det.bbox.y1,
      x2: det.bbox.x2,
      y2: det.bbox.y2,
      ancho: det.bbox.ancho,
      alto: det.bbox.alto
    },
    area: det.area,
  })
);


  // 🔹 Construir DTO final
  const analisisDTO: AnalisisImagenYOLO_DTO = {
    archivo: file.name,
    imagenBase64,
    fecha,

    // Resultado YOLO
    es_valido: data.es_valido,
    mensaje: data.mensaje,
    tipo_alerta: data.tipo_alerta,

    // Estadísticas
    estadisticas: {
      total_detecciones: data.estadisticas.total_detecciones,
      deficiencias_unicas: data.estadisticas.deficiencias_unicas,
      confianza_promedio: data.estadisticas.confianza_promedio,
      confianza_maxima: data.estadisticas.confianza_maxima,
      por_tipo: data.estadisticas.por_tipo,
    },

    // Detecciones
    detecciones: deteccionesDTO,

    // Recomendaciones IA (Gemini)
    recomendaciones: recomendacionesGlobal ?? {},
    nombreCultivo: nombreCultivo,
    sector: sector,
    usuarioId: usuarioId,
    // Metadata opcional
    metadata: data.metadata
      ? {
          modelo: 'YOLO',
          version: 'v1',
          umbral_confianza: data.metadata.umbral_confianza,
          dimensiones_imagen: {
            ancho: data.metadata.dimensiones_imagen.ancho,
            alto: data.metadata.dimensiones_imagen.alto,
          },
        }
      : undefined,
  };

  return analisisDTO;
}

