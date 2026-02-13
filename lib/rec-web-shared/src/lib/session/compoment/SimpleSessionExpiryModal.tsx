import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface SimpleSessionExpiryModalProps {
  onRefreshToken: () => Promise<any>;
  onLogout: () => void;
  onAutoLogout: () => void;
  criticalThreshold?: number; 
}

export const SimpleSessionExpiryModal: React.FC<SimpleSessionExpiryModalProps> = ({ 
  onRefreshToken, 
  onLogout, 
  onAutoLogout,
  criticalThreshold = 15 
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const expiresAt = parseInt(sessionStorage.getItem('tokenExpiresAt') || '0');
      const now = Date.now();
      const remaining = Math.max(0, expiresAt - now);
      const remainingSeconds = Math.floor(remaining / 1000);
      
      setTimeLeft(remaining);
      if (remaining <= 0) {
        // Token expirado
        setShowModal(false);
        onAutoLogout();
      } else if (remainingSeconds <= criticalThreshold) {
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [criticalThreshold, onAutoLogout]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshToken();
      setShowModal(false);
    } catch (error) {
      console.error('Error al renovar token:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!sessionStorage.getItem('accessToken')) return null;

 return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[10000] font-sans">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden">
            {/* Header con icono */}
            <div className="px-6 pt-8 pb-4 text-center">
              <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-teal-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                La sesión está por finalizar
              </h2>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                Has estado inactivo durante varios minutos. Por motivos de seguridad, tu sesión se cerrará en:
              </p>
            </div>

            {/* Contador */}
            <div className="px-6 pb-2">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 font-mono">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="px-6 pb-6 pt-4 space-y-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {isRefreshing ? 'Renovando...' : 'Continuar en la sesión'}
              </button>
              
              <button
                onClick={onLogout}
                disabled={isRefreshing}
                className="w-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};