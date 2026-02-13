
// ========== DTO Principal del Dashboard ==========
export interface DashboardResumenDTO {
  estadisticasGenerales: EstadisticasGeneralesDTO;
  cultivosActivos: CultivoResumenDTO[];
  alertasRecientes: AlertaDTO[];
  proximasActividades: ProximaActividadDTO[];
  estadisticasDeficiencias: EstadisticasDeficienciasDTO;
  estadisticasTratamientos: EstadisticasTratamientosDTO;
}

// ========== Estadísticas Generales ==========
export interface EstadisticasGeneralesDTO {
  totalCultivos: number;
  cultivosActivos: number;
  areaTotal: number; // BigDecimal en Java
  totalAnalisis: number;
  analisisMesActual: number;
  deficienciasDetectadas: number;
  tratamientosActivos: number;
  actividadesPendientes: number;
  costoTotalTratamientos: number; // BigDecimal en Java
}

// ========== Resumen de Cultivo ==========
export interface CultivoResumenDTO {
  id: number;
  nombreCultivo: string;
  variedadCacao: string;
  areaHectareas: number; // BigDecimal en Java
  estadoCultivo: string;
  ubicacionNombre: string;
  analisisRealizados: number;
  deficienciasActivas: number;
  ultimoAnalisis: string; // LocalDateTime en Java
  saludGeneral: string; // BUENA, REGULAR, CRITICA
  parametrosActuales: ParametrosActualesDTO;
}

// ========== Parámetros Actuales del Cultivo ==========
export interface ParametrosActualesDTO {
  temperatura: number; // BigDecimal en Java
  humedadSuelo: number; // BigDecimal en Java
  phSuelo: number; // BigDecimal en Java
  horasSol: number; // BigDecimal en Java
  fechaMedicion: string; // LocalDateTime en Java
}

// ========== Alertas ==========
export interface AlertaDTO {
  id: number;
  tipo: string; // DEFICIENCIA, TRATAMIENTO, PARAMETRO, ACTIVIDAD
  severidad: string; // ALTA, MEDIA, BAJA
  mensaje: string;
  cultivoNombre: string;
  cultivoId: number;
  fechaGeneracion: string; // LocalDateTime en Java
  leida: boolean;
}

// ========== Próximas Actividades ==========
export interface ProximaActividadDTO {
  id: number;
  nombreActividad: string;
  descripcion: string;
  fechaProgramada: string; // LocalDateTime en Java
  estado: string;
  prioridad: string;
  cultivoNombre: string;
  cultivoId: number;
  costoReal: number; // BigDecimal en Java
  responsable: string;
  diasRestantes: number;
}

// ========== Estadísticas de Deficiencias ==========
export interface EstadisticasDeficienciasDTO {
  totalDeficienciasDetectadas: number;
  deficienciasMasFrecuentes: DeficienciaFrecuenteDTO[];
  tendenciaMensual: DeficienciaPorMesDTO[];
  promedioConfianza: number; // BigDecimal en Java
}

export interface DeficienciaFrecuenteDTO {
  nombreDeficiencia: string;
  nutrienteDeficiente: string;
  cantidadDetecciones: number;
  porcentaje: number; // BigDecimal en Java
}

export interface DeficienciaPorMesDTO {
  mes: number;
  anio: number;
  cantidad: number;
  nombreMes: string;
}

// ========== Estadísticas de Tratamientos ==========
export interface EstadisticasTratamientosDTO {
  totalTratamientos: number;
  tratamientosCompletados: number;
  tratamientosPendientes: number;
  tratamientosEnProceso: number;
  costoTotal: number; // BigDecimal en Java
  costoPromedio: number; // BigDecimal en Java
  tratamientosPorTipo: TratamientoPorTipoDTO[];
}

export interface TratamientoPorTipoDTO {
  tipoTratamiento: string;
  cantidad: number;
  costoTotal: number; // BigDecimal en Java
}

// ========== Detalle de Cultivo para Dashboard ==========
export interface CultivoDetalleDTO {
  id: number;
  nombreCultivo: string;
  variedadCacao: string;
  areaHectareas: number; // BigDecimal en Java
  estadoCultivo: string;
  ubicacionNombre: string;
  analisisRecientes: AnalisisRecienteDTO[];
  deficienciasActivas: DeficienciaActivaDTO[];
  tratamientosActivos: TratamientoActivoDTO[];
  parametrosHistorico: ParametrosHistoricoDTO;
}

export interface AnalisisRecienteDTO {
  id: number;
  fechaAnalisis: string; // LocalDateTime en Java
  nombreImagen: string;
  deficienciasDetectadas: number;
  confianzaPromedio: number; // BigDecimal en Java
  estadoProcesamiento: string;
}

export interface DeficienciaActivaDTO {
  resultadoId: number;
  nombreDeficiencia: string;
  nutrienteDeficiente: string;
  severidad: string;
  confianza: number; // BigDecimal en Java
  fechaDeteccion: string; // LocalDateTime en Java
  tieneTratamiento: boolean;
}

export interface TratamientoActivoDTO {
  planId: number;
  nombreTratamiento: string;
  tipoTratamiento: string;
  estado: string;
  prioridad: string;
  fechaInicio: string; // LocalDateTime en Java
  duracionDias: number;
  progreso: number; // BigDecimal en Java
  actividadesPendientes: number;
}

export interface ParametrosHistoricoDTO {
  temperatura: MedicionParametroDTO[];
  humedadSuelo: MedicionParametroDTO[];
  phSuelo: MedicionParametroDTO[];
  precipitacion: MedicionParametroDTO[];
}

export interface MedicionParametroDTO {
  fecha: string; // LocalDateTime en Java
  valor: number; // BigDecimal en Java
}

// ========== DTO para Filtros de Dashboard ==========
export interface DashboardFiltroDTO {
  fechaInicio: string; // LocalDateTime en Java
  fechaFin: string; // LocalDateTime en Java
  cultivoIds: number[];
  estadoCultivo: string;
  severidadMinima: string;
}

/*
export interface Alerta {
  id: string | number;
  tipo: 'DEFICIENCIA' | 'ACTIVIDAD';
  severidad: 'ALTA' | 'MEDIA' | 'BAJA';
  mensaje: string;
  cultivoNombre: string;
  leida: boolean;
}
*/


export interface ParametrosActuales {
  temperatura?: number;
  humedadSuelo?: number;
  phSuelo?: number;
  horasSol?: number;
}

export interface Cultivo {
  id: string | number;
  nombreCultivo: string;
  variedadCacao: string;
  estadoCultivo: 'ACTIVO' | 'INACTIVO';
  saludGeneral: 'BUENA' | 'REGULAR' | 'CRITICA';
  areaHectareas: number;
  ubicacionNombre: string;
  parametrosActuales?: ParametrosActuales;
  analisisRealizados: number;
  deficienciasActivas: number;
}

