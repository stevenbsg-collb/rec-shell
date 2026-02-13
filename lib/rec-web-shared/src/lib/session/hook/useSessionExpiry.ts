import { useState, useEffect, useCallback } from 'react';

interface TokenData {
  token: string;
  expiresAt: number;
  refreshToken?: string;
}

interface SessionExpiryConfig {
  warningThreshold?: number; 
  criticalThreshold?: number; 
  onAutoLogout?: () => void; 
}

interface UseSessionExpiryReturn {
  tokenData: TokenData | null;
  timeLeft: number; 
  timeLeftFormatted: string; 
  isAuthenticated: boolean;
  showWarning: boolean;
  showCriticalModal: boolean;
  modalType: 'warning' | 'critical' | null;
  progressPercentage: number; 
  setTokenFromResponse: (response: any) => void;
  clearSession: () => void;
  resetWarnings: () => void;
}

export const useSessionExpiry = (config: SessionExpiryConfig = {}): UseSessionExpiryReturn => {
  const {
    warningThreshold = 10, 
    criticalThreshold = 5, 
    onAutoLogout,
  } = config;

  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showCriticalModal, setShowCriticalModal] = useState(false);
  const [modalType, setModalType] = useState<'warning' | 'critical' | null>(null);

  const formatTime = useCallback((milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const calculateProgress = useCallback((remaining: number): number => {
    if (!tokenData) return 0;
    const total = warningThreshold * 60 * 1000; // convertir a ms
    return Math.max(0, Math.min(100, (remaining / total) * 100));
  }, [tokenData, warningThreshold]);

  const setTokenFromResponse = useCallback((response: any) => {
    try {
      const { accessToken, refreshToken, expiresIn } = response.data;
      const expiresAt = Date.now() + (expiresIn * 1000);
      
      const newTokenData: TokenData = {
        token: accessToken,
        expiresAt,
        refreshToken: refreshToken || undefined,
      };

      setTokenData(newTokenData);

      // Guardar en sessionStorage
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem('accessToken', accessToken);
        window.sessionStorage.setItem('tokenExpiresAt', expiresAt.toString());
        if (refreshToken) {
          window.sessionStorage.setItem('refreshToken', refreshToken);
        }
      }

      setShowWarning(false);
      setShowCriticalModal(false);
      setModalType(null);
    } catch (error) {
      console.error('Error al configurar token desde respuesta:', error);
    }
  }, []);

  const clearSession = useCallback(() => {
    setTokenData(null);
    setTimeLeft(0);
    setShowWarning(false);
    setShowCriticalModal(false);
    setModalType(null);

    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem('accessToken');
      window.sessionStorage.removeItem('tokenExpiresAt');
      window.sessionStorage.removeItem('refreshToken');
      window.sessionStorage.removeItem('user');
    }
  }, []);

  const resetWarnings = useCallback(() => {
    setShowWarning(false);
    setShowCriticalModal(false);
    setModalType(null);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.sessionStorage) return;

    const savedToken = window.sessionStorage.getItem('accessToken');
    const savedExpiresAt = window.sessionStorage.getItem('tokenExpiresAt');
    const savedRefreshToken = window.sessionStorage.getItem('refreshToken');

    if (savedToken && savedExpiresAt) {
      const expiresAt = parseInt(savedExpiresAt);
      
      if (expiresAt > Date.now()) {
        setTokenData({
          token: savedToken,
          expiresAt,
          refreshToken: savedRefreshToken || undefined,
        });
      } else {
        clearSession();
      }
    }
  }, [clearSession]);

  // Actualizar tiempo restante y estados
  const updateTimeLeft = useCallback(() => {
    if (!tokenData?.expiresAt) {
      setTimeLeft(0);
      return;
    }

    const now = Date.now();
    const remaining = Math.max(0, tokenData.expiresAt - now);
    const remainingMinutes = Math.floor(remaining / (1000 * 60));
    
    setTimeLeft(remaining);

    if (remaining <= 0) {
      setShowWarning(false);
      setShowCriticalModal(false);
      setModalType(null);
      clearSession();
      onAutoLogout?.();
    } else if (remainingMinutes <= criticalThreshold) {
      setShowWarning(false);
      setShowCriticalModal(true);
      setModalType('critical');
    } else if (remainingMinutes <= warningThreshold) {
      setShowWarning(true);
      setShowCriticalModal(false);
      setModalType('warning');
    } else {
      setShowWarning(false);
      setShowCriticalModal(false);
      setModalType(null);
    }
  }, [tokenData, criticalThreshold, warningThreshold, clearSession, onAutoLogout]);

  useEffect(() => {
    if (!tokenData?.token) {
      setTimeLeft(0);
      return;
    }

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [tokenData, updateTimeLeft]);

  return {
    tokenData,
    timeLeft,
    timeLeftFormatted: formatTime(timeLeft),
    isAuthenticated: !!tokenData?.token,
    showWarning,
    showCriticalModal,
    modalType,
    progressPercentage: calculateProgress(timeLeft),
    setTokenFromResponse,
    clearSession,
    resetWarnings,
  };
};