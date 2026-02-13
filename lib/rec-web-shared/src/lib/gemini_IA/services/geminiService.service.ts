import { configService } from "../../service/configuracion.service";
import { environment } from "../../service/environment";
import { GeminiRequest, GeminiResponse } from "../model/dominio";

class GeminiService {
  private API_URL   = environment.ia.url;
  private API_MODEL = environment.ia.model;

  async generateText({
    prompt,
    temperature = 0.7,
    maxTokens = 2048
  }: GeminiRequest): Promise<string> {

    const apiKeys = await configService.GET();
    apiKeys.geminiKey = 'AIzaSyBXSzH2TVwmgCyypALYiwzgBV44lgcGUco';
    
    if (!apiKeys.geminiKey) {
      throw new Error('API Key es requerida');
    }

    if (!prompt) {
      throw new Error('El prompt es requerido');
    }


    const url = `${this.API_URL}/models/${this.API_MODEL}:generateContent?key=${apiKeys.geminiKey}`;
    console.log('URL:', url);

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `Error HTTP: ${response.status}`
        );
      }
      
      const data: GeminiResponse = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No se recibió respuesta del modelo');
      }

      return data.candidates[0].content.parts[0].text;

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error desconocido al generar texto');
    }
  }
}

export const service = new GeminiService();