export interface ProjectConfig {
  id: string;
  name: string;
  menuComponent: React.ComponentType<any>;
  dashboardComponent: React.ComponentType<any>;
  roles: string[];
}

export interface UserPermissions {
  allowedProjects: string[];
  hasAdminAccess: boolean;
}

export type NavigableComponent = React.ComponentType<any>;

export interface UserMenuComponents {
  [key: string]: NavigableComponent | undefined;
  AdminUserComponent?: NavigableComponent;
  AgriculturaComponent?: NavigableComponent;
  
}

export interface RoleConfig {
  name: string;
  hasAdminPanel: boolean;
  allowedProjects: string[];
  isGlobalRole: boolean;
}