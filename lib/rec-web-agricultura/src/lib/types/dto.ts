import { Severidad } from "../enums/Enums";
import { Cultivo } from "./model";

export interface UseCultivosState {
  cultivos: Cultivo[];
  cultivo: Cultivo | null;
  loading: boolean;
  error: string | null;
  areaTotalActiva: number | null;
}

export interface CultivoFormData {
  nombreCultivo: string;
  variedadCacao?: string;
  fechaSiembra: string;
  areaHectareas?: number;
  ubicacionNombre?: string;
  latitud: number;
  longitud: number;
  altitud?: number;
  tipoSuelo?: string;
  sistemaRiego?: string;
  estadoCultivo: string;
  notas?: string;
}

export interface MedidaPreventivaInput {
  deficienciaNutrienteId?: number;
  titulo: string;
  descripcion: string;
  tipoMedida?: string;
  frecuenciaRecomendada?: string;
  temporadaAplicacion?: string;
  costoEstimado?: number;
  efectividadPorcentaje?: number;
  activo: boolean;
}

export interface DeficienciaNutrienteInput {
  codigo: string;
  nombre: string;
  descripcion?: string;
  sintomasVisuales?: string;
  nutrienteDeficiente?: string;
  activo: boolean;
}

export interface CaracteristicasDetectadas {
  color_principal: string;
  manchas: string;
  borde: string;
  textura: string;
  deformaciones: boolean;
}

export interface CacaoAnalysisResult {
  estado_general: string;
  probabilidad: number;
  caracteristicas_detectadas: CaracteristicasDetectadas;
  posible_enfermedad: string;
}

export interface GuardarAnalisisParams {
  cultivoId: number;
  usuarioId: string;
  deficiencia_Id: number;
  severidad: string;
  nombreImagen: string;
  rutaImagenOriginal: string;
  rutaImagenProcesada?: string;
  tiempoProcesamiento: number;
  metadatosImagen: Record<string, any>;
  ubicacionEspecifica?: string;
  condicionesClima?: string;
  notasUsuario?: string;
  //resultado: CacaoAnalysisResult;
  confianzaPrediccion: number;
  diagnosticoPrincipal: boolean;
  observacionesIa: string;
  areasAfectadas: Record<string, any>;
}

export interface AnalisisImagenDTO {
  cultivoId: number;
  usuarioId: string;
  deficiencia_Id: number;
  severidad: string;
  nombreImagen: string;
  rutaImagenOriginal: string;
  rutaImagenProcesada?: string;
  fechaAnalisis: string;
  estadoProcesamiento: string;
  tiempoProcesamintoSegundos: number;
  metadatosImagen:  Record<string, any>;
  ubicacionEspecifica?: string;
  condicionesClima?: string;
  notasUsuario?: string;

  confianzaPrediccion: number;
  diagnosticoPrincipal: boolean;
  observacionesIa: string;
  areasAfectadas: Record<string, any>;
}

export interface ResultadoDiagnosticoDTO {
  confianzaPrediccion: number;
  diagnosticoPrincipal: boolean;
  deficienciaDetectadaId?: number;
  severidad: string;
  areasAfectadas: string;
  observacionesIa: string;
  fechaResultado: string;
}


export  interface MetadatosImagen {
  tipo?: string;
  resolucion?: string;
  tamanoBytes?: number;
  fechaCaptura?: string;
}

export interface AnalisisResponse {
  id: number;
  cultivoId: number;
  nombreCultivo: string;
  deficienciaId?: number;
  usuarioId: number;
  nombreImagen: string;
  rutaImagenOriginal: string;
  rutaImagenProcesada?: string | null;
  fechaAnalisis: string;
  estadoProcesamiento: string;
  tiempoProcesamintoSegundos?: number;
  metadatosImagen?: MetadatosImagen;
  ubicacionEspecifica?: string;
  condicionesClima?: string;
  notasUsuario?: string;
  confianzaPrediccion?: number;
  diagnosticoPrincipal?: string;
  observacionesIa?: string;
  areasAfectadas?: any;
  severidad?: string;
}

export interface ResultadoDetalle {
  id: number;
  analisisId: number;
  deficienciaDetectadaId: number;
  nombreDeficiencia: string;
  nutrienteFaltante: string;
  confianzaPrediccion: number;
  severidad: string;
  areasAfectadas: {
    estado: string;
    caracteristicas: {
      borde: string;
      manchas: string;
      textura: string;
      deformaciones: boolean;
      color_principal: string;
    };
  };
  diagnosticoPrincipal: boolean;
  observacionesIa: string;
  fechaResultado: string;
}


export interface GenerarPlanRequest {
  cultivoId: number;
  id: number;
}

export interface ActividadSeguimientoResponse {
  id: number;
  fechaProgramada: string;
  descripcion: string;
  estado: string;
  fechaEjecutada: string | null;
  resultadoActividad: string | null;
  costoReal: number | null;
  responsable: string | null;
  recordatorioEnviado: boolean | null;
}

export interface PlanGeneradoResponse {
  id: number;
  costoEstimado: number;
  duracionDias: number;
  fechaInicioSugerida: string;
  fechaCreacion: string;
  estado: string;
  instruccionesDetalladas: string;
  prioridad: string;
  resultadoDiagnosticoId: number;
  tratamientoId: number;
  actividadesSeguimiento: ActividadSeguimientoResponse[];
}

export interface AnalisisImagenMCHLDTO {
    id?: number;
    deficiencia: string;
    confianza: number;
    probabilidades: {
        Potasio: number;
        Nitrogeno: number;
        Fosforo: number;
    };
    archivo: string;
    imagenBase64: string;
    fecha: string;
    recomendaciones: Record<string, any>;
}

// types/planTratamiento.types.ts

/**
 * Interface para el plan de aplicación
 */
export interface PlanAplicacion {
  tipo: string;
  dosisPorLitro: string;
  volumenPorHectareaEstimado_L: number;
  dosisPorHectareaEstimada: string;
  frecuenciaDias: number;
  numeroAplicaciones: number;
  duracionTratamientoDias: number;
  horaRecomendada: string;
  precauciones: string;
}

/**
 * Interface para el tratamiento de suelo
 */
export interface TratamientoSuelo {
  accion: string;
  productoSugerido: string;
  dosisOrientativa: string;
  metodo: string;
}

/**
 * Interface para el seguimiento
 */
export interface Seguimiento {
  observableMejora: string | null;
  notasTecnico: string;
  imagenesSeguimiento: string[];
}

/**
 * Interface completa para la respuesta del plan de tratamiento de Gemini
 */
export interface PlanTratamientoResponse {
  tratamiento: string;
  planAplicacion: PlanAplicacion;
  tratamientoSuelo: TratamientoSuelo;
  seguimiento: Seguimiento;
}

/**
 * Interface para el request que se enviará al backend
 */
export interface GenerarPlanAnalisisRequest {
  analisisId?: number;
  usuarioId?: string;
  planTratamiento: PlanTratamientoResponse;
}

/**
 * Interface para la respuesta del backend
 */
export interface GenerarPlanBackendResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    analisisId: number;
    planTratamiento: PlanTratamientoResponse;
    fechaCreacion: string;
  };
  error?: string;
}

/**
 * Interface para errores de la API
 */
export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

export interface PlanTratamientoNuevo {
  id: number;
  analisisId: number;
  usuarioId: string;
  planTratamiento: {
    tratamiento: string;
    seguimiento: {
      observableMejora: string;
      notasTecnico: string;
      imagenesSeguimiento: string[];
    };
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
  };
  fechaCreacion: string;
  fechaActualizacion: string;
}