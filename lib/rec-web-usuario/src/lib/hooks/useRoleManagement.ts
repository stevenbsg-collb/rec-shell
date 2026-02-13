import { useState, useCallback } from 'react';
import { Role } from '../types/role.types';
import { UserRoleService } from '../services/users.role.service';

const service = new UserRoleService();
export const useRoleManagement = () => {

  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigningRole, setAssigningRole] = useState(false);
  const [removingRole, setRemovingRole] = useState<number | null>(null);

  const fetchAvailableRoles = useCallback(async () => {
    try {
      setLoading(true);
      const roles = await service.GET();
      setAvailableRoles(roles);
    } catch (error) {
      console.log('Error fetching available roles:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserRoles = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      const roles = await service.GET_USER_ROLES(userId);
      setUserRoles(roles);
    } catch (error) {
      console.log('Error fetching user roles:', error);
      setUserRoles([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const assignRole = useCallback(async (userId: number, roleId: number) => {
    try {
      setAssigningRole(true);
      await service.POST(userId, roleId);      
      await fetchUserRoles(userId);
    } catch (error) {
      console.log('Error assigning role:', error);
      throw error;
    } finally {
      setAssigningRole(false);
    }
  }, [fetchUserRoles]);

  const removeRole = useCallback(async (userId: number, roleId: number) => {
    try {
      setRemovingRole(roleId);
      await service.DELETE(userId, roleId);      
      await fetchUserRoles(userId);
    } catch (error) {
      console.log('Error removing role:', error);
      throw error;
    } finally {
      setRemovingRole(null);
    }
  }, [fetchUserRoles]);

  return {
    availableRoles,
    userRoles,
    loading,
    assigningRole,
    removingRole,
    fetchUserRoles,
    fetchAvailableRoles,
    assignRole,
    removeRole,
  };
};