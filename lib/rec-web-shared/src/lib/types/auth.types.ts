
export interface UserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface ResetPasswordFormValues {
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

export interface UserInfo {
  id?: string;
  username?: string;
  email?: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string; 
  expiresIn: number;
  userInfo: UserInfo;
}

export type SignUpResponse = ApiResponse<AuthResponse>;
export type ConfirmSignUpResponse = ApiResponse<string>;