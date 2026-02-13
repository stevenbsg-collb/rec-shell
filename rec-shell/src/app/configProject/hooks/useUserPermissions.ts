import { useMemo } from 'react';
import { ROLES_CONFIG } from '../config/roles.config';
import { NavigableComponent, UserMenuComponents } from '../type/permissions.types';
import { PROJECTS } from '../config/projects.config';
import { MenuUser} from '@rec-shell/rec-web-usuario';

export const useUserPermissions = (user: any) => {
  return useMemo(() => {
    // Validar que el usuario existe y tiene roles
    if (!user || !user.roles || user.roles.length === 0) {
      console.warn('Usuario sin roles definidos');
      return {
        menuComponents: getDefaultComponents(),
        allowedProjects: [],
        hasAdminAccess: false,
        primaryDashboard: undefined,
        userRole: 'Sin rol'
      };
    }

    // Obtener el primer rol del usuario
    const userRole = user.roles[0].toUpperCase().trim();
    const roleConfig = ROLES_CONFIG[userRole];

    if (!roleConfig) {
      console.warn(`Rol "${userRole}" no encontrado en configuración`);
      return {
        menuComponents: getDefaultComponents(),
        allowedProjects: [],
        hasAdminAccess: false,
        primaryDashboard: undefined,
        userRole: userRole
      };
    }

    console.log(`Usuario con rol: ${userRole} - Proyectos permitidos:`, roleConfig.allowedProjects);

    // Construir componentes de menú dinámicamente
    const menuComponents: UserMenuComponents = {};

    // Asignar componente de administración si tiene acceso
    if (roleConfig.hasAdminPanel) {
      // Asegúrate de importar MenuUser correctamente
      menuComponents.AdminUserComponent = MenuUser as NavigableComponent;
    }

    // Asignar componentes de menú para proyectos permitidos
    roleConfig.allowedProjects.forEach(projectId => {
      const project = PROJECTS[projectId];
      if (project) {
        const componentKey = `${capitalize(projectId)}Component` as keyof UserMenuComponents;
        menuComponents[componentKey] = project.menuComponent as NavigableComponent;
      }
    });

    // Determinar el dashboard principal (primer proyecto permitido)
    const primaryProject = roleConfig.allowedProjects[0] 
      ? PROJECTS[roleConfig.allowedProjects[0]] 
      : null;

    return {
      menuComponents,
      allowedProjects: roleConfig.allowedProjects,
      hasAdminAccess: roleConfig.hasAdminPanel,
      primaryDashboard: primaryProject?.dashboardComponent as NavigableComponent | undefined,
      userRole: roleConfig.name
    };
  }, [user]);
};

// Función auxiliar para obtener componentes por defecto
const getDefaultComponents = (): UserMenuComponents => ({
  AdminUserComponent: undefined,
  AgriculturaComponent: undefined
});

// Función auxiliar para capitalizar
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
