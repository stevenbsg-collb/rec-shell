import {
  SignInCredentials,
  SignInResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ConfirmForgotPasswordRequest,
  ConfirmForgotPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  OpcionDTO
} from '../types/auth';
import  {handleError, InvokeApi } from '@rec-shell/rec-web-shared';

export class AuthService extends InvokeApi {

  async signIn(credentials: SignInCredentials): Promise<SignInResponse> {
    try {
      const result = await this.post<SignInResponse>('/auth/signin', credentials, {}, false);
      return result;
    } catch (error) {
      return handleError(error, 'signing in user', 'Error al iniciar sesión');
    }
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    try {
      const result = await this.post<ForgotPasswordResponse>('/auth/forgot-password', request, {}, false);
      return result;
    } catch (error) {
      return handleError(error, 'requesting password reset', 'Error al solicitar restablecimiento de contraseña');
    }
  }

  async confirmForgotPassword(request: ConfirmForgotPasswordRequest): Promise<ConfirmForgotPasswordResponse> {
    try {
      const result = await this.post<ConfirmForgotPasswordResponse>('/auth/confirm-forgot-password', request, {}, false);
      return result;
    } catch (error) {
      return handleError(error, 'confirming password reset', 'Error al confirmar restablecimiento de contraseña');
    }
  }

  async changePassword(request: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    try {
      const result = await this.post<ChangePasswordResponse>('/auth/change-password', request);
      return result;
    } catch (error) {
      return handleError(error, 'changing password', 'Error al cambiar contraseña');
    }
  }

  async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const result = await this.post<RefreshTokenResponse>('/auth/refresh-token', request, {}, false);
      return result;
    } catch (error) {
      return handleError(error, 'refreshing token', 'Error al actualizar token');
    }
  }

  async GET_OPCIONES(): Promise<OpcionDTO[]> {
    const response = await this.get<OpcionDTO[]>('/admin/opciones');
    return response;
  }

  async GET_OPCION_BY_ROL(role: string, proyecto: string): Promise<OpcionDTO[]> {
    const response = await this.get<OpcionDTO[]>(`/admin/roles/${role}/opciones/${proyecto}`);
    return response;
  }
}

export const authService = new AuthService();