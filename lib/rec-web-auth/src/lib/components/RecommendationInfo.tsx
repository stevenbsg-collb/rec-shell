import React from 'react';
import { Shield, Smartphone } from 'lucide-react';


export const SecurityRecommendationCard = () => (
  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
    <div className="flex items-center mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-3 rounded-xl">
        <Shield className="w-6 h-6 text-white" />
      </div>
      <h3 className="ml-4 text-xl font-bold text-gray-900">Seguridad</h3>
    </div>
    <div className="space-y-4 text-gray-600">
      <p className="text-sm leading-relaxed">
        <span role="img" aria-label="candado">🔐</span> Usa contraseñas únicas y seguras
      </p>
      <p className="text-sm leading-relaxed">
        <span role="img" aria-label="símbolo de recarga">🔄</span> Cambia tu contraseña periódicamente
      </p>
      <p className="text-sm leading-relaxed">
        <span role="img" aria-label="advertencia">⚠️</span> No compartas tus credenciales
      </p>
      <p className="text-sm leading-relaxed">
        <span role="img" aria-label="escudo">🛡️</span> Mantén tu información protegida
      </p>
    </div>
  </div>
);

export const SupportCard = () => (
  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
    <div className="flex items-center mb-6">
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <h3 className="ml-4 text-xl font-bold text-gray-900">Consejos rápidos:</h3>
    </div>
    <div className="space-y-4 text-gray-600">
      <p className="text-sm leading-relaxed">
        <span role="img" aria-label="">✉️</span> 
        Verifica tu correo electrónico antes de iniciar sesión.
      </p>
      <p className="text-sm leading-relaxed">
        <span role="img" aria-label="">🔑</span>  
        Si olvidaste tu contraseña, usa la opción "Recuperar acceso".
      </p>
      <p className="text-sm leading-relaxed">
        <span role="img" aria-label="">🔒</span> 
        Mantén tu información segura y siempre actualizada.
      </p>
      <p className="text-sm leading-relaxed">
        <span role="img" aria-label="">📚</span>  
        Centro de ayuda siempre activo
      </p>
    </div>
  </div>
);