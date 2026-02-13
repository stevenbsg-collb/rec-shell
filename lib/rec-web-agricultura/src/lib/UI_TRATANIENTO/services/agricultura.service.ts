import { InvokeApi } from '@rec-shell/rec-web-shared';
import { Tratamiento } from '../../types/model';

const API_URL = `/agricultura/tratamientos`;

export class ConexionService extends InvokeApi {
  
  async POST(tratamiento: Omit<Tratamiento, 'id'>): Promise<Tratamiento> {
    const response = await this.post<Tratamiento>(API_URL, tratamiento);
    return response;
  }

  async GET_ID(id: number): Promise<Tratamiento> {
    const response = await this.getById<Tratamiento>(API_URL, id.toString());
    return response;
  }

  async GET(): Promise<Tratamiento[]> {
    const response = await this.get<Tratamiento[]>(API_URL);
    return response;
  }

  async GET_DEFICIENCIA(deficienciaId: number): Promise<Tratamiento[]> {
    const response = await this.get<Tratamiento[]>(`${API_URL}/deficiencia/${deficienciaId}`);
    return response;
  }

  async GET_ACTIVE(): Promise<Tratamiento[]> {
    const response = await this.get<Tratamiento[]>(`${API_URL}/activos`);
    return response;
  }

  async GET_TYPE(tipoTratamiento: string): Promise<Tratamiento[]> {
    const response = await this.get<Tratamiento[]>(
      `${API_URL}/tipo/${encodeURIComponent(tipoTratamiento)}`
    );
    return response;
  }

  async GET_ACTIVE_DEFICIENCIA(deficienciaId: number): Promise<Tratamiento[]> {
    const response = await this.get<Tratamiento[]>(
      `${API_URL}/activos/deficiencia/${deficienciaId}`
    );
    return response;
  }

  async GET_FLASH(diasMaximos: number): Promise<Tratamiento[]> {
    const response = await this.get<Tratamiento[]>(
      `${API_URL}/rapidos?diasMaximos=${diasMaximos}`
    );
    return response;
  }

  async PUT(id: number, tratamiento: Omit<Tratamiento, 'id'>): Promise<Tratamiento> {
    const response = await this.put<Tratamiento>(`${API_URL}/${id}`, tratamiento);
    return response;
  }

  async DELETE(id: number): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }
}

export const service = new ConexionService();