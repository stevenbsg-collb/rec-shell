
import { ProjectConfig } from "../type/permissions.types";
import { DashboardAdminM1, MenuPagueM1 } from '@rec-shell/rec-web-agricultura';

export const PROJECTS: Record<string, ProjectConfig> = {
  agricultura: {
    id: 'agricultura',
    name: 'Agricultura',
    menuComponent: MenuPagueM1,
    dashboardComponent: DashboardAdminM1,
    roles: ['ADMIN', 'USER']
  },
 
};

// Roles globales del sistema
export const SYSTEM_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  EST: 'EST'
} as const;