import { InvokeApi } from '@rec-shell/rec-web-shared';
import { ParametroMonitoreo } from '../../types/model';

const API_URL = `/agricultura/parametros-monitoreo`;

export class ConexionService extends InvokeApi {
  
  async POST(parametroMonitoreo: Omit<ParametroMonitoreo, 'id'>): Promise<ParametroMonitoreo> {
    const response = await this.post<ParametroMonitoreo>(API_URL, parametroMonitoreo);
    return response;
  }

  async GET_ID(id: string): Promise<ParametroMonitoreo> {
    const response = await this.getById<ParametroMonitoreo>(API_URL, id);
    return response;
  }

  async GET(): Promise<ParametroMonitoreo[]> {
    const response = await this.get<ParametroMonitoreo[]>(API_URL);
    return response;
  }

  async GET_BY_CULTIVO(cultivoId: string): Promise<ParametroMonitoreo[]> {
    const response = await this.get<ParametroMonitoreo[]>(`${API_URL}/cultivo/${cultivoId}`);
    return response;
  }

  async GET_BY_FUENTE(fuenteDatos: string): Promise<ParametroMonitoreo[]> {
    const response = await this.get<ParametroMonitoreo[]>(
      `${API_URL}/fuente/${encodeURIComponent(fuenteDatos)}`
    );
    return response;
  }

  async GET_BY_CULTIVO_ORDERED(cultivoId: string): Promise<ParametroMonitoreo[]> {
    const response = await this.get<ParametroMonitoreo[]>(`${API_URL}/cultivo/${cultivoId}/ordenados`);
    return response;
  }

  async GET_BY_RANGOS_DATE(cultivoId: string,fechaInicio: string,fechaFin: string): Promise<ParametroMonitoreo[]> {
    const params = new URLSearchParams({
      fechaInicio: fechaInicio,
      fechaFin: fechaFin
    });
    const response = await this.get<ParametroMonitoreo[]>(
      `${API_URL}/cultivo/${cultivoId}/rango-fechas?${params.toString()}`
    );
    return response;
  }

  async GET_TEMPERATURA_PROMEDIO(cultivoId: string,fechaInicio: string): Promise<number> {
    const params = new URLSearchParams({
      fechaInicio: fechaInicio
    });
    const response = await this.get<number>(
      `${API_URL}/cultivo/${cultivoId}/temperatura-promedio?${params.toString()}`
    );
    return response;
  }

  async PUT(id: string, parametroMonitoreo: Omit<ParametroMonitoreo, 'id'>): Promise<ParametroMonitoreo> {
    const response = await this.put<ParametroMonitoreo>(`${API_URL}/${id}`, parametroMonitoreo);
    return response;
  }

  async DELETE(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }
}

export const service = new ConexionService();