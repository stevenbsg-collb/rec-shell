import { CacaoAnalysisResult } from "../../../types/dto";

const API_URL = 'https://cacao-leaf-api-py.onrender.com';

export class ConexionService {
  
  async analizarHoja(file: File): Promise<CacaoAnalysisResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Enviando petición a:', `${API_URL}/analizar-hoja`);
      console.log('Archivo:', file.name, file.type, file.size);

      const response = await fetch(`${API_URL}/analizar-hoja`, {
        method: 'POST',
        body: formData
      });

      console.log('Status:', response.status);
      console.log('Headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        let errorMessage = 'Error al analizar la imagen';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.detail || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Resultado:', result);
      return result;
      
    } catch (error) {
      console.error('Error completo:', error);
      throw error;
    }
  }

  async checkHealth(): Promise<{ status: string; service: string }> {
    const response = await fetch(`${API_URL}/health`);
    
    if (!response.ok) {
      throw new Error('API no disponible');
    }

    return response.json();
  }

  async getApiInfo(): Promise<any> {
    const response = await fetch(`${API_URL}/`);
    
    if (!response.ok) {
      throw new Error('No se pudo obtener información de la API');
    }

    return response.json();
  }
}