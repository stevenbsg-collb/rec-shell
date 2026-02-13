import { InvokeApi } from '@rec-shell/rec-web-shared';
import {AnalisisImagenMCHL } from '../../../types/model';
import { AnalisisImagenYOLO_DTO } from '../../../types/yolo';

const API_URL_ANALISIS = `/agricultura/analisis-deficiencia`;

export class ConexionService extends InvokeApi {
  async POST(analisis: AnalisisImagenYOLO_DTO): Promise<AnalisisImagenMCHL> {
    const response = await this.post<AnalisisImagenMCHL>(API_URL_ANALISIS, analisis);
    return response;
  }

  async GET(): Promise<AnalisisImagenYOLO_DTO[]> {
    const response = await this.get<AnalisisImagenYOLO_DTO[]>(API_URL_ANALISIS);
    return response;
  }
}

export const service = new ConexionService();