import { useAuth, AuthContainer } from '@rec-shell/rec-web-auth';
import { AdminTemplate } from '@rec-shell/rec-web-layout';
import React, { useCallback } from 'react';
import { useUserPermissions } from './configProject/hooks/useUserPermissions';


export function App() {
  const authState = useAuth();
  const { isAuthenticated, user, loading, signOut, refreshToken } = authState;
  
  // Obtener permisos del usuario
  const { 
    menuComponents, 
    allowedProjects, 
    hasAdminAccess,
    primaryDashboard,
    userRole 
  } = useUserPermissions(user);

  const handleRefreshToken = useCallback(async () => {
    try {
      return await refreshToken();
    } catch (error) {
      console.error('Error al refrescar token desde App:', error);
      throw error;
    }
  }, [refreshToken]);

  const handleLogout = useCallback(() => {
    signOut();
  }, [signOut]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {    
    return <AuthContainer authState={authState} />;
  }

  if (!user) {
    console.error('Usuario autenticado pero sin datos');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>Error: No se pudieron cargar los datos del usuario</p>
          <button 
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  if (allowedProjects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Restringido</h2>
          <p className="text-gray-600 mb-6">
            Tu rol ({userRole}) no tiene acceso a ningún proyecto.
          </p>
          <p className="text-gray-500 mb-6">
            Por favor, contacta al administrador del sistema.
          </p>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  const userInfo = {
    name: user?.username || 'Usuario',
    email: user?.email || '',
    initials: user?.username ? user.username.charAt(0).toUpperCase() : 'U',
    role: userRole
  };

  return (
    <AdminTemplate 
      AdminUserComponent={menuComponents.AdminUserComponent}
      AgriculturaComponent={menuComponents.AgriculturaComponent}
      GamificacionComponent={menuComponents.GamificacionComponent}
      EducacionComponent={menuComponents.EducacionComponent}
      LayoutDashboardComponent={primaryDashboard}
      onSignOut={signOut}
      userInfo={userInfo}
    />      
  );
}

export default App;