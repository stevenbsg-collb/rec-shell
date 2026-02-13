export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface RoleApiResponse {
  success: boolean;
  data: Role[];
  message?: string;
}

export interface PermissionApiResponse {
  success: boolean;
  data: Permission[];
  message: string;
  timestamp: string;
}
