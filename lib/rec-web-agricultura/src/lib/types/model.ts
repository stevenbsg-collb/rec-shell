import { EstadoActividad, EstadoAlerta, EstadoCultivo, EstadoImplementacion, EstadoPlan, EstadoProcesamiento, EstadoReporte, Prioridad, Severidad, SeveridadAlerta } from "../enums/Enums";
import { User } from '@rec-shell/rec-web-usuario';

export interface ActividadSeguimiento {
  id: string;
  planTratamiento: PlanTratamiento;
  nombreActividad: string;
  descripcion?: string;
  fechaProgramada: string; 
  fechaEjecutada?: string; 
  estado: EstadoActividad;
  resultadoActividad?: string;
  costoReal?: number;
  responsable?: string;
  recordatorioEnviado: boolean;
  fechaCreacion?: string; 
  planTratamientoId: string;
}

export interface AlertaMonitoreo {
  id: string;
  cultivo: Cultivo;
  usuario: User;
  tipoAlerta: string;
  parametroAfectado?: string;
  valorActual?: number;
  valorUmbral?: number;
  severidad: SeveridadAlerta;
  mensajeAlerta: string;
  estado: EstadoAlerta;
  fechaCreacion?: string; 
  fechaResolucion?: string; 
}


export interface AnalisisImagen {
  id: string;
  cultivo: Cultivo;
  usuario: User;
  nombreImagen: string;
  rutaImagenOriginal: string;
  rutaImagenProcesada?: string;
  fechaAnalisis?: string; 
  estadoProcesamiento: EstadoProcesamiento;
  tiempoProcesamintoSegundos?: number;
  metadatosImagen?: string; // JSON string
  ubicacionEspecifica?: string;
  condicionesClima?: string;
  notasUsuario?: string;
  
  // Relaciones
  resultadosDiagnostico?: ResultadoDiagnostico[];
}


export interface Cultivo {
  id: string;
  usuarioId: string;
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
  estadoCultivo: EstadoCultivo;
  notas?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;

  analisisImagenes?: AnalisisImagen[];
  parametrosMonitoreo?: ParametroMonitoreo[];
  alertasMonitoreo?: AlertaMonitoreo[];
  cultivoMedidasPreventivas?: CultivoMedidaPreventiva[];
  reportesGenerados?: ReporteGenerado[];
}


export interface CultivoMedidaPreventiva {
  id: string;
  cultivo: Cultivo;
  medidaPreventiva: MedidaPreventiva;
  fechaImplementacion?: string; 
  estado: EstadoImplementacion;
  notas?: string;
  fechaCreacion?: string; 
}


export interface DeficienciaNutriente {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  sintomasVisuales?: string;
  nutrienteDeficiente?: string;
  activo: boolean;
  
  // Relaciones
  tratamientos?: Tratamiento[];
  resultadosDiagnostico?: ResultadoDiagnostico[];
  medidasPreventivas?: MedidaPreventiva[];
}


export interface MedidaPreventiva {
  id: number;
  deficienciaNutriente?: DeficienciaNutriente;
  titulo: string;
  descripcion: string;
  tipoMedida?: string;
  frecuenciaRecomendada?: string;
  temporadaAplicacion?: string;
  costoEstimado?: number;
  efectividadPorcentaje?: number;
  activo: boolean;
  
  // Relaciones
  cultivoMedidasPreventivas?: CultivoMedidaPreventiva[];
}


export interface ParametroMonitoreo {
  id: string;
  cultivo: Cultivo;
  fechaMedicion?: string; 
  humedadSuelo?: number;
  humedadAmbiente?: number;
  temperatura?: number;
  phSuelo?: number;
  precipitacionMm?: number;
  horasSol?: number;
  velocidadVientoKmh?: number;
  fuenteDatos: string;
  coordenadasGps?: string;

  nombreCultivo?: string; //crear un dto
  ubicacionNombre?: string;
  cultivoId?: string;
}


export interface PlanTratamiento {
  id: string;
  resultadoDiagnostico: ResultadoDiagnostico;
  tratamiento?: Tratamiento;
  fechaInicioSugerida?: string; 
  duracionDias?: number;
  prioridad: Prioridad;
  estado: EstadoPlan;
  costoEstimado?: number;
  instruccionesDetalladas?: string;
  fechaCreacion?: string; 
  
  // Relaciones
  actividadesSeguimiento?: ActividadSeguimiento[];
  nombreTratamiento?: string;
}

export interface ReporteGenerado {
  id: string;
  usuario: User;
  cultivo?: Cultivo;
  tipoReporte: string;
  periodoInicio?: string; 
  periodoFin?: string; 
  parametrosReporte?: string; // JSON string
  rutaArchivo?: string;
  formato?: string;
  estado: EstadoReporte;
  fechaGeneracion?: string; 
  fechaDescarga?: string; 
}


export interface ResultadoDiagnostico {
  id: string;
  analisisImagen: AnalisisImagen;
  deficienciaNutriente?: DeficienciaNutriente;
  confianzaPrediccion: number;
  severidad?: Severidad;
  areasAfectadas?: string; // JSON string
  diagnosticoPrincipal: boolean;
  observacionesIa?: string;
  fechaResultado?: string; 
  
  // Relaciones
  planesTratamiento?: PlanTratamiento[];
}


export interface Tratamiento {
  id: number;
  deficienciaNutriente?: DeficienciaNutriente;
  nombreTratamiento: string;
  tipoTratamiento?: string;
  descripcion?: string;
  dosisRecomendada?: string;
  frecuenciaAplicacion?: string;
  tiempoEfectividadDias?: number;
  costoEstimadoPorHectarea?: number;
  activo: boolean;
  
  // Relaciones
  planesTratamiento?: PlanTratamiento[];
}

export interface CultivoFilters extends Partial<Cultivo> {
  usuarioId?: string;
  estadoCultivo?: EstadoCultivo;
  variedadCacao?: string;
}

export interface AnalisisImagenMCHL {
    id?: number;
    success: boolean;
    data: {
        deficiencia: string;
        confianza: number;
        probabilidades: {
            Potasio: number;
            Nitrogeno: number;
            Fosforo: number;
        };
    };
    archivo: string;
    imagenBase64: string;
    fecha: string;
    recomendaciones: Record<string, any>;
}