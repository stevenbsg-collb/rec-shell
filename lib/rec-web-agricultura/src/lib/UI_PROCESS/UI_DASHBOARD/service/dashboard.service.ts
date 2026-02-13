import { InvokeApi } from '@rec-shell/rec-web-shared';
import { DashboardResumenDTO, EstadisticasGeneralesDTO, CultivoResumenDTO, CultivoDetalleDTO, AlertaDTO, ProximaActividadDTO, EstadisticasDeficienciasDTO, EstadisticasTratamientosDTO } from '../dto/dto';


const API_URL = `/agricultura/dashobard`;

export class ConexionService extends InvokeApi {

  async GET_RESUMEN(
    fechaInicio: string,
    fechaFin: string,
    cultivoIds: number[],
    estadoCultivo: string,
    severidadMinima: string
  ): Promise<DashboardResumenDTO> {
    const params = new URLSearchParams();
    params.append('fechaInicio', fechaInicio.replace('Z', ''));
    params.append('fechaFin', fechaFin.replace('Z', ''));
    cultivoIds.forEach(id => params.append('cultivoIds', id.toString()));
    params.append('estadoCultivo', estadoCultivo);
    params.append('severidadMinima', severidadMinima);
    
    const response = await this.get<DashboardResumenDTO>(`${API_URL}/resumen?${params.toString()}`);
    console.log('response', response);

    return response;
  }

  async GET_ESTADISTICAS_GENERALES(
    fechaInicio: string,
    fechaFin: string
  ): Promise<EstadisticasGeneralesDTO> {
    const params = new URLSearchParams();
    params.append('fechaInicio', fechaInicio.replace('Z', ''));
    params.append('fechaFin', fechaFin.replace('Z', ''));
    
    const response = await this.get<EstadisticasGeneralesDTO>(`${API_URL}/estadisticas/generales?${params.toString()}`);
    return response;
  }

  async GET_CULTIVOS_ACTIVOS(cultivoIds: number[]): Promise<CultivoResumenDTO[]> {
    const params = new URLSearchParams();
    cultivoIds.forEach(id => params.append('cultivoIds', id.toString()));
    
    const response = await this.get<CultivoResumenDTO[]>(`${API_URL}/cultivos/activos?${params.toString()}`);
    return response;
  }

  async GET_DETALLE_CULTIVO(id: number): Promise<CultivoDetalleDTO> {
    const response = await this.get<CultivoDetalleDTO>(`${API_URL}/cultivos/${id}/detalle`);
    return response;
  }

  async GET_ALERTAS(
    tipo: string,
    severidad: string,
    soloNoLeidas: boolean
  ): Promise<AlertaDTO[]> {
    const params = new URLSearchParams();
    params.append('tipo', tipo);
    params.append('severidad', severidad);
    params.append('soloNoLeidas', soloNoLeidas.toString());
    
    const response = await this.get<AlertaDTO[]>(`${API_URL}/alertas?${params.toString()}`);
    return response;
  }

  async GET_PROXIMAS_ACTIVIDADES(
    dias = 30,
    soloPrioridadAlta: boolean
  ): Promise<ProximaActividadDTO[]> {
    const params = new URLSearchParams();
    params.append('dias', dias.toString());
    params.append('soloPrioridadAlta', soloPrioridadAlta.toString());
    
    const response = await this.get<ProximaActividadDTO[]>(`${API_URL}/actividades/proximas?${params.toString()}`);
    return response;
  }

  async GET_ESTADISTICAS_DEFICIENCIAS(
    fechaInicio: string,
    fechaFin: string
  ): Promise<EstadisticasDeficienciasDTO> {
    const params = new URLSearchParams();
    params.append('fechaInicio', fechaInicio.replace('Z', ''));
    params.append('fechaFin', fechaFin.replace('Z', ''));
    
    const response = await this.get<EstadisticasDeficienciasDTO>(`${API_URL}/estadisticas/deficiencias?${params.toString()}`);
    return response;
  }

  async GET_ESTADISTICAS_TRATAMIENTOS(
    fechaInicio: string,
    fechaFin: string
  ): Promise<EstadisticasTratamientosDTO> {
    const params = new URLSearchParams();
    params.append('fechaInicio', fechaInicio.replace('Z', ''));
    params.append('fechaFin', fechaFin.replace('Z', ''));
    
    const response = await this.get<EstadisticasTratamientosDTO>(`${API_URL}/estadisticas/tratamientos?${params.toString()}`);
    return response;
  }
}

export const service = new ConexionService();