import { useState, useCallback, useEffect } from 'react';

import {
  SignInCredentials,
  ForgotPasswordResponse,
  ConfirmForgotPasswordRequest,
  ChangePasswordRequest,
  AuthError,
  UseAuthState,
  isGlobalError,
} from '../types/auth';
import { authService } from '../services/authService.service';

interface UseAuthReturn extends UseAuthState {
  signIn: (credentials: SignInCredentials) => Promise<{
    user: any;
    accessToken: string;
  }>;
  signOut: () => void;
  forgotPassword: (username: string) => Promise<ForgotPasswordResponse>;
  confirmForgotPassword: (data: ConfirmForgotPasswordRequest) => Promise<void>;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
  refreshToken: () => Promise<any>;
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    accessToken: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  const initializeAuth = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }));

    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = window.sessionStorage.getItem('accessToken');
      const userStr = window.sessionStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setState((prev) => ({
            ...prev,
            accessToken: token,
            user,
            isAuthenticated: true,
            loading: false,
          }));
          return;
        } catch (error) {
          window.sessionStorage.removeItem('accessToken');
          window.sessionStorage.removeItem('user');
          window.sessionStorage.removeItem('refreshToken');
          window.sessionStorage.removeItem('tokenExpiresAt');
        }
      } else {
        console.log('📭 No hay datos de sesión guardados');
      }
    }

    setState((prev) => ({ ...prev, loading: false }));
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const signIn = useCallback(
    async (credentials: SignInCredentials) => {
      try {
        setLoading(true);
        setError(null);
        const response = await authService.signIn(credentials);
        let userData, token, refreshToken;

        if (response.data.userInfo && response.data.accessToken) {
          userData = response.data.userInfo;
          token = response.data.accessToken;
          refreshToken = response.data.refreshToken;
        } else if (response.data?.userInfo && response.data?.accessToken) {
          userData = response.data.userInfo;
          token = response.data.accessToken;
          refreshToken = response.data?.refreshToken;
        } else {
          throw new Error('Estructura de respuesta inválida');
        }

        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem('accessToken', token);
          const { expiresIn } = response.data;
          const now = Date.now();
          const expiresAt = now + expiresIn; 
          window.sessionStorage.setItem('tokenExpiresAt', expiresAt.toString());

          if (userData) {
            window.sessionStorage.setItem('user', JSON.stringify(userData));
          }

          if (refreshToken) {
            window.sessionStorage.setItem('refreshToken', refreshToken);
          }
        }

        const newState = {
          user: userData || null,
          accessToken: token,
          loading: false,
          error: null,
          isAuthenticated: true,
        };

        setState(newState);
        return {
          user: userData,
          accessToken: token,
        };
      } catch (error) {
        const errorMessage =
          (error as AuthError)?.message || 'Error de autenticación';

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [setLoading, setError]
  );

  const signOut = useCallback(() => {
    setState({
      user: null,
      accessToken: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });

    if (typeof window !== 'undefined' && window.sessionStorage) {
       window.sessionStorage.removeItem('accessToken');
      window.sessionStorage.removeItem('refreshToken');
      window.sessionStorage.removeItem('user');
      window.sessionStorage.removeItem('tokenExpiresAt');
      window.sessionStorage.clear();
    }
  }, []);

  const forgotPassword = useCallback(
    async (username: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await authService.forgotPassword({ username });

        setLoading(false);
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error al enviar solicitud';
        setError(errorMessage);
        setLoading(false);
        throw error;
      }
    },
    [setLoading, setError]
  );

  const confirmForgotPassword = useCallback(
    async (data: ConfirmForgotPasswordRequest) => {
      try {
        setLoading(true);
        setError(null);

        await authService.confirmForgotPassword(data);
        setLoading(false);
      } catch (error) {
        const errorMessage = isGlobalError(error)
          ? error.message
          : 'Error al confirmar reset';
        setError(errorMessage);
        setLoading(false);
        throw error;
      }
    },
    [setLoading, setError]
  );

  const changePassword = useCallback(
    async (data: { currentPassword: string; newPassword: string }) => {
      if (!state.accessToken) {
        throw new Error('No hay token de acceso');
      }

      try {
        setLoading(true);
        setError(null);

        const request: ChangePasswordRequest = {
          accessToken: state.accessToken,
          previousPassword: data.currentPassword,
          proposedPassword: data.newPassword,
        };

        await authService.changePassword(request);
        setLoading(false);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Error al cambiar contraseña';
        setError(errorMessage);
        setLoading(false);
        throw error;
      }
    },
    [state.accessToken, setLoading, setError]
  );

 const refreshToken = useCallback(async () => {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) {
        throw new Error('sessionStorage no disponible');
      }

      const storedRefreshToken = window.sessionStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken({
        refreshToken: storedRefreshToken,
      });

      if (response.success && response.data) {
        const {
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn,
        } = response.data;

        window.sessionStorage.setItem('accessToken', accessToken);

        const now = Date.now();
        const expiresAt = now + expiresIn; 
        window.sessionStorage.setItem('tokenExpiresAt', expiresAt.toString());

        if (newRefreshToken) {
          window.sessionStorage.setItem('refreshToken', newRefreshToken);
        }

        setState((prev) => ({
          ...prev,
          accessToken: accessToken,
        }));
      }

      return response;
    } catch (error) {
      console.error('Error refreshing token:', error);
      signOut(); 
      throw error;
    }
  }, [signOut]);


  return {
    ...state,
    signIn,
    signOut,
    forgotPassword,
    confirmForgotPassword,
    changePassword,
    clearError,
    initializeAuth,
    refreshToken,
  };
};
