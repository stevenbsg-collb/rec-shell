import { InvokeApi } from '@rec-shell/rec-web-shared';
import { GenerarPlanAnalisisRequest, PlanGeneradoResponse, PlanTratamientoNuevo } from '../../../types/dto';

const API_URL_ANALISIS_V1 = `/agricultura/planes-tratamiento-analisis`;

export class ConexionService extends InvokeApi {

  async GET(): Promise<PlanTratamientoNuevo[]> {
    const response = await this.get<PlanTratamientoNuevo[]>(API_URL_ANALISIS_V1);
    return response;
  }

   async POST(request: GenerarPlanAnalisisRequest): Promise<PlanGeneradoResponse> {
    const response = await this.post<PlanGeneradoResponse>(`${API_URL_ANALISIS_V1}/generar-analisis`, request);
    return response;
  }
  
}

export const service = new ConexionService();