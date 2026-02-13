export interface SignInCredentials {
  username: string;
  password: string;
}

export interface SignInResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string | null;
    expiresIn: number;
    userInfo: {
      id: string;
      username: string;
      email?: string;
      roles: string[];
    };
  };
  message: string;
  success: boolean;
  timestamp: string;
}

export interface UseAuthState {
  user: SignInResponse['data']['userInfo'] | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface ForgotPasswordRequest {
  username: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface ConfirmForgotPasswordRequest {
  username: string;
  confirmationCode: string;
  password: string;
}

export interface ConfirmForgotPasswordResponse {
  message: string;
  success: boolean;
}

export interface ChangePasswordRequest {
  accessToken: string;
  previousPassword: string;
  proposedPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

export interface AuthError {
  message: string;
  code?: string;
  statusCode?: number;
}


export class GlobalError {
  message = '';
  code?: string;
  statusCode?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    tokenType?: string;
  };
}

export interface OpcionDTO {
  id: number;
  nombre: string;
  codigo: string;
  icono: string;
  descripcion: string;
}

export interface SignInProps {
  onSignIn?: (credentials: SignInCredentials) => Promise<void>;
  onForgotPassword?: () => void;
  loading?: boolean;
  error?: string;
}



export function isGlobalError(obj: any): obj is GlobalError {
  return obj && typeof obj.message === 'string';
}