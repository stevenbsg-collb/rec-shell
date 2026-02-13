import { environment } from "./environment";

export class InvokeApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = environment.api.baseUrl;
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    requiresAuth = true
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (requiresAuth) {
      const accessToken = window.sessionStorage.getItem('accessToken');
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      headers,
      ...options,
    });
    
    const responseText = await response.text();
    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      data = responseText;
    }

    if (!response.ok) {
      this.handleHttpError(response.status, data);
    }

    if (
      data &&
      typeof data === 'object' &&
      'success' in data &&
      !data.success
    ) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  private handleHttpError(status: number, data: any): never {
    const serverMessage = this.extractErrorMessage(data);

    switch (status) {
      case 400:
        throw new Error(
          serverMessage || 'Solicitud incorrecta: Los datos enviados no son válidos'
        );
      
      case 401:
        throw new Error(
          serverMessage || 'No autorizado: Credenciales inválidas o sesión expirada'
        );
      
      case 403:
        throw new Error(
          serverMessage || 'Prohibido: No tienes permiso para acceder a este recurso'
        );
      
      case 404:
        throw new Error(
          serverMessage || 'No encontrado: El recurso solicitado no existe'
        );
      
      case 422:
        throw new Error(
          serverMessage || 'Datos no procesables: Verifica la información enviada'
        );
      
      case 429:
        throw new Error(
          serverMessage || 'Demasiadas solicitudes: Inténtalo de nuevo más tarde'
        );
      
      case 500:
        throw new Error(
          serverMessage || 'Error interno del servidor: Inténtalo de nuevo más tarde'
        );
      
      case 502:
        throw new Error(
          serverMessage || 'Bad Gateway: Error en el servidor intermediario'
        );
      
      case 503:
        throw new Error(
          serverMessage || 'Servicio no disponible: El servidor está temporalmente fuera de servicio'
        );
      
      case 504:
        throw new Error(
          serverMessage || 'Timeout: El servidor tardó demasiado en responder'
        );

      default:
        throw new Error(
          serverMessage || `Error HTTP: ${status} - Solicitud fallida`
        );
    }
  }

  private extractErrorMessage(data: any): string | null {
    if (typeof data === 'string') {
      return data;
    }
    
    if (data && typeof data === 'object') {
      return data.message || 
             data.error || 
             data.detail || 
             data.msg || 
             null;
    }
    
    return null;
  }

  // HTTP Methods
  async get<T>(url: string, options?: RequestInit, requiresAuth = true): Promise<T> {
    return this.makeRequest<T>(url, {
      method: 'GET',
      ...options,
    }, requiresAuth);
  }

  async getById<T>(endpoint: string, id: number | string, options?: RequestInit, requiresAuth = true): Promise<T> {
    return this.makeRequest<T>(`${endpoint}/${id}`, {
      method: 'GET',
      ...options,
    }, requiresAuth);
  }
  
  async post<T>(url: string, body?: any, options?: RequestInit, requiresAuth = true): Promise<T> {
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }, requiresAuth);
  }

  async put<T>(url: string, body?: any, options?: RequestInit, requiresAuth = true): Promise<T> {
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }, requiresAuth);
  }

  async patch<T>(url: string, body?: any, options?: RequestInit, requiresAuth = true): Promise<T> {
    return this.makeRequest<T>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }, requiresAuth);
  }

  async delete<T>(url: string, options?: RequestInit, requiresAuth = true): Promise<T> {
    return this.makeRequest<T>(url, {
      method: 'DELETE',
      ...options,
    }, requiresAuth);
  }

  // Utility methods
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getUserId(): number | null {
    const userStr = window.sessionStorage.getItem('user');
    if (!userStr) return null; 
    try {
      const userObj = JSON.parse(userStr);
      return userObj.id ?? null; 
    } catch (e) {
      console.error('Error al parsear el usuario:', e);
      return null;
    }
  }

}

export const apiClient = new InvokeApi();