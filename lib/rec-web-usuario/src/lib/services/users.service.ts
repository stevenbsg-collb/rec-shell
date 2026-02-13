import {
  ApiResponse,
  ConfirmSignUpResponse,
  handleError,
  InvokeApi,
  SignUpResponse,
  UserData,
} from '@rec-shell/rec-web-shared';
import { UpdateUserResponse, User } from '../types/users.types';

export class UsersService extends InvokeApi {
  
  async GET(): Promise<User[]> {
    const response = await this.get<ApiResponse<User[]>>('/admin/users');
    return response.data ?? [];
  }

  async REFRESH(): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.GET();
  }

  async POST(userData: UserData): Promise<SignUpResponse> {
    try {
      const result = await this.post<SignUpResponse>('/auth/signup', userData, {}, false);
      return result;
    } catch (error) {
      return handleError(error, 'creating user', 'Error al crear usuario');
    }
  }

  async CONFIRM_POST(username: string, confirmationCode: string): Promise<ConfirmSignUpResponse> {
    try {
      const result = await this.post<ConfirmSignUpResponse>('/auth/confirm-signup', { username, confirmationCode }, {}, false);
      return result;
    } catch (error) {
      return handleError(error, 'confirming user signup', 'Error al confirmar registro de usuario');
    }
  }

  async PUT(userData: UserData): Promise<UpdateUserResponse> {
    try {    
      const result = await this.post<UpdateUserResponse>('/auth/user', userData);
      return result;
    } catch (error) {
      return handleError(error, 'updating user', 'Error al actualizar usuario');
    }
  }
}

export const service = new UsersService();