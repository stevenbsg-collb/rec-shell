import { InvokeApi } from '@rec-shell/rec-web-shared';
import { DeficienciaNutriente } from '../../types/model';
import { DeficienciaNutrienteInput } from '../../types/dto';

const API_URL = `/agricultura/deficiencias-nutrientes`;

export class ConexionService extends InvokeApi {

  async POST(deficiencia: DeficienciaNutrienteInput): Promise<DeficienciaNutriente> {
    const response = await this.post<DeficienciaNutriente>(API_URL, deficiencia);
    return response;
  }

  async GET_ID(id: string): Promise<DeficienciaNutriente> {
    const response = await this.getById<DeficienciaNutriente>(API_URL, id);
    return response;
  }

  async GET_BY_CODE(codigo: string): Promise<DeficienciaNutriente> {
    const response = await this.get<DeficienciaNutriente>(`${API_URL}/codigo/${encodeURIComponent(codigo)}`);
    return response;
  }

  async GET(): Promise<DeficienciaNutriente[]> {
    const response = await this.get<DeficienciaNutriente[]>(API_URL);
    return response;
  }

  async GET_STATE(): Promise<DeficienciaNutriente[]> {
    const response = await this.get<DeficienciaNutriente[]>(`${API_URL}/activas`);
    return response;
  }

  async GET_NUTRIENTES(nutrienteDeficiente: string): Promise<DeficienciaNutriente[]> {
    const response = await this.get<DeficienciaNutriente[]>(
      `${API_URL}/nutriente/${encodeURIComponent(nutrienteDeficiente)}`
    );
    return response;
  }

  async GET_STATE_ORDERED(): Promise<DeficienciaNutriente[]> {
    const response = await this.get<DeficienciaNutriente[]>(`${API_URL}/activas-ordenadas`);
    return response;
  }

  async COUNT_ACTIVE(): Promise<number> {
    const response = await this.get<number>(`${API_URL}/count-activas`);
    return response;
  }

  async PUT(id: string, deficiencia: DeficienciaNutrienteInput): Promise<DeficienciaNutriente> {
    const response = await this.put<DeficienciaNutriente>(`${API_URL}/${id}`, deficiencia);
    return response;
  }

  async DELETE(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }

  async IS_ACTIVE(id: string): Promise<DeficienciaNutriente> {
    const response = await this.patch<DeficienciaNutriente>(`${API_URL}/${id}/activar`);
    return response;
  }

  async IS_INACTIVE(id: string): Promise<DeficienciaNutriente> {
    const response = await this.patch<DeficienciaNutriente>(`${API_URL}/${id}/desactivar`);
    return response;
  }
}

export const service = new ConexionService();