
import { InvokeApi } from '@rec-shell/rec-web-shared';
import { EstadoCultivo } from '../../enums/Enums';
import { Cultivo, CultivoFilters } from '../../types/model';

const API_URL = `/agricultura/cultivos`;

export class ConexionService extends InvokeApi {

  async POST(model: Cultivo): Promise<Cultivo> {    
    const response = await this.post<Cultivo>(API_URL, model, {});
    return response;
  }

  async GET_BY_ID(id: string): Promise<Cultivo> {
    const response = await this.get<Cultivo>(`${API_URL}/${id}`);
    return response;
  }

  async GET(): Promise<Cultivo[]> {
    const response = await this.get<Cultivo[]>(`${API_URL}`);
    return response;
  }

  async GET_USER(usuarioId: string): Promise<Cultivo[]> {
    const response = await this.get<Cultivo[]>(`${API_URL}/usuario/${usuarioId}`);
    return response;
  }

  async GET_STATE(estadoCultivo: EstadoCultivo): Promise<Cultivo[]> {
    const response = await this.get<Cultivo[]>(`${API_URL}/estado/${estadoCultivo}`);
    return response;
  }

  async GET_USER_AND_STATE(usuarioId: string, estadoCultivo: EstadoCultivo): Promise<Cultivo[]> {
    const response = await this.get<Cultivo[]>(`${API_URL}/usuario/${usuarioId}/estado/${estadoCultivo}`);
    return response;
  }

  async GET_VARIETY(variedadCacao: string): Promise<Cultivo[]> {
    const response = await this.get<Cultivo[]>(`${API_URL}/variedad/${variedadCacao}`);
    return response;
  }

  async GET_AREA_TOTAL_ACTIVA_BY_USER(): Promise<number> {
    const response = await this.get<number>(`${API_URL}/usuario/${this.getUserId()}/area-total-activa`);
    return response;
  }

  async IS_EXIST(id: string): Promise<boolean> {
    const response = await this.get<boolean>(`${API_URL}/${id}/exists`);
    return response;
  }

  async PUT(id: string, cultivo: Cultivo): Promise<Cultivo> {
    const response = await this.put<Cultivo>(`${API_URL}/${id}`, cultivo);
    return response;
  }

  async DELETE(id: string): Promise<void> {
    await this.delete(`${API_URL}/${id}`);
  }

  async PUT_STATE(id: string, nuevoEstado: EstadoCultivo): Promise<Cultivo> {
    const response = await this.put<Cultivo>(`${API_URL}/${id}/estado`, nuevoEstado); 
    return response;
  }

  async GET_FILTER(filtros: CultivoFilters): Promise<Cultivo[]> {
    if (filtros.usuarioId && filtros.estadoCultivo) {
      return this.GET_USER_AND_STATE(filtros.usuarioId, filtros.estadoCultivo);
    }
    
    if (filtros.usuarioId) {
      return this.GET_USER(filtros.usuarioId);
    }
    
    if (filtros.estadoCultivo) {
      return this.GET_STATE(filtros.estadoCultivo);
    }
    
    if (filtros.variedadCacao) {
      return this.GET_VARIETY(filtros.variedadCacao);
    }
    
    return this.GET();
  }
}
export const service = new ConexionService();
