import { InvokeApi } from '@rec-shell/rec-web-shared';
import { AnalisisImagenDTO, ResultadoDetalle, ResultadoDiagnosticoDTO } from '../../../types/dto';
import { AnalisisImagen, AnalisisImagenMCHL, ResultadoDiagnostico } from '../../../types/model';

const API_URL_ANALISIS = `/agricultura/analisis-imagenes`;

export class ConexionService extends InvokeApi {

  async POST(analisis: AnalisisImagenDTO): Promise<AnalisisImagen> {
    console.log('POST', analisis);
    const response = await this.post<AnalisisImagen>(API_URL_ANALISIS, analisis);
    return response;
  }

  async POST_RESULTADO(analisisId: string, resultado: ResultadoDiagnosticoDTO): Promise<ResultadoDiagnostico> {
    const url = `${API_URL_ANALISIS}/${analisisId}/resultados-diagnostico`;
    const response = await this.post<ResultadoDiagnostico>(url, resultado);
    return response;
  }

  async GET_ID(id: string): Promise<AnalisisImagen> {
    const response = await this.getById<AnalisisImagen>(API_URL_ANALISIS, id);
    return response;
  }

  async GET(): Promise<AnalisisImagen[]> {
    const response = await this.get<AnalisisImagen[]>(API_URL_ANALISIS);
    return response;
  }

  async GET_RESULTADOS(analisisId: number): Promise<ResultadoDetalle> {
    const url = `${API_URL_ANALISIS}/resultados-diagnostico/${analisisId}`;
    const response = await this.get<ResultadoDetalle>(url);
    console.log(response);
    return response;
  }
}

export const service = new ConexionService();