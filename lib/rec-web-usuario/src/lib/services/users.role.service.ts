import { Role, RoleApiResponse } from '../types/role.types';
import { ApiResponse } from '../types/users.types';
import { apiClient } from '@rec-shell/rec-web-shared';

export class UserRoleService {
  async GET(): Promise<Role[]> {
    const response = await apiClient.get<RoleApiResponse>('/admin/roles');
    return response.data;
  }

  async GET_USER_ROLES(userId: number): Promise<Role[]> {
    const response = await apiClient.get<ApiResponse<Role[]>>(`/admin/users/${userId}/roles`);
    return response.data || [];
  }

  async POST(userId: number, roleId: number): Promise<void> {
    await apiClient.post<ApiResponse<unknown>>(`/admin/users/${userId}/roles/${roleId}`);
  }

  async DELETE(userId: number, roleId: number): Promise<void> {
    await apiClient.delete<ApiResponse<unknown>>(`/admin/users/${userId}/roles/${roleId}`);
  }
}