import { InvokeApi } from '@rec-shell/rec-web-shared';
import { ActividadSeguimiento } from '../../types/model';
import { EstadoActividad } from '../../enums/Enums';

const API_URL = `/agricultura/actividades-seguimiento`;

export class ConexionService extends InvokeApi {

  async POST(actividadSeguimiento: ActividadSeguimiento): Promise<ActividadSeguimiento> {
    const response = await this.post<ActividadSeguimiento>(API_URL, actividadSeguimiento);
    return response;
  }

   async PUT(id: string, actividadSeguimiento: ActividadSeguimiento): Promise<ActividadSeguimiento> {
    const response = await this.put<ActividadSeguimiento>(`${API_URL}/${id}`, actividadSeguimiento);
    return response;
  }

  async DELETE(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }

  async GET_ID(id: string): Promise<ActividadSeguimiento> {
    const response = await this.getById<ActividadSeguimiento>(API_URL, id);
    return response;
  }

  async GET(): Promise<ActividadSeguimiento[]> {
    const response = await this.get<ActividadSeguimiento[]>(API_URL);
    console.log('response', response);
    return response;
  }

  async GET_PLAN(planId: string): Promise<ActividadSeguimiento[]> {
    const response = await this.get<ActividadSeguimiento[]>(`${API_URL}/plan/${planId}`);
    return response;
  }

  async GET_STATE(estado: EstadoActividad): Promise<ActividadSeguimiento[]> {
    const response = await this.get<ActividadSeguimiento[]>(`${API_URL}/estado/${estado}`);
    return response;
  }

  async GET_DATE(fecha: string): Promise<ActividadSeguimiento[]> {
    const response = await this.get<ActividadSeguimiento[]>(`${API_URL}/fecha/${fecha}`);
    return response;
  }

  async GET_ACTIVITY_BY_USER(usuarioId: string): Promise<ActividadSeguimiento[]> {
    const response = await this.get<ActividadSeguimiento[]>(`${API_URL}/usuario/${usuarioId}`);
    return response;
  }

  async GET_VENCIDAS(fecha?: string): Promise<ActividadSeguimiento[]> {
    const url = fecha ? `${API_URL}/vencidas?fecha=${fecha}` : `${API_URL}/vencidas`;
    const response = await this.get<ActividadSeguimiento[]>(url);
    return response;
  }

  async GET_RECORDATORY(fecha?: string): Promise<ActividadSeguimiento[]> {
    const url = fecha ? `${API_URL}/recordatorios?fecha=${fecha}` : `${API_URL}/recordatorios`;
    const response = await this.get<ActividadSeguimiento[]>(url);
    return response;
  }

  async GET_EJECUTADAS(planId: string): Promise<number> {
    const response = await this.get<number>(`${API_URL}/plan/${planId}/count-ejecutadas`);
    return response;
  }
}

export const service = new ConexionService();