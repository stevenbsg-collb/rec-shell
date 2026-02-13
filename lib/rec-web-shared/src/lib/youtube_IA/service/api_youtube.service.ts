import { configService } from "../../service/configuracion.service";
import { environment } from "../../service/environment";

class ApiYoutubeService {
  
  private API_URL = environment.youtube.url;
  
  private async apiKey(): Promise<string> {
    const apiKey = await configService.GET();
    return apiKey.youtubeKey;
  }
  
  async GET_NAME(query: string, maxResults = 5) {
    const API_KEY = await this.apiKey();
    const url = `${this.API_URL}?part=snippet&q=${encodeURIComponent(
      query
    )}&type=video&maxResults=${maxResults}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("Error al obtener videos:", error);
      throw error;
    }
  }
}

export const service = new ApiYoutubeService();