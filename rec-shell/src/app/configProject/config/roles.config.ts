import { RoleConfig } from "../type/permissions.types";

// Solo ADMIN tiene acceso al panel de administración hasAdminPanel: true,
export const ROLES_CONFIG: Record<string, RoleConfig> = {
  // Roles globales
  ADMIN: {
    name: 'Administrador',
    hasAdminPanel: true,
    allowedProjects: ['agricultura'],
    isGlobalRole: true
  },
  USER: {
    name: 'UsuarioComun',
    hasAdminPanel: false,
    allowedProjects: ['agricultura'],
    isGlobalRole: true
  },
  
 
};