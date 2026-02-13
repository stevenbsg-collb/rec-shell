import React, { useEffect, useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { SecurityRecommendationCard, SupportCard } from './RecommendationInfo';

interface SignInData {
  username: string;
  password: string;
}

interface FormErrors {
  username: string;
  password: string;
}

interface SignInProps {
  onSignIn?: (data: SignInData) => void | Promise<void>;
  onForgotPassword?: () => void;
  loading?: boolean;
  error?: string | null;
}

export const SignIn: React.FC<SignInProps> = ({
  onSignIn = (data: SignInData) => console.log('Sign in:', data),
  onForgotPassword = () => console.log('Forgot password'),
  loading = false,
  error = null,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignInData>({ username: '', password: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({ username: '', password: '' });
  const [showError, setShowError] = useState<boolean>(!!error);

  const validateForm = () => {
    const errors: FormErrors = { username: '', password: '' };

    if (!formData.username) errors.username = 'El nombre de usuario es requerido';
    else if (formData.username.length < 3) errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';

    if (!formData.password) errors.password = 'La contraseña es requerida';
    else if (formData.password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres';

    setFormErrors(errors);
    return !errors.username && !errors.password;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !onSignIn) return;

    try {
      setIsSubmitting(true);
      await onSignIn(formData);
    } catch (err) {
      console.error('Sign in error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof SignInData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isLoading = loading || isSubmitting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center py-10">
        {/* ✅ Ahora SI hay max-width y centrado */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ✅ 1 col móvil, 2 cols tablet, 3 cols desktop con ancho controlado */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[420px_minmax(280px,1fr)_minmax(280px,1fr)] gap-6 lg:gap-8 items-stretch">
            {/* Col 1: Formulario */}
            <div className="h-full">
              <div className="h-full bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Bienvenido
                </h1>
                <p className="text-gray-600 text-sm mt-2 mb-6">
                  Ingresa tus credenciales para continuar
                </p>

                {showError && error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-800 font-semibold text-sm">Error de autenticación</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                )}

                <div className="space-y-5 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                    <input
                      type="text"
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition disabled:bg-gray-50"
                      placeholder="Ingresa tu usuario"
                    />
                    {formErrors.username && (
                      <p className="text-red-500 text-xs mt-2">⚠️ {formErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition disabled:bg-gray-50 pr-12"
                        placeholder="Ingresa tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                        disabled={isLoading}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-2">⚠️ {formErrors.password}</p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.username || !formData.password}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold py-3.5 px-6 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Ingresando...
                    </span>
                  ) : (
                    'Ingresar'
                  )}
                </button>

                <button
                  disabled={isLoading}
                  onClick={onForgotPassword}
                  className="w-full mt-4 bg-gray-50 hover:bg-gray-100 text-gray-800 py-3.5 px-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center border-2 border-gray-200 hover:border-gray-300"
                >
                  <Lock className="w-5 h-5 mr-3 text-gray-500" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500 font-medium">¿Olvidaste tu contraseña?</div>
                    <div className="font-semibold text-sm sm:text-base">Recuperar acceso</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Col 2 */}
            <div className="h-full">
              <div className="h-full">
                <SecurityRecommendationCard />
              </div>
            </div>

            {/* Col 3 */}
            <div className="h-full md:col-span-2 lg:col-span-1">
              <div className="h-full">
                <SupportCard />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white/70 backdrop-blur border-t border-gray-200 py-4 px-6 text-center">
        <p className="text-gray-600 text-xs sm:text-sm">
          © 2025 <strong className="text-gray-900">KbzO Computer</strong> - Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default SignIn;
