import { apiClient } from '@rec-shell/rec-web-shared';
import { Permission, PermissionApiResponse, Role, RoleApiResponse } from '../types/role.types';

export const service = {
  async GET(): Promise<Role[]> {
    const response = await apiClient.get<RoleApiResponse>('/admin/roles');
    return response.data;
  },

  async GET_PERMISSIONS(): Promise<Permission[]> {
    const response = await apiClient.get<PermissionApiResponse>('/admin/permisos');
    return response.data;
  },

  async POST(roleData: {
    name: string;
    description: string;
    permissionIds?: number[];
    }): Promise<Role> {
    const response = await apiClient.post<{ success: boolean; data: Role; message?: string }>('/admin/roles', roleData);
    return response.data;
  },

  async PUT(id: number, roleData: Partial<Omit<Role, 'id'>>): Promise<Role> {
    const response = await apiClient.put<{ success: boolean; data: Role; message?: string }>(`/admin/roles/${id}`, roleData);
    return response.data;
  },

  async DELETE(id: number): Promise<void> {
    await apiClient.delete<{ success: boolean; message?: string }>(`/admin/roles/${id}`);
  }
};
