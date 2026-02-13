import { InvokeApi } from "./invoke.api";

const API_URL = `/admin/config`;

export interface ApiKeys {
  geminiKey: string;
  youtubeKey: string;
}

export class ConexionService extends InvokeApi {

  async GET(): Promise<ApiKeys> {
    const response = await this.get<ApiKeys>(`${API_URL}/keys`);
    return response;
  }
  
}
export const configService = new ConexionService();
