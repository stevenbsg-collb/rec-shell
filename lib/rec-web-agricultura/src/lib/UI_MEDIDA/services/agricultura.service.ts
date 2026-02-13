import { InvokeApi } from '@rec-shell/rec-web-shared';
import { MedidaPreventiva } from '../../types/model';
import { MedidaPreventivaInput } from '../../types/dto';

const API_URL = `/agricultura/medidas-preventivas`;

export class ConexionService extends InvokeApi {
  
  async POST(medidaPreventiva: MedidaPreventivaInput): Promise<MedidaPreventiva> {
    const response = await this.post<MedidaPreventiva>(API_URL, medidaPreventiva);
    return response;
  }

  async GET_ID(id: number): Promise<MedidaPreventiva> {
    const response = await this.getById<MedidaPreventiva>(API_URL, id.toString());
    return response;
  }

  async GET(): Promise<MedidaPreventiva[]> {
    const response = await this.get<MedidaPreventiva[]>(API_URL);
    return response;
  }

  async GET_DEFICIENCIA(deficienciaId: number): Promise<MedidaPreventiva[]> {
    const response = await this.get<MedidaPreventiva[]>(`${API_URL}/deficiencia/${deficienciaId}`);
    return response;
  }

  async GET_STATE(): Promise<MedidaPreventiva[]> {
    const response = await this.get<MedidaPreventiva[]>(`${API_URL}/activas`);
    return response;
  }

  async GET_TYPE(tipoMedida: string): Promise<MedidaPreventiva[]> {
    const response = await this.get<MedidaPreventiva[]>(`${API_URL}/tipo/${encodeURIComponent(tipoMedida)}`);
    return response;
  }

  async GET_DEFINCIENCIA_ACTIVE(deficienciaId: number): Promise<MedidaPreventiva[]> {
    const response = await this.get<MedidaPreventiva[]>(`${API_URL}/deficiencia/${deficienciaId}/activas`);
    return response;
  }

  async GET_EFECT_MINIMA(efectividadMinima: number): Promise<MedidaPreventiva[]> {
    const response = await this.get<MedidaPreventiva[]>(`${API_URL}/efectividad-minima/${efectividadMinima}`);
    return response;
  }

  async PUT(id: number, medidaPreventiva: MedidaPreventivaInput): Promise<MedidaPreventiva> {
    const response = await this.put<MedidaPreventiva>(`${API_URL}/${id}`, medidaPreventiva);
    return response;
  }

  async DELETE(id: number): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }

  async IS_ACTIVE(id: number): Promise<MedidaPreventiva> {
    const response = await this.patch<MedidaPreventiva>(`${API_URL}/${id}/activar`);
    return response;
  }

  async IS_INACTIVE(id: number): Promise<MedidaPreventiva> {
    const response = await this.patch<MedidaPreventiva>(`${API_URL}/${id}/desactivar`);
    return response;
  }
}

export const service = new ConexionService();